import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { iconRegistry } from "../../utils/SkillsList";
import {
  FiEdit2, FiTrash2, FiPlus, FiX, FiLogOut, FiExternalLink, FiCheck, FiUsers,
} from "react-icons/fi";
import { GiGraduateCap } from "react-icons/gi";
import { MdWork, MdMilitaryTech, MdDashboard } from "react-icons/md";
import { IoConstruct } from "react-icons/io5";
import { FcHome, FcAbout, FcContacts } from "react-icons/fc"; // eslint-disable-line no-unused-vars
import Pic from "../../assets/images/cool-dp.jpg";
import "./AdminPortfolio.css";

// ── Auth fetch helper ─────────────────────────────────────────────────────────
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

// ── Confirm modal ─────────────────────────────────────────────────────────────
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

// ── Flash banner ──────────────────────────────────────────────────────────────
const Flash = ({ msg }) =>
  msg ? <div className="ap-flash"><FiCheck /> {msg}</div> : null;

// ── Generic field ─────────────────────────────────────────────────────────────
const Field = ({ label, name, value, onChange, type = "text", as, options, placeholder }) => (
  <div className="ap-field">
    <label className="ap-field__label">{label}</label>
    {as === "textarea" ? (
      <textarea className="ap-field__input" name={name} value={value} onChange={onChange}
        rows={3} placeholder={placeholder} />
    ) : as === "select" ? (
      <select className="ap-field__input" name={name} value={value} onChange={onChange}>
        <option value="">— select icon —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input className="ap-field__input" type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder} />
    )}
  </div>
);

// ── fc helper ─────────────────────────────────────────────────────────────────
const fc = (setter) => (e) => setter((p) => ({ ...p, [e.target.name]: e.target.value }));

// ── EDUCATION SECTION ─────────────────────────────────────────────────────────
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
            <Field label="Date / Period" name="date" value={addForm.date} onChange={fc(setAddForm)} placeholder="e.g. 2019 – 2023" />
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
              <p className="ap-card__meta">{item.school} · {item.location}</p>
              <span className="ap-card__grade">{item.grade}</span>
            </div>
          )
        )}
      </div>
    </section>
  );
};

// ── WORK SECTION ──────────────────────────────────────────────────────────────
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
            <Field label="Date / Period" name="date" value={addForm.date} onChange={fc(setAddForm)} placeholder="e.g. 2023 – Present" />
            <Field label="Job Title" name="title" value={addForm.title} onChange={fc(setAddForm)} placeholder="e.g. Software Engineer" />
            <Field label="Company" name="company" value={addForm.company} onChange={fc(setAddForm)} placeholder="Company name" />
            <Field label="Location" name="location" value={addForm.location} onChange={fc(setAddForm)} placeholder="City, Country" />
            <Field label="Order" name="order" type="number" value={addForm.order} onChange={fc(setAddForm)} />
          </div>
          <Field label="Description" name="desc" value={addForm.desc} onChange={fc(setAddForm)} as="textarea" placeholder="Role description…" />
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
              <p className="ap-card__meta">{item.company} · {item.location}</p>
              <p className="ap-card__desc">{item.desc}</p>
            </div>
          )
        )}
      </div>
    </section>
  );
};

