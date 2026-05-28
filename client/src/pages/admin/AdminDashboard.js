import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { iconRegistry } from "../../utils/SkillsList";
import "./AdminDashboard.css";

// ── Shared API helper ─────────────────────────────────────────────────────────
const useApi = (token) => {
  const authFetch = useCallback(
    (url, options = {}) =>
      fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      }),
    [token]
  );
  return authFetch;
};

// ── Confirmation Modal ────────────────────────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="adm-modal-overlay">
    <div className="adm-modal">
      <p className="adm-modal__msg">{message}</p>
      <div className="adm-modal__actions">
        <button className="adm-btn adm-btn--danger" onClick={onConfirm}>Delete</button>
        <button className="adm-btn adm-btn--ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
);

// ── Generic form field renderer ───────────────────────────────────────────────
const Field = ({ label, name, value, onChange, type = "text", as, options, placeholder }) => (
  <div className="adm-field">
    <label className="adm-field__label">{label}</label>
    {as === "textarea" ? (
      <textarea
        className="adm-field__input"
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        placeholder={placeholder}
      />
    ) : as === "select" ? (
      <select className="adm-field__input" name={name} value={value} onChange={onChange}>
        <option value="">— select —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input
        className="adm-field__input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    )}
  </div>
);

// ── EDUCATIONS section ────────────────────────────────────────────────────────
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

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

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

  const startEdit = (item) => { setEditId(item._id); setEditForm({ ...item }); };

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
    if (json.success) { load(); flash("Education deleted."); }
    else flash(json.message || "Failed to delete");
  };

  const fc = (setter) => (e) => setter((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="adm-section">
      {msg && <div className="adm-flash">{msg}</div>}
      {deleteTarget && (
        <ConfirmModal
          message="Delete this education entry?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="adm-section__header">
        <h2 className="adm-section__title">Educations</h2>
        <button className="adm-btn adm-btn--primary" onClick={() => setShowAdd((p) => !p)}>
          {showAdd ? "Cancel" : "+ Add New"}
        </button>
      </div>

      {showAdd && (
        <form className="adm-form" onSubmit={handleAdd}>
          <h3 className="adm-form__heading">New Education</h3>
          <div className="adm-form__grid">
            <Field label="Date / Period" name="date" value={addForm.date} onChange={fc(setAddForm)} placeholder="e.g. 2019 – 2023" />
            <Field label="Degree / Title" name="title" value={addForm.title} onChange={fc(setAddForm)} placeholder="e.g. B.E. in ECE" />
            <Field label="School" name="school" value={addForm.school} onChange={fc(setAddForm)} placeholder="Institution name" />
            <Field label="Location" name="location" value={addForm.location} onChange={fc(setAddForm)} placeholder="City, Country" />
            <Field label="Grade / Score" name="grade" value={addForm.grade} onChange={fc(setAddForm)} placeholder="e.g. 9.0 CGPA" />
            <Field label="Order" name="order" type="number" value={addForm.order} onChange={fc(setAddForm)} />
          </div>
          <button className="adm-btn adm-btn--primary" type="submit">Save</button>
        </form>
      )}

      <div className="adm-list">
        {items.length === 0 && <p className="adm-empty">No entries yet.</p>}
        {items.map((item) =>
          editId === item._id ? (
            <form className="adm-form adm-form--inline" key={item._id} onSubmit={handleEdit}>
              <div className="adm-form__grid">
                <Field label="Date / Period" name="date" value={editForm.date} onChange={fc(setEditForm)} />
                <Field label="Degree / Title" name="title" value={editForm.title} onChange={fc(setEditForm)} />
                <Field label="School" name="school" value={editForm.school} onChange={fc(setEditForm)} />
                <Field label="Location" name="location" value={editForm.location} onChange={fc(setEditForm)} />
                <Field label="Grade / Score" name="grade" value={editForm.grade} onChange={fc(setEditForm)} />
                <Field label="Order" name="order" type="number" value={editForm.order} onChange={fc(setEditForm)} />
              </div>
              <div className="adm-form__actions">
                <button className="adm-btn adm-btn--primary" type="submit">Update</button>
                <button className="adm-btn adm-btn--ghost" type="button" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="adm-card" key={item._id}>
              <div className="adm-card__body">
                <span className="adm-card__badge">{item.date}</span>
                <strong className="adm-card__title">{item.title}</strong>
                <span className="adm-card__sub">{item.school} · {item.location} · {item.grade}</span>
              </div>
              <div className="adm-card__actions">
                <button className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => startEdit(item)}>Edit</button>
                <button className="adm-btn adm-btn--sm adm-btn--danger-ghost" onClick={() => setDeleteTarget(item._id)}>Delete</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// ── WORKS section ─────────────────────────────────────────────────────────────
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

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

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

  const startEdit = (item) => { setEditId(item._id); setEditForm({ ...item }); };

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
    if (json.success) { load(); flash("Work entry deleted."); }
    else flash(json.message || "Failed to delete");
  };

  const fc = (setter) => (e) => setter((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="adm-section">
      {msg && <div className="adm-flash">{msg}</div>}
      {deleteTarget && (
        <ConfirmModal
          message="Delete this work entry?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="adm-section__header">
        <h2 className="adm-section__title">Work Experience</h2>
        <button className="adm-btn adm-btn--primary" onClick={() => setShowAdd((p) => !p)}>
          {showAdd ? "Cancel" : "+ Add New"}
        </button>
      </div>

      {showAdd && (
        <form className="adm-form" onSubmit={handleAdd}>
          <h3 className="adm-form__heading">New Work Entry</h3>
          <div className="adm-form__grid">
            <Field label="Date / Period" name="date" value={addForm.date} onChange={fc(setAddForm)} placeholder="e.g. 2023 – Present" />
            <Field label="Job Title" name="title" value={addForm.title} onChange={fc(setAddForm)} placeholder="e.g. Software Engineer" />
            <Field label="Company" name="company" value={addForm.company} onChange={fc(setAddForm)} placeholder="Company name" />
            <Field label="Location" name="location" value={addForm.location} onChange={fc(setAddForm)} placeholder="City, Country" />
            <Field label="Order" name="order" type="number" value={addForm.order} onChange={fc(setAddForm)} />
          </div>
          <Field label="Description" name="desc" value={addForm.desc} onChange={fc(setAddForm)} as="textarea" placeholder="Role description…" />
          <button className="adm-btn adm-btn--primary" type="submit">Save</button>
        </form>
      )}

      <div className="adm-list">
        {items.length === 0 && <p className="adm-empty">No entries yet.</p>}
        {items.map((item) =>
          editId === item._id ? (
            <form className="adm-form adm-form--inline" key={item._id} onSubmit={handleEdit}>
              <div className="adm-form__grid">
                <Field label="Date / Period" name="date" value={editForm.date} onChange={fc(setEditForm)} />
                <Field label="Job Title" name="title" value={editForm.title} onChange={fc(setEditForm)} />
                <Field label="Company" name="company" value={editForm.company} onChange={fc(setEditForm)} />
                <Field label="Location" name="location" value={editForm.location} onChange={fc(setEditForm)} />
                <Field label="Order" name="order" type="number" value={editForm.order} onChange={fc(setEditForm)} />
              </div>
              <Field label="Description" name="desc" value={editForm.desc} onChange={fc(setEditForm)} as="textarea" />
              <div className="adm-form__actions">
                <button className="adm-btn adm-btn--primary" type="submit">Update</button>
                <button className="adm-btn adm-btn--ghost" type="button" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="adm-card" key={item._id}>
              <div className="adm-card__body">
                <span className="adm-card__badge">{item.date}</span>
                <strong className="adm-card__title">{item.title}</strong>
                <span className="adm-card__sub">{item.company} · {item.location}</span>
                <p className="adm-card__desc">{item.desc}</p>
              </div>
              <div className="adm-card__actions">
                <button className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => startEdit(item)}>Edit</button>
                <button className="adm-btn adm-btn--sm adm-btn--danger-ghost" onClick={() => setDeleteTarget(item._id)}>Delete</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// ── PROJECTS section ──────────────────────────────────────────────────────────
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

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  // Convert tags array → comma string for form, and back when saving
  const toFormProj = (item) => ({ ...item, tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags });
  const fromFormProj = (form) => ({ ...form, order: Number(form.order), tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) });

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await authFetch("/api/v1/ps-portfolio/projects", {
      method: "POST",
      body: JSON.stringify(fromFormProj(addForm)),
    });
    const json = await res.json();
    if (json.success) { setAddForm(PROJ_BLANK); setShowAdd(false); load(); flash("Project added."); }
    else flash(json.message || "Failed to add");
  };

  const startEdit = (item) => { setEditId(item._id); setEditForm(toFormProj(item)); };

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await authFetch(`/api/v1/ps-portfolio/projects/${editId}`, {
      method: "PUT",
      body: JSON.stringify(fromFormProj(editForm)),
    });
    const json = await res.json();
    if (json.success) { setEditId(null); load(); flash("Project updated."); }
    else flash(json.message || "Failed to update");
  };

  const handleDelete = async () => {
    const res = await authFetch(`/api/v1/ps-portfolio/projects/${deleteTarget}`, { method: "DELETE" });
    const json = await res.json();
    setDeleteTarget(null);
    if (json.success) { load(); flash("Project deleted."); }
    else flash(json.message || "Failed to delete");
  };

  const fc = (setter) => (e) => setter((p) => ({ ...p, [e.target.name]: e.target.value }));

  const ProjectForm = ({ form, setForm, onSubmit, submitLabel, onCancel }) => (
    <form className="adm-form adm-form--inline" onSubmit={onSubmit}>
      {submitLabel === "Save" && <h3 className="adm-form__heading">New Project</h3>}
      <div className="adm-form__grid">
        <Field label="Title" name="title" value={form.title} onChange={fc(setForm)} placeholder="Project title" />
        <Field label="Type" name="type" value={form.type} onChange={fc(setForm)} placeholder="e.g. Full Stack" />
        <Field label="Type Badge Color" name="typeColor" type="color" value={form.typeColor} onChange={fc(setForm)} />
        <Field label="Image Key" name="imageKey" value={form.imageKey} onChange={fc(setForm)} placeholder="e.g. Portfolio (matches imageMap)" />
        <Field label="GitHub / Live Link" name="link" value={form.link} onChange={fc(setForm)} placeholder="https://github.com/…" />
        <Field label="Order" name="order" type="number" value={form.order} onChange={fc(setForm)} />
      </div>
      <Field label="Tags (comma-separated)" name="tags" value={form.tags} onChange={fc(setForm)} placeholder="React, Node.js, MongoDB" />
      <Field label="Description" name="desc" value={form.desc} onChange={fc(setForm)} as="textarea" placeholder="Short description…" />
      <div className="adm-form__actions">
        <button className="adm-btn adm-btn--primary" type="submit">{submitLabel}</button>
        {onCancel && <button className="adm-btn adm-btn--ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );

  return (
    <div className="adm-section">
      {msg && <div className="adm-flash">{msg}</div>}
      {deleteTarget && (
        <ConfirmModal
          message="Delete this project?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="adm-section__header">
        <h2 className="adm-section__title">Projects</h2>
        <button className="adm-btn adm-btn--primary" onClick={() => setShowAdd((p) => !p)}>
          {showAdd ? "Cancel" : "+ Add New"}
        </button>
      </div>

      {showAdd && (
        <ProjectForm form={addForm} setForm={setAddForm} onSubmit={handleAdd} submitLabel="Save" />
      )}

      <div className="adm-list">
        {items.length === 0 && <p className="adm-empty">No entries yet.</p>}
        {items.map((item) =>
          editId === item._id ? (
            <ProjectForm
              key={item._id}
              form={editForm}
              setForm={setEditForm}
              onSubmit={handleEdit}
              submitLabel="Update"
              onCancel={() => setEditId(null)}
            />
          ) : (
            <div className="adm-card" key={item._id}>
              <div className="adm-card__body">
                <span className="adm-card__badge" style={{ background: item.typeColor }}>{item.type}</span>
                <strong className="adm-card__title">{item.title}</strong>
                <span className="adm-card__sub">{item.tags?.join(", ")}</span>
                <p className="adm-card__desc">{item.desc}</p>
                <a className="adm-card__link" href={item.link} target="_blank" rel="noreferrer">{item.link}</a>
              </div>
              <div className="adm-card__actions">
                <button className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => startEdit(item)}>Edit</button>
                <button className="adm-btn adm-btn--sm adm-btn--danger-ghost" onClick={() => setDeleteTarget(item._id)}>Delete</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// ── SKILLS section ────────────────────────────────────────────────────────────
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

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

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

  const startEdit = (item) => { setEditId(item._id); setEditForm({ ...item }); };

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
    if (json.success) { load(); flash("Skill deleted."); }
    else flash(json.message || "Failed to delete");
  };

  const fc = (setter) => (e) => setter((p) => ({ ...p, [e.target.name]: e.target.value }));

  const SkillIcon = ({ iconName }) => {
    const Icon = iconRegistry[iconName];
    return Icon ? <Icon className="adm-skill-icon" /> : <span className="adm-skill-icon-placeholder">?</span>;
  };

  return (
    <div className="adm-section">
      {msg && <div className="adm-flash">{msg}</div>}
      {deleteTarget && (
        <ConfirmModal
          message="Delete this skill?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="adm-section__header">
        <h2 className="adm-section__title">Skills</h2>
        <button className="adm-btn adm-btn--primary" onClick={() => setShowAdd((p) => !p)}>
          {showAdd ? "Cancel" : "+ Add New"}
        </button>
      </div>

      {showAdd && (
        <form className="adm-form" onSubmit={handleAdd}>
          <h3 className="adm-form__heading">New Skill</h3>
          <div className="adm-form__grid">
            <Field label="Skill Name" name="name" value={addForm.name} onChange={fc(setAddForm)} placeholder="e.g. TypeScript" />
            <Field label="Icon Name" name="iconName" value={addForm.iconName} onChange={fc(setAddForm)} as="select" options={iconNames} />
            <Field label="Order" name="order" type="number" value={addForm.order} onChange={fc(setAddForm)} />
          </div>
          {addForm.iconName && (
            <div className="adm-icon-preview">
              Preview: <SkillIcon iconName={addForm.iconName} /> {addForm.iconName}
            </div>
          )}
          <button className="adm-btn adm-btn--primary" type="submit">Save</button>
        </form>
      )}

      <div className="adm-skills-grid">
        {items.length === 0 && <p className="adm-empty">No skills yet.</p>}
        {items.map((item) =>
          editId === item._id ? (
            <form className="adm-form adm-form--inline adm-form--skill" key={item._id} onSubmit={handleEdit}>
              <Field label="Skill Name" name="name" value={editForm.name} onChange={fc(setEditForm)} />
              <Field label="Icon Name" name="iconName" value={editForm.iconName} onChange={fc(setEditForm)} as="select" options={iconNames} />
              <Field label="Order" name="order" type="number" value={editForm.order} onChange={fc(setEditForm)} />
              {editForm.iconName && (
                <div className="adm-icon-preview">
                  <SkillIcon iconName={editForm.iconName} />
                </div>
              )}
              <div className="adm-form__actions">
                <button className="adm-btn adm-btn--primary" type="submit">Update</button>
                <button className="adm-btn adm-btn--ghost" type="button" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="adm-skill-card" key={item._id}>
              <SkillIcon iconName={item.iconName} />
              <span className="adm-skill-name">{item.name}</span>
              <div className="adm-skill-card__actions">
                <button className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => startEdit(item)}>Edit</button>
                <button className="adm-btn adm-btn--sm adm-btn--danger-ghost" onClick={() => setDeleteTarget(item._id)}>Del</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const TABS = ["Educations", "Works", "Projects", "Skills"];

const AdminDashboard = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Educations");
  const authFetch = useApi(token);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="adm-root">
      {/* Top bar */}
      <header className="adm-topbar">
        <div className="adm-topbar__left">
          <span className="adm-topbar__icon">⚙</span>
          <span className="adm-topbar__title">Admin Dashboard</span>
        </div>
        <div className="adm-topbar__right">
          <a className="adm-btn adm-btn--ghost adm-btn--sm" href="/" target="_blank" rel="noreferrer">
            View Portfolio ↗
          </a>
          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <nav className="adm-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`adm-tab ${activeTab === tab ? "adm-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="adm-content">
        {activeTab === "Educations" && <EducationsSection authFetch={authFetch} />}
        {activeTab === "Works" && <WorksSection authFetch={authFetch} />}
        {activeTab === "Projects" && <ProjectsSection authFetch={authFetch} />}
        {activeTab === "Skills" && <SkillsSection authFetch={authFetch} />}
      </main>
    </div>
  );
};

export default AdminDashboard;
