﻿import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { iconRegistry } from "../../utils/SkillsList";
import {
  FiEdit2, FiTrash2, FiPlus, FiX, FiLogOut, FiExternalLink, FiCheck, FiUsers,
} from "react-icons/fi";
import { GiGraduateCap } from "react-icons/gi";
import { MdWork, MdMilitaryTech, MdDashboard } from "react-icons/md";
import { PiCertificateBold } from "react-icons/pi";
import { IoConstruct } from "react-icons/io5";
import { FcHome, FcAbout, FcContacts } from "react-icons/fc"; // eslint-disable-line no-unused-vars
import Pic from "../../assets/images/cool-dp.jpg";
import "./AdminPortfolio.css";

// â”€â”€ Auth fetch helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const useApi = (token) =>
  useCallback(
    (url, opts = {}) =>
      fetch(url, {
        ...opts,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(opts.headers || {}),
        },
      }),
    [token]
  );

// â”€â”€ Confirm modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="ap-overlay">
    <div className="ap-modal">
      <p className="ap-modal__msg">{message}</p>
      <div className="ap-modal__actions">
        <button className="ap-btn ap-btn--danger" onClick={onConfirm}>Delete</button>
        <button className="ap-btn ap-btn--ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
);

// â”€â”€ Flash banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Flash = ({ msg }) =>
  msg ? <div className="ap-flash"><FiCheck /> {msg}</div> : null;

// â”€â”€ Generic field â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Field = ({ label, name, value, onChange, type = "text", as, options, placeholder }) => (
  <div className="ap-field">
    <label className="ap-field__label">{label}</label>
    {as === "textarea" ? (
      <textarea className="ap-field__input" name={name} value={value} onChange={onChange}
        rows={3} placeholder={placeholder} />
    ) : as === "select" ? (
      <select className="ap-field__input" name={name} value={value} onChange={onChange}>
        <option value="">â€” select icon â€”</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input className="ap-field__input" type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder} />
    )}
  </div>
);

// â”€â”€ fc helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const fc = (setter) => (e) => setter((p) => ({ ...p, [e.target.name]: e.target.value }));

// â”€â”€ EDUCATION SECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const EDU_BLANK = { date: "", title: "", school: "", location: "", grade: "", order: 0 };