// ── SKILLS SECTION ────────────────────────────────────────────────────────────
const SKILL_BLANK = { name: "", iconName: "", order: 0 };
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

      <div className="ap-skills-grid">
        {items.length === 0 && <p className="ap-empty">No skills yet.</p>}
        {items.map((item) =>
          editId === item._id ? (
            <form className="ap-form ap-form--skill" key={item._id} onSubmit={handleEdit}>
              <Field label="Name" name="name" value={editForm.name} onChange={fc(setEditForm)} />
              <Field label="Icon" name="iconName" value={editForm.iconName} onChange={fc(setEditForm)} as="select" options={iconNames} />
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
    </section>
  );
};

// ── PROJECTS SECTION ──────────────────────────────────────────────────────────
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
        <Field label="GitHub / Link" name="link" value={form.link} onChange={fc(setForm)} placeholder="https://github.com/…" />
        <Field label="Order" name="order" type="number" value={form.order} onChange={fc(setForm)} />
      </div>
      <Field label="Tags (comma-separated)" name="tags" value={form.tags} onChange={fc(setForm)} placeholder="React, Node.js, MongoDB" />
      <Field label="Description" name="desc" value={form.desc} onChange={fc(setForm)} as="textarea" placeholder="Short project description…" />
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

// ── DASHBOARD SECTION ─────────────────────────────────────────────────────────
const DashboardSection = ({ authFetch }) => {
  const [visits, setVisits] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await authFetch("/api/v1/ps-portfolio/visits");
      const json = await res.json();
      if (json.success) { setVisits(json.data); setTotal(json.total); }
    } catch (_) {}
    setLoading(false);
  }, [authFetch]);

  useEffect(() => { load(); }, [load]);

  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  };

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

      {/* Stat cards */}
      <div className="ap-dash-stats">
        <div className="ap-dash-stat ap-dash-stat--cyan">
          <FiUsers className="ap-dash-stat__icon" />
          <div>
            <p className="ap-dash-stat__num">{loading ? "…" : total}</p>
            <p className="ap-dash-stat__label">Total Visits</p>
          </div>
        </div>
        <div className="ap-dash-stat ap-dash-stat--purple">
          <FiUsers className="ap-dash-stat__icon" />
          <div>
            <p className="ap-dash-stat__num">{loading ? "…" : new Set(visits.map((v) => v.name.toLowerCase())).size}</p>
            <p className="ap-dash-stat__label">Unique Visitors</p>
          </div>
        </div>
        <div className="ap-dash-stat ap-dash-stat--green">
          <FiUsers className="ap-dash-stat__icon" />
          <div>
            <p className="ap-dash-stat__num">
              {loading ? "…" : visits.filter((v) => {
                const since = new Date(); since.setDate(since.getDate() - 7);
                return new Date(v.visitedAt) >= since;
              }).length}
            </p>
            <p className="ap-dash-stat__label">Last 7 Days</p>
          </div>
        </div>
      </div>

      {/* Visitor table */}
      {loading ? (
        <p className="ap-dash-empty">Loading…</p>
      ) : visits.length === 0 ? (
        <p className="ap-dash-empty">No guest visits recorded yet.</p>
      ) : (
        <div className="ap-dash-table-wrap">
          <table className="ap-dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Visited At</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v, i) => (
                <tr key={v._id}>
                  <td className="ap-dash-table__num">{i + 1}</td>
                  <td className="ap-dash-table__name">{v.name}</td>
                  <td className="ap-dash-table__time">{fmt(v.visitedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

// ── MAIN ADMIN PORTFOLIO ──────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard-section", label: "Dashboard", Icon: MdDashboard },
  { id: "edu-section", label: "Education", Icon: GiGraduateCap },
  { id: "work-section", label: "Work", Icon: MdWork },
  { id: "skills-section", label: "Skills", Icon: MdMilitaryTech },
  { id: "projects-section", label: "Projects", Icon: IoConstruct },
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
      {/* ── Top admin bar ── */}
      <header className="ap-topbar">
        <div className="ap-topbar__left">
          <button className="ap-topbar__burger" onClick={() => setSidebarOpen((p) => !p)} aria-label="Toggle nav">
            ☰
          </button>
          <span className="ap-topbar__badge">⚙ Admin Mode</span>
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
        {/* ── Sidebar ── */}
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

        {/* ── Main content ── */}
        <main className="ap-main">
          <DashboardSection authFetch={authFetch} />
          <EducationsSection authFetch={authFetch} />
          <WorksSection authFetch={authFetch} />
          <SkillsSection authFetch={authFetch} />
          <ProjectsSection authFetch={authFetch} />
        </main>
      </div>
    </div>
  );
};

export default AdminPortfolio;