const EducationsSection = ({ authFetch }) => {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(EDU_BLANK);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/v1/ps-portfolio/educations");
    const json = await res.json();
    if (json.success) setItems(json.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await authFetch("/api/v1/ps-portfolio/educations", {
      method: "POST",
      body: JSON.stringify({ ...addForm, order: Number(addForm.order) }),
    });
    const json = await res.json();
    if (json.success) { setAddForm(EDU_BLANK); setShowAdd(false); load(); flash("Education added."); }
    else flash(json.message || "Failed to add");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await authFetch(`/api/v1/ps-portfolio/educations/${editId}`, {
      method: "PUT",
      body: JSON.stringify({ ...editForm, order: Number(editForm.order) }),
    });
    const json = await res.json();
    if (json.success) { setEditId(null); load(); flash("Education updated."); }
    else flash(json.message || "Failed to update");
  };

  const handleDelete = async () => {
    const res = await authFetch(`/api/v1/ps-portfolio/educations/${deleteTarget}`, { method: "DELETE" });
    const json = await res.json();
    setDeleteTarget(null);
    if (json.success) { load(); flash("Deleted."); }
  };

  return (
    <section className="ap-section" id="edu-section">
      {deleteTarget && (
        <ConfirmModal message="Delete this education entry?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
      <Flash msg={msg} />

      <div className="ap-section__header">
        <div className="ap-section__title-row">
          <GiGraduateCap className="ap-section__icon ap-section__icon--purple" />
          <h2 className="ap-section__title">Education</h2>
          <hr className="ap-section__rule" />
          <p className="ap-section__sub">My academic qualifications</p>
        </div>
        <button className="ap-btn ap-btn--add" onClick={() => { setShowAdd((p) => !p); setEditId(null); }}>
          {showAdd ? <FiX /> : <FiPlus />}
          {showAdd ? "Cancel" : "Add Education"}
        </button>
      </div>

      {showAdd && (
        <form className="ap-form" onSubmit={handleAdd}>
          <h3 className="ap-form__heading">New Education Entry</h3>
          <div className="ap-form__grid">
            <Field label="Date / Period" name="date" value={addForm.date} onChange={fc(setAddForm)} placeholder="e.g. 2019 â€“ 2023" />
            <Field label="Degree / Title" name="title" value={addForm.title} onChange={fc(setAddForm)} placeholder="e.g. B.E. in ECE" />
            <Field label="School" name="school" value={addForm.school} onChange={fc(setAddForm)} placeholder="Institution name" />
            <Field label="Location" name="location" value={addForm.location} onChange={fc(setAddForm)} placeholder="City, Country" />
            <Field label="Grade / Score" name="grade" value={addForm.grade} onChange={fc(setAddForm)} placeholder="e.g. 9.0 CGPA" />
            <Field label="Order" name="order" type="number" value={addForm.order} onChange={fc(setAddForm)} />
          </div>
          <button className="ap-btn ap-btn--primary" type="submit">Save Education</button>
        </form>
      )}

      <div className="ap-list">
        {items.length === 0 && <p className="ap-empty">No education entries yet.</p>}
        {items.map((item) =>
          editId === item._id ? (
            <form className="ap-form ap-form--inline" key={item._id} onSubmit={handleEdit}>
              <h3 className="ap-form__heading">Editing: {item.title}</h3>
              <div className="ap-form__grid">
                <Field label="Date / Period" name="date" value={editForm.date} onChange={fc(setEditForm)} />
                <Field label="Degree / Title" name="title" value={editForm.title} onChange={fc(setEditForm)} />
                <Field label="School" name="school" value={editForm.school} onChange={fc(setEditForm)} />
                <Field label="Location" name="location" value={editForm.location} onChange={fc(setEditForm)} />
                <Field label="Grade / Score" name="grade" value={editForm.grade} onChange={fc(setEditForm)} />
                <Field label="Order" name="order" type="number" value={editForm.order} onChange={fc(setEditForm)} />
              </div>
              <div className="ap-form__actions">
                <button className="ap-btn ap-btn--primary" type="submit">Save Changes</button>
                <button className="ap-btn ap-btn--ghost" type="button" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="ap-card ap-card--edu" key={item._id}>
              <div className="ap-card__controls">
                <button className="ap-icon-btn ap-icon-btn--edit" title="Edit"
                  onClick={() => { setEditId(item._id); setEditForm({ ...item }); setShowAdd(false); }}>
                  <FiEdit2 />
                </button>
                <button className="ap-icon-btn ap-icon-btn--del" title="Delete"
                  onClick={() => setDeleteTarget(item._id)}>
                  <FiTrash2 />
                </button>
              </div>
              <span className="ap-card__date">{item.date}</span>
              <h3 className="ap-card__title">{item.title}</h3>
              <p className="ap-card__meta">{item.school} Â· {item.location}</p>
              <span className="ap-card__grade">{item.grade}</span>
            </div>
          )
        )}
      </div>
    </section>
  );
};

// â”€â”€ WORK SECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const WORK_BLANK = { date: "", title: "", company: "", location: "", desc: "", order: 0 };

const WorksSection = ({ authFetch }) => {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(WORK_BLANK);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/v1/ps-portfolio/works");
    const json = await res.json();
    if (json.success) setItems(json.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await authFetch("/api/v1/ps-portfolio/works", {
      method: "POST",
      body: JSON.stringify({ ...addForm, order: Number(addForm.order) }),
    });
    const json = await res.json();
    if (json.success) { setAddForm(WORK_BLANK); setShowAdd(false); load(); flash("Work entry added."); }
    else flash(json.message || "Failed to add");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await authFetch(`/api/v1/ps-portfolio/works/${editId}`, {
      method: "PUT",
      body: JSON.stringify({ ...editForm, order: Number(editForm.order) }),
    });
    const json = await res.json();
    if (json.success) { setEditId(null); load(); flash("Work entry updated."); }
    else flash(json.message || "Failed to update");
  };

  const handleDelete = async () => {
    const res = await authFetch(`/api/v1/ps-portfolio/works/${deleteTarget}`, { method: "DELETE" });
    const json = await res.json();
    setDeleteTarget(null);
    if (json.success) { load(); flash("Deleted."); }
  };

  return (
    <section className="ap-section" id="work-section">
      {deleteTarget && (
        <ConfirmModal message="Delete this work entry?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
      <Flash msg={msg} />

      <div className="ap-section__header">
        <div className="ap-section__title-row">
          <MdWork className="ap-section__icon ap-section__icon--cyan" />
          <h2 className="ap-section__title">Work Experience</h2>
          <hr className="ap-section__rule ap-section__rule--cyan" />
          <p className="ap-section__sub">My professional journey</p>
        </div>
        <button className="ap-btn ap-btn--add" onClick={() => { setShowAdd((p) => !p); setEditId(null); }}>
          {showAdd ? <FiX /> : <FiPlus />}
          {showAdd ? "Cancel" : "Add Work Entry"}
        </button>
      </div>

      {showAdd && (
        <form className="ap-form" onSubmit={handleAdd}>
          <h3 className="ap-form__heading">New Work Entry</h3>
          <div className="ap-form__grid">
            <Field label="Date / Period" name="date" value={addForm.date} onChange={fc(setAddForm)} placeholder="e.g. 2023 â€“ Present" />
            <Field label="Job Title" name="title" value={addForm.title} onChange={fc(setAddForm)} placeholder="e.g. Software Engineer" />
            <Field label="Company" name="company" value={addForm.company} onChange={fc(setAddForm)} placeholder="Company name" />
            <Field label="Location" name="location" value={addForm.location} onChange={fc(setAddForm)} placeholder="City, Country" />
            <Field label="Order" name="order" type="number" value={addForm.order} onChange={fc(setAddForm)} />
          </div>
          <Field label="Description" name="desc" value={addForm.desc} onChange={fc(setAddForm)} as="textarea" placeholder="Role descriptionâ€¦" />
          <button className="ap-btn ap-btn--primary" type="submit">Save Work Entry</button>
        </form>
      )}

      <div className="ap-list">
        {items.length === 0 && <p className="ap-empty">No work entries yet.</p>}
        {items.map((item) =>
          editId === item._id ? (
            <form className="ap-form ap-form--inline" key={item._id} onSubmit={handleEdit}>
              <h3 className="ap-form__heading">Editing: {item.title}</h3>
              <div className="ap-form__grid">
                <Field label="Date / Period" name="date" value={editForm.date} onChange={fc(setEditForm)} />
                <Field label="Job Title" name="title" value={editForm.title} onChange={fc(setEditForm)} />
                <Field label="Company" name="company" value={editForm.company} onChange={fc(setEditForm)} />
                <Field label="Location" name="location" value={editForm.location} onChange={fc(setEditForm)} />
                <Field label="Order" name="order" type="number" value={editForm.order} onChange={fc(setEditForm)} />
              </div>
              <Field label="Description" name="desc" value={editForm.desc} onChange={fc(setEditForm)} as="textarea" />
              <div className="ap-form__actions">
                <button className="ap-btn ap-btn--primary" type="submit">Save Changes</button>
                <button className="ap-btn ap-btn--ghost" type="button" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="ap-card ap-card--work" key={item._id}>
              <div className="ap-card__controls">
                <button className="ap-icon-btn ap-icon-btn--edit" title="Edit"
                  onClick={() => { setEditId(item._id); setEditForm({ ...item }); setShowAdd(false); }}>
                  <FiEdit2 />
                </button>
                <button className="ap-icon-btn ap-icon-btn--del" title="Delete"
                  onClick={() => setDeleteTarget(item._id)}>
                  <FiTrash2 />
                </button>
              </div>
              <span className="ap-card__date">{item.date}</span>
              <h3 className="ap-card__title">{item.title}</h3>
              <p className="ap-card__meta">{item.company} Â· {item.location}</p>
              <p className="ap-card__desc">{item.desc}</p>
            </div>
          )
        )}
      </div>
    </section>
  );
};

// â”€â”€ SKILLS SECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SKILL_CATEGORIES = ["Languages", "Frontend", "Frameworks & Libraries", "Databases", "DevOps", "Tools"];
const SKILL_BLANK = { name: "", iconName: "", category: "", order: 0 };
const iconNames = Object.keys(iconRegistry);

const SkillsSection = ({ authFetch }) => {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(SKILL_BLANK);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/v1/ps-portfolio/skills");
    const json = await res.json();
    if (json.success) setItems(json.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await authFetch("/api/v1/ps-portfolio/skills", {
      method: "POST",
      body: JSON.stringify({ ...addForm, order: Number(addForm.order) }),
    });
    const json = await res.json();
    if (json.success) { setAddForm(SKILL_BLANK); setShowAdd(false); load(); flash("Skill added."); }
    else flash(json.message || "Failed to add");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await authFetch(`/api/v1/ps-portfolio/skills/${editId}`, {
      method: "PUT",
      body: JSON.stringify({ ...editForm, order: Number(editForm.order) }),
    });
    const json = await res.json();
    if (json.success) { setEditId(null); load(); flash("Skill updated."); }
    else flash(json.message || "Failed to update");
  };

  const handleDelete = async () => {
    const res = await authFetch(`/api/v1/ps-portfolio/skills/${deleteTarget}`, { method: "DELETE" });
    const json = await res.json();
    setDeleteTarget(null);
    if (json.success) { load(); flash("Deleted."); }
  };

  const SkillIcon = ({ iconName }) => {
    const Icon = iconRegistry[iconName];
    return Icon ? <Icon className="ap-skill__icon" /> : <span className="ap-skill__icon-ph">?</span>;
  };

  return (
    <section className="ap-section" id="skills-section">
      {deleteTarget && (
        <ConfirmModal message="Delete this skill?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
      <Flash msg={msg} />

      <div className="ap-section__header">
        <div className="ap-section__title-row">
          <MdMilitaryTech className="ap-section__icon ap-section__icon--green" />
          <h2 className="ap-section__title">Skills</h2>
          <hr className="ap-section__rule ap-section__rule--green" />
          <p className="ap-section__sub">Languages, frameworks, databases, and tools</p>
        </div>
        <button className="ap-btn ap-btn--add" onClick={() => { setShowAdd((p) => !p); setEditId(null); }}>
          {showAdd ? <FiX /> : <FiPlus />}
          {showAdd ? "Cancel" : "Add Skill"}
        </button>
      </div>

      {showAdd && (
        <form className="ap-form" onSubmit={handleAdd}>
          <h3 className="ap-form__heading">New Skill</h3>
          <div className="ap-form__grid ap-form__grid--3">
            <Field label="Skill Name" name="name" value={addForm.name} onChange={fc(setAddForm)} placeholder="e.g. TypeScript" />
            <Field label="Icon Name" name="iconName" value={addForm.iconName} onChange={fc(setAddForm)} as="select" options={iconNames} />
            <Field label="Category" name="category" value={addForm.category} onChange={fc(setAddForm)} as="select" options={SKILL_CATEGORIES} />
            <Field label="Order" name="order" type="number" value={addForm.order} onChange={fc(setAddForm)} />
          </div>
          {addForm.iconName && (
            <div className="ap-icon-preview">
              Preview: <SkillIcon iconName={addForm.iconName} /> <span>{addForm.iconName}</span>
            </div>
          )}
          <button className="ap-btn ap-btn--primary" type="submit">Save Skill</button>
        </form>
      )}

      {items.length === 0 && <p className="ap-empty">No skills yet.</p>}
      {(() => {
        const categorised = SKILL_CATEGORIES.map((cat) => ({
          cat,
          skills: items.filter((s) => s.category === cat),
        })).filter(({ skills }) => skills.length > 0);
        const uncategorised = items.filter((s) => !s.category || !SKILL_CATEGORIES.includes(s.category));
        if (uncategorised.length > 0) categorised.push({ cat: "Other", skills: uncategorised });

        return categorised.map(({ cat, skills }) => (
          <div key={cat} className="ap-skills-group">
            <h3 className="ap-skills-group__title">{cat}</h3>
            <div className="ap-skills-grid">
              {skills.map((item) =>
                editId === item._id ? (
                  <form className="ap-form ap-form--skill" key={item._id} onSubmit={handleEdit}>
                    <Field label="Name" name="name" value={editForm.name} onChange={fc(setEditForm)} />
                    <Field label="Icon" name="iconName" value={editForm.iconName} onChange={fc(setEditForm)} as="select" options={iconNames} />
                    <Field label="Category" name="category" value={editForm.category || ""} onChange={fc(setEditForm)} as="select" options={SKILL_CATEGORIES} />
                    <Field label="Order" name="order" type="number" value={editForm.order} onChange={fc(setEditForm)} />
                    {editForm.iconName && <div className="ap-icon-preview"><SkillIcon iconName={editForm.iconName} /></div>}
                    <div className="ap-form__actions">
                      <button className="ap-btn ap-btn--primary ap-btn--xs" type="submit">Save</button>
                      <button className="ap-btn ap-btn--ghost ap-btn--xs" type="button" onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="ap-skill-card glass-card" key={item._id}>
                    <SkillIcon iconName={item.iconName} />
                    <span className="ap-skill__name">{item.name}</span>
                    <div className="ap-skill-card__controls">
                      <button className="ap-icon-btn ap-icon-btn--edit ap-icon-btn--xs" title="Edit"
                        onClick={() => { setEditId(item._id); setEditForm({ ...item }); setShowAdd(false); }}>
                        <FiEdit2 />
                      </button>
                      <button className="ap-icon-btn ap-icon-btn--del ap-icon-btn--xs" title="Delete"
                        onClick={() => setDeleteTarget(item._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ));
      })()}
    </section>
  );
};

// â”€â”€ PROJECTS SECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PROJ_BLANK = { imageKey: "", type: "", typeColor: "#7c3aed", tags: "", title: "", desc: "", link: "", order: 0 };

const ProjectsSection = ({ authFetch }) => {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(PROJ_BLANK);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/v1/ps-portfolio/projects");
    const json = await res.json();
    if (json.success) setItems(json.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };

  const toForm = (item) => ({ ...item, tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags });
  const fromForm = (form) => ({
    ...form,
    order: Number(form.order),
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await authFetch("/api/v1/ps-portfolio/projects", {
      method: "POST",
      body: JSON.stringify(fromForm(addForm)),
    });
    const json = await res.json();
    if (json.success) { setAddForm(PROJ_BLANK); setShowAdd(false); load(); flash("Project added."); }
    else flash(json.message || "Failed to add");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await authFetch(`/api/v1/ps-portfolio/projects/${editId}`, {
      method: "PUT",
      body: JSON.stringify(fromForm(editForm)),
    });
    const json = await res.json();
    if (json.success) { setEditId(null); load(); flash("Project updated."); }
    else flash(json.message || "Failed to update");
  };

  const handleDelete = async () => {
    const res = await authFetch(`/api/v1/ps-portfolio/projects/${deleteTarget}`, { method: "DELETE" });
    const json = await res.json();
    setDeleteTarget(null);
    if (json.success) { load(); flash("Deleted."); }
  };

  const ProjectForm = ({ form, setForm, onSubmit, submitLabel, onCancel, heading }) => (
    <form className="ap-form ap-form--inline" onSubmit={onSubmit}>
      {heading && <h3 className="ap-form__heading">{heading}</h3>}
      <div className="ap-form__grid">
        <Field label="Title" name="title" value={form.title} onChange={fc(setForm)} placeholder="Project title" />
        <Field label="Type Label" name="type" value={form.type} onChange={fc(setForm)} placeholder="e.g. Full Stack" />
        <Field label="Badge Color" name="typeColor" type="color" value={form.typeColor} onChange={fc(setForm)} />
        <Field label="Image Key" name="imageKey" value={form.imageKey} onChange={fc(setForm)} placeholder="e.g. Portfolio (matches imageMap)" />
        <Field label="GitHub / Link" name="link" value={form.link} onChange={fc(setForm)} placeholder="https://github.com/â€¦" />
        <Field label="Order" name="order" type="number" value={form.order} onChange={fc(setForm)} />
      </div>
      <Field label="Tags (comma-separated)" name="tags" value={form.tags} onChange={fc(setForm)} placeholder="React, Node.js, MongoDB" />
      <Field label="Description" name="desc" value={form.desc} onChange={fc(setForm)} as="textarea" placeholder="Short project descriptionâ€¦" />
      <div className="ap-form__actions">
        <button className="ap-btn ap-btn--primary" type="submit">{submitLabel}</button>
        {onCancel && <button className="ap-btn ap-btn--ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );

  return (
    <section className="ap-section" id="projects-section">
      {deleteTarget && (
        <ConfirmModal message="Delete this project?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
      <Flash msg={msg} />

      <div className="ap-section__header">
        <div className="ap-section__title-row">
          <IoConstruct className="ap-section__icon ap-section__icon--orange" />
          <h2 className="ap-section__title">Projects</h2>
          <hr className="ap-section__rule ap-section__rule--orange" />
          <p className="ap-section__sub">My top recent projects</p>
        </div>
        <button className="ap-btn ap-btn--add" onClick={() => { setShowAdd((p) => !p); setEditId(null); }}>
          {showAdd ? <FiX /> : <FiPlus />}
          {showAdd ? "Cancel" : "Add Project"}
        </button>
      </div>

      {showAdd && (
        <ProjectForm
          form={addForm} setForm={setAddForm}
          onSubmit={handleAdd} submitLabel="Save Project"
          heading="New Project"
        />
      )}

      <div className="ap-projects-grid">
        {items.length === 0 && <p className="ap-empty">No projects yet.</p>}
        {items.map((item) =>
          editId === item._id ? (
            <ProjectForm
              key={item._id}
              form={editForm} setForm={setEditForm}
              onSubmit={handleEdit} submitLabel="Save Changes"
              onCancel={() => setEditId(null)}
              heading={`Editing: ${item.title}`}
            />
          ) : (
            <div className="ap-proj-card glass-card" key={item._id}>
              <div className="ap-card__controls">
                <button className="ap-icon-btn ap-icon-btn--edit" title="Edit"
                  onClick={() => { setEditId(item._id); setEditForm(toForm(item)); setShowAdd(false); }}>
                  <FiEdit2 />
                </button>
                <button className="ap-icon-btn ap-icon-btn--del" title="Delete"
                  onClick={() => setDeleteTarget(item._id)}>
                  <FiTrash2 />
                </button>
              </div>
              <span className="ap-proj-card__badge" style={{ background: item.typeColor }}>
                {item.type}
              </span>
              <h3 className="ap-proj-card__title">{item.title}</h3>
              <div className="ap-proj-card__tags">
                {item.tags?.map((t) => <span key={t} className="ap-proj-card__tag">{t}</span>)}
              </div>
              <p className="ap-proj-card__desc">{item.desc}</p>
              <a className="ap-proj-card__link" href={item.link} target="_blank" rel="noreferrer">
                <FiExternalLink size={13} /> View on GitHub
              </a>
            </div>
          )
        )}
      </div>
    </section>
  );
};

// â”€â”€ CERTIFICATIONS SECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CERT_BLANK = { title: "", issuer: "", date: "", link: "", order: 0 };

const CertificationsSection = ({ authFetch }) => {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(CERT_BLANK);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/v1/ps-portfolio/certifications");
    const json = await res.json();
    if (json.success) setItems(json.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await authFetch("/api/v1/ps-portfolio/certifications", {
      method: "POST",
      body: JSON.stringify({ ...addForm, order: Number(addForm.order) }),
    });
    const json = await res.json();
    if (json.success) { setAddForm(CERT_BLANK); setShowAdd(false); load(); flash("Certification added."); }
    else flash(json.message || "Failed to add");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await authFetch(`/api/v1/ps-portfolio/certifications/${editId}`, {
      method: "PUT",
      body: JSON.stringify({ ...editForm, order: Number(editForm.order) }),
    });
    const json = await res.json();
    if (json.success) { setEditId(null); load(); flash("Certification updated."); }
    else flash(json.message || "Failed to update");
  };

  const handleDelete = async () => {
    const res = await authFetch(`/api/v1/ps-portfolio/certifications/${deleteTarget}`, { method: "DELETE" });
    const json = await res.json();
    setDeleteTarget(null);
    if (json.success) { load(); flash("Deleted."); }
  };

  return (
    <section className="ap-section" id="certifications-section">
      {deleteTarget && (
        <ConfirmModal message="Delete this certification?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
      <Flash msg={msg} />

      <div className="ap-section__header">
        <div className="ap-section__title-row">
          <PiCertificateBold className="ap-section__icon ap-section__icon--purple" />
          <h2 className="ap-section__title">Certifications</h2>
          <hr className="ap-section__rule" />
          <p className="ap-section__sub">Courses and certificates earned</p>
        </div>
        <button className="ap-btn ap-btn--add" onClick={() => { setShowAdd((p) => !p); setEditId(null); }}>
          {showAdd ? <FiX /> : <FiPlus />}
          {showAdd ? "Cancel" : "Add Certification"}
        </button>
      </div>

      {showAdd && (
        <form className="ap-form" onSubmit={handleAdd}>
          <h3 className="ap-form__heading">New Certification</h3>
          <div className="ap-form__grid">
            <Field label="Title" name="title" value={addForm.title} onChange={fc(setAddForm)} placeholder="e.g. AWS Cloud Practitioner" />
            <Field label="Issuer" name="issuer" value={addForm.issuer} onChange={fc(setAddForm)} placeholder="e.g. Udemy, Coursera, NPTEL" />
            <Field label="Date" name="date" value={addForm.date} onChange={fc(setAddForm)} placeholder="e.g. May 2026" />
            <Field label="Certificate Link" name="link" value={addForm.link} onChange={fc(setAddForm)} placeholder="https://â€¦" />
            <Field label="Order" name="order" type="number" value={addForm.order} onChange={fc(setAddForm)} />
          </div>
          <button className="ap-btn ap-btn--primary" type="submit">Save Certification</button>
        </form>
      )}

      <div className="ap-list">
        {items.length === 0 && <p className="ap-empty">No certifications yet.</p>}
        {items.map((item) =>
          editId === item._id ? (
            <form className="ap-form ap-form--inline" key={item._id} onSubmit={handleEdit}>
              <h3 className="ap-form__heading">Editing: {item.title}</h3>
              <div className="ap-form__grid">
                <Field label="Title" name="title" value={editForm.title} onChange={fc(setEditForm)} />
                <Field label="Issuer" name="issuer" value={editForm.issuer} onChange={fc(setEditForm)} />
                <Field label="Date" name="date" value={editForm.date} onChange={fc(setEditForm)} />
                <Field label="Certificate Link" name="link" value={editForm.link} onChange={fc(setEditForm)} />
                <Field label="Order" name="order" type="number" value={editForm.order} onChange={fc(setEditForm)} />
              </div>
              <div className="ap-form__actions">
                <button className="ap-btn ap-btn--primary" type="submit">Save Changes</button>
                <button className="ap-btn ap-btn--ghost" type="button" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="ap-card ap-card--cert" key={item._id}>
              <div className="ap-card__controls">
                <button className="ap-icon-btn ap-icon-btn--edit" title="Edit"
                  onClick={() => { setEditId(item._id); setEditForm({ ...item }); setShowAdd(false); }}>
                  <FiEdit2 />
                </button>
                <button className="ap-icon-btn ap-icon-btn--del" title="Delete"
                  onClick={() => setDeleteTarget(item._id)}>
                  <FiTrash2 />
                </button>
              </div>
              <span className="ap-card__date">{item.date}</span>
              <h3 className="ap-card__title">{item.title}</h3>
              <p className="ap-card__meta">{item.issuer}</p>
              <a className="ap-cert-link" href={item.link} target="_blank" rel="noreferrer">
                <FiExternalLink size={13} /> View Certificate
              </a>
            </div>
          )
        )}
      </div>
    </section>
  );
};

// â”€â”€ DASHBOARD SECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const VIS_PAGE_SIZE = 10;

// Reusable SVG bar chart
const BarChart = ({ buckets, maxVal, gradId, gradFrom, gradTo, skipEvery = 1, height = 200 }) => {
  const CW = 420, CH = height;
  const P = { t: 20, r: 12, b: 38, l: 32 };
  const pw = CW - P.l - P.r;
  const ph = CH - P.t - P.b;
  const bw = Math.max(pw / buckets.length - 4, 5);
  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" className="ap-dash-svg">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradFrom} />
          <stop offset="100%" stopColor={gradTo} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((f) => {
        const y = P.t + ph * (1 - f);
        return (
          <g key={f}>
            <line x1={P.l} x2={CW - P.r} y1={y} y2={y} stroke="rgba(110,100,230,0.15)" strokeDasharray="4,3" />
            <text x={P.l - 5} y={y + 4} textAnchor="end" fontSize="9" fill="#475569">
              {Math.round(maxVal * f)}
            </text>
          </g>
        );
      })}
      {buckets.map(({ label, count }, i) => {
        const x = P.l + i * (pw / buckets.length) + (pw / buckets.length - bw) / 2;
        const barH = Math.max((count / maxVal) * ph, count > 0 ? 3 : 0);
        const y = P.t + ph - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={barH || 2} rx="3"
              fill={count > 0 ? `url(#${gradId})` : "rgba(110,100,230,0.08)"} />
            {count > 0 && (
              <text x={x + bw / 2} y={y - 3} textAnchor="middle" fontSize="8" fill={gradFrom}>{count}</text>
            )}
            {i % skipEvery === 0 && (
              <text x={x + bw / 2} y={CH - 5} textAnchor="middle" fontSize="8" fill="#475569">{label}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const DashboardSection = ({ authFetch }) => {
  const [visits, setVisits] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [contentCounts, setContentCounts] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("visitedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [visRes, eduRes, workRes, projRes, skillRes, certRes] = await Promise.all([
        authFetch("/api/v1/ps-portfolio/visits"),
        fetch("/api/v1/ps-portfolio/educations"),
        fetch("/api/v1/ps-portfolio/works"),
        fetch("/api/v1/ps-portfolio/projects"),
        fetch("/api/v1/ps-portfolio/skills"),
        fetch("/api/v1/ps-portfolio/certifications"),
      ]);
      const [visJson, eduJson, workJson, projJson, skillJson, certJson] = await Promise.all([
        visRes.json(), eduRes.json(), workRes.json(), projRes.json(), skillRes.json(), certRes.json(),
      ]);
      if (visJson.success) { setVisits(visJson.data); setTotal(visJson.total); }
      setContentCounts({
        projects: projJson.success ? projJson.data.length : 0,
        skills: skillJson.success ? skillJson.data.length : 0,
        certifications: certJson.success ? certJson.data.length : 0,
        works: workJson.success ? workJson.data.length : 0,
        educations: eduJson.success ? eduJson.data.length : 0,
      });
    } catch (_) {}
    setLoading(false);
  }, [authFetch]);

  useEffect(() => { load(); }, [load]);

  const fmt = (iso) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  // â”€â”€ Derived visitor stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const nameCounts = {};
  visits.forEach((v) => {
    const k = v.name.toLowerCase();
    nameCounts[k] = (nameCounts[k] || 0) + 1;
  });
  const uniqueCount = Object.keys(nameCounts).length;
  const returningCount = Object.values(nameCounts).filter((c) => c > 1).length;
  const newCount = uniqueCount - returningCount;
  const last7 = visits.filter((v) => {
    const since = new Date(); since.setDate(since.getDate() - 7);
    return new Date(v.visitedAt) >= since;
  }).length;

  // Top 5 repeaters
  const topRepeaters = Object.entries(nameCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Peak hour (0-23)
  const hourCounts = Array(24).fill(0);
  visits.forEach((v) => { hourCounts[new Date(v.visitedAt).getHours()]++; });
  const maxHour = Math.max(...hourCounts, 1);
  const hourBuckets = hourCounts.map((count, h) => ({ label: `${h}h`, count }));

  // Day of week (Sun=0â€¦Sat=6)
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayCounts = Array(7).fill(0);
  visits.forEach((v) => { dayCounts[new Date(v.visitedAt).getDay()]++; });
  const maxDay = Math.max(...dayCounts, 1);
  const dowBuckets = dayCounts.map((count, d) => ({ label: DAY_NAMES[d], count }));

  // Daily buckets (14 days)
  const DAY_MS = 86400000;
  const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
  const dayBuckets = Array.from({ length: 14 }, (_, i) => {
    const start = new Date(+todayEnd - (13 - i) * DAY_MS); start.setHours(0, 0, 0, 0);
    const end   = new Date(start); end.setHours(23, 59, 59, 999);
    const label = start.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    const count = visits.filter((v) => { const d = new Date(v.visitedAt); return d >= start && d <= end; }).length;
    return { label, count };
  });
  const maxDay14 = Math.max(...dayBuckets.map((b) => b.count), 1);

  // Monthly buckets (6 months)
  const monthBuckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - (5 - i));
    const year = d.getFullYear(), month = d.getMonth();
    const label = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    const count = visits.filter((v) => {
      const vd = new Date(v.visitedAt);
      return vd.getFullYear() === year && vd.getMonth() === month;
    }).length;
    return { label, count };
  });
  const maxMonth = Math.max(...monthBuckets.map((b) => b.count), 1);

  // â”€â”€ Filter + sort + paginate â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const filtered = visits.filter((v) => v.name.toLowerCase().includes(filter.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "name") return sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    const da = new Date(a.visitedAt), db = new Date(b.visitedAt);
    return sortDir === "asc" ? da - db : db - da;
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / VIS_PAGE_SIZE));
  const curPage   = Math.min(page, totalPages);
  const pageData  = sorted.slice((curPage - 1) * VIS_PAGE_SIZE, curPage * VIS_PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };
  const SortArrow = ({ col }) =>
    sortKey !== col
      ? <span className="ap-sort-arrow">â†•</span>
      : <span className="ap-sort-arrow ap-sort-arrow--on">{sortDir === "asc" ? "â†‘" : "â†“"}</span>;

  return (
    <section className="ap-section" id="dashboard-section">
      <div className="ap-section__header">
        <div className="ap-section__title-row">
          <MdDashboard className="ap-section__icon ap-section__icon--cyan" />
          <h2 className="ap-section__title">Visitor Dashboard</h2>
          <hr className="ap-section__rule ap-section__rule--cyan" />
          <p className="ap-section__sub">Guest visits logged since CMS launch</p>
        </div>
        <button className="ap-btn ap-btn--ghost ap-btn--sm" onClick={load}>Refresh</button>
      </div>

      {/* â”€â”€ Visitor stat cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="ap-dash-stats">
        {[
          { label: "Total Visits",    num: total,          color: "cyan"   },
          { label: "Unique Visitors", num: uniqueCount,    color: "purple" },
          { label: "Last 7 Days",     num: last7,          color: "green"  },
          { label: "Returning",       num: returningCount, color: "orange" },
          { label: "First-time",      num: newCount,       color: "pink"   },
        ].map(({ label, num, color }) => (
          <div key={label} className={`ap-dash-stat ap-dash-stat--${color}`}>
            <FiUsers className="ap-dash-stat__icon" />
            <div>
              <p className="ap-dash-stat__num">{loading ? "â€¦" : num}</p>
              <p className="ap-dash-stat__label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* â”€â”€ Content count cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="ap-dash-content-counts">
        {[
          { label: "Projects",       key: "projects",       Icon: IoConstruct,    color: "cyan"   },
          { label: "Skills",         key: "skills",         Icon: MdMilitaryTech, color: "purple" },
          { label: "Certifications", key: "certifications", Icon: PiCertificateBold, color: "green" },
          { label: "Work Entries",   key: "works",          Icon: MdWork,         color: "orange" },
          { label: "Educations",     key: "educations",     Icon: GiGraduateCap,  color: "pink"   },
        ].map(({ label, key, Icon, color }) => (
          <div key={key} className={`ap-dash-count-card ap-dash-count-card--${color}`}>
            <Icon className="ap-dash-count-card__icon" />
            <span className="ap-dash-count-card__num">{contentCounts ? contentCounts[key] : "â€¦"}</span>
            <span className="ap-dash-count-card__label">{label}</span>
          </div>
        ))}
      </div>

      {/* â”€â”€ Charts row (3 columns) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="ap-dash-charts-row">
        {/* Daily chart */}
        <div className="ap-dash-chart-wrap">
          <p className="ap-dash-chart-label">Daily Visits Â· last 14 days</p>
          <BarChart buckets={dayBuckets} maxVal={maxDay14} gradId="apvg-daily"
            gradFrom="#06b6d4" gradTo="#7c3aed" skipEvery={2} />
        </div>

        {/* Monthly chart */}
        <div className="ap-dash-chart-wrap">
          <p className="ap-dash-chart-label">Monthly Trend Â· last 6 months</p>
          <BarChart buckets={monthBuckets} maxVal={maxMonth} gradId="apvg-monthly"
            gradFrom="#a78bfa" gradTo="#ec4899" skipEvery={1} />
        </div>

        {/* Insights panel: top repeaters + peak hour */}
        <div className="ap-dash-chart-wrap">
          <p className="ap-dash-chart-label">Top Returning Visitors</p>
          {topRepeaters.length === 0 ? (
            <p className="ap-dash-empty" style={{ marginTop: "0.75rem" }}>No repeat visitors yet.</p>
          ) : (
            <div className="ap-dash-repeaters">
              {topRepeaters.map(([name, count], i) => (
                <div key={name} className="ap-dash-repeater">
                  <span className="ap-dash-repeater__rank">#{i + 1}</span>
                  <span className="ap-dash-repeater__name">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </span>
                  <div className="ap-dash-repeater__bar-wrap">
                    <div className="ap-dash-repeater__bar"
                      style={{ width: `${(count / topRepeaters[0][1]) * 100}%` }} />
                  </div>
                  <span className="ap-dash-repeater__count">{count}</span>
                </div>
              ))}
            </div>
          )}

          <p className="ap-dash-chart-label" style={{ marginTop: "1.25rem" }}>Peak Visit Hours</p>
          <BarChart buckets={hourBuckets} maxVal={maxHour} gradId="apvg-hour"
            gradFrom="#10b981" gradTo="#06b6d4" skipEvery={6} height={130} />
        </div>
      </div>

      {/* â”€â”€ Day of week â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="ap-dash-chart-wrap ap-dash-chart-wrap--full">
        <p className="ap-dash-chart-label">Visits by Day of Week</p>
        <BarChart buckets={dowBuckets} maxVal={maxDay} gradId="apvg-dow"
          gradFrom="#f97316" gradTo="#ec4899" skipEvery={1} height={150} />
      </div>

      {/* â”€â”€ Visitor table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="ap-dash-table-panel">
        <input
          className="ap-dash-filter"
          placeholder="Filter by nameâ€¦"
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
        />

        {loading ? (
          <p className="ap-dash-empty">Loadingâ€¦</p>
        ) : visits.length === 0 ? (
          <p className="ap-dash-empty">No guest visits recorded yet.</p>
        ) : (
          <>
            <div className="ap-dash-table-wrap">
              <table className="ap-dash-table">
                <thead>
                  <tr>
                    <th className="ap-dash-table__th-num">#</th>
                    <th className="ap-dash-table__th-sort" onClick={() => toggleSort("name")}>
                      Name <SortArrow col="name" />
                    </th>
                    <th className="ap-dash-table__th-sort" onClick={() => toggleSort("visitedAt")}>
                      Visited At <SortArrow col="visitedAt" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((v, idx) => (
                    <tr key={v._id}>
                      <td className="ap-dash-table__num">{(curPage - 1) * VIS_PAGE_SIZE + idx + 1}</td>
                      <td className="ap-dash-table__name">{v.name}</td>
                      <td className="ap-dash-table__time">{fmt(v.visitedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ap-dash-pagination">
              <button className="ap-btn ap-btn--ghost ap-btn--sm"
                disabled={curPage === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
              <span className="ap-dash-page-info">Page {curPage} of {totalPages}</span>
              <button className="ap-btn ap-btn--ghost ap-btn--sm"
                disabled={curPage === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// â”€â”€ MAIN ADMIN PORTFOLIO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const navItems = [
  { id: "dashboard-section", label: "Dashboard", Icon: MdDashboard },
  { id: "edu-section", label: "Education", Icon: GiGraduateCap },
  { id: "work-section", label: "Work", Icon: MdWork },
  { id: "skills-section", label: "Skills", Icon: MdMilitaryTech },
  { id: "projects-section", label: "Projects", Icon: IoConstruct },
  { id: "certifications-section", label: "Certifications", Icon: PiCertificateBold },
];

const AdminPortfolio = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const authFetch = useApi(token);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  return (
    <div className="ap-root">
      {/* â”€â”€ Top admin bar â”€â”€ */}
      <header className="ap-topbar">
        <div className="ap-topbar__left">
          <button className="ap-topbar__burger" onClick={() => setSidebarOpen((p) => !p)} aria-label="Toggle nav">
            â˜°
          </button>
          <span className="ap-topbar__badge">âš™ Admin Mode</span>
        </div>
        <div className="ap-topbar__right">
          <a href="/portfolio" target="_blank" rel="noreferrer" className="ap-btn ap-btn--ghost ap-btn--sm">
            View Public Site <FiExternalLink size={13} />
          </a>
          <button className="ap-btn ap-btn--danger ap-btn--sm" onClick={handleLogout}>
            <FiLogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="ap-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="ap-layout">
        {/* â”€â”€ Sidebar â”€â”€ */}
        <aside className={`ap-sidebar ${sidebarOpen ? "ap-sidebar--open" : ""}`}>
          <div className="ap-sidebar__profile">
            <img src={Pic} alt="Priyanshu" className="ap-sidebar__pic" />
            <div>
              <p className="ap-sidebar__name">Priyanshu</p>
              <p className="ap-sidebar__role">Admin Portal</p>
            </div>
          </div>

          <nav className="ap-sidebar__nav">
            {navItems.map(({ id, label, Icon }) => (
              <button key={id} className="ap-nav-item" onClick={() => scrollTo(id)}>
                <Icon className="ap-nav-item__icon" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="ap-sidebar__sep" />

          <div className="ap-sidebar__footer">
            <a href="/portfolio" target="_blank" rel="noreferrer" className="ap-nav-item ap-nav-item--muted">
              <FiExternalLink className="ap-nav-item__icon" />
              <span>Public Site</span>
            </a>
            <button className="ap-nav-item ap-nav-item--danger" onClick={handleLogout}>
              <FiLogOut className="ap-nav-item__icon" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* â”€â”€ Main content â”€â”€ */}
        <main className="ap-main">
          <DashboardSection authFetch={authFetch} />
          <EducationsSection authFetch={authFetch} />
          <WorksSection authFetch={authFetch} />
          <SkillsSection authFetch={authFetch} />
          <ProjectsSection authFetch={authFetch} />
          <CertificationsSection authFetch={authFetch} />
        </main>
      </div>
    </div>
  );
};

export default AdminPortfolio;
