// src/pages/TrackerPage.jsx — Job Application Tracker
import { useState, useEffect } from "react";

const STATUSES = [
  { id: "applied", label: "Applied", color: "#6366F1", icon: "📤" },
  { id: "screening", label: "Screening", color: "#F59E0B", icon: "📞" },
  { id: "interview", label: "Interview", color: "#0EA5E9", icon: "🎤" },
  { id: "offer", label: "Offer", color: "#10B981", icon: "🎉" },
  { id: "rejected", label: "Rejected", color: "#EF4444", icon: "❌" },
  { id: "ghosted", label: "Ghosted", color: "#9CA3AF", icon: "👻" },
];

const empty = () => ({ id: Date.now(), company: "", role: "", platform: "", appliedDate: new Date().toISOString().split("T")[0], status: "applied", notes: "", salary: "", link: "" });

export default function TrackerPage({ glassCard, glassBase, glassBtn, glassInput, textPrimary, textSecondary, textMuted, theme, D }) {
  const [apps, setApps] = useState(() => {
    try { return JSON.parse(localStorage.getItem("spider_tracker") || "[]"); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty());
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => { localStorage.setItem("spider_tracker", JSON.stringify(apps)); }, [apps]);

  const save = () => {
    if (!form.company || !form.role) { alert("Company and Role are required."); return; }
    if (editing) {
      setApps(a => a.map(x => x.id === editing ? { ...form, id: editing } : x));
      setEditing(null);
    } else {
      setApps(a => [{ ...form, id: Date.now() }, ...a]);
    }
    setForm(empty());
    setShowForm(false);
  };

  const del = (id) => { if (confirm("Delete this application?")) setApps(a => a.filter(x => x.id !== id)); };
  const edit = (app) => { setForm(app); setEditing(app.id); setShowForm(true); };
  const updateStatus = (id, status) => setApps(a => a.map(x => x.id === id ? { ...x, status } : x));

  const filtered = apps
    .filter(a => filterStatus === "all" || a.status === filterStatus)
    .sort((a, b) => sortBy === "date" ? new Date(b.appliedDate) - new Date(a.appliedDate) : a.company.localeCompare(b.company));

  const counts = {};
  STATUSES.forEach(s => { counts[s.id] = apps.filter(a => a.status === s.id).length; });

  const accent = `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`;
  const inp = { ...glassInput, borderRadius: 12, padding: "9px 14px", fontSize: 13, color: textPrimary, width: "100%", boxSizing: "border-box", outline: "none", fontFamily: "inherit" };
  const Label = ({ t }) => <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, margin: "0 0 5px" }}>{t}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px 40px", zIndex: 1, position: "relative" }}>
      {/* Header */}
      <div style={{ ...glassCard, padding: "16px 20px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 17, fontWeight: 800, color: textPrimary, margin: "0 0 3px" }}>📊 Application Tracker</p>
          <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>Track every job you apply to — never lose a lead</p>
        </div>
        <button onClick={() => { setForm(empty()); setEditing(null); setShowForm(s => !s); }} style={{ ...glassBtn, padding: "9px 18px", fontSize: 13, fontWeight: 700, background: showForm ? "transparent" : accent, color: showForm ? textMuted : (D ? "#1a1410" : "#2d2520"), borderRadius: 14, border: "none", cursor: "pointer" }}>
          {showForm ? "✕ Cancel" : "+ Add Application"}
        </button>
      </div>

      {/* Stats strip */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14, paddingBottom: 2 }}>
        {[{ id: "all", label: "Total", icon: "📋", color: theme.accent1, count: apps.length }, ...STATUSES.map(s => ({ ...s, count: counts[s.id] }))].map(s => (
          <button key={s.id} onClick={() => setFilterStatus(s.id)} style={{ ...glassBtn, padding: "8px 12px", borderRadius: 12, border: filterStatus === s.id ? `1.5px solid ${s.color}` : undefined, background: filterStatus === s.id ? s.color + "18" : undefined, cursor: "pointer", flexShrink: 0, textAlign: "center", minWidth: 60 }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: s.color, margin: 0 }}>{s.count}</p>
            <p style={{ fontSize: 9, color: textMuted, margin: 0, fontWeight: 600 }}>{s.label}</p>
          </button>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div style={{ ...glassCard, padding: "18px 20px", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: textPrimary, margin: "0 0 14px" }}>{editing ? "✏️ Edit Application" : "➕ New Application"}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div><Label t="Company *" /><input placeholder="Google" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} style={inp} /></div>
            <div><Label t="Role *" /><input placeholder="Software Engineer" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inp} /></div>
            <div><Label t="Platform" /><input placeholder="LinkedIn, Naukri..." value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} style={inp} /></div>
            <div><Label t="Applied Date" /><input type="date" value={form.appliedDate} onChange={e => setForm(f => ({ ...f, appliedDate: e.target.value }))} style={inp} /></div>
            <div><Label t="Expected Salary" /><input placeholder="₹12 LPA" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} style={inp} /></div>
            <div><Label t="Job Link (optional)" /><input placeholder="https://..." value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} style={inp} /></div>
          </div>
          <Label t="Status" />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {STATUSES.map(s => (
              <button key={s.id} onClick={() => setForm(f => ({ ...f, status: s.id }))} style={{ ...glassBtn, padding: "6px 12px", fontSize: 12, borderRadius: 10, border: form.status === s.id ? `1.5px solid ${s.color}` : undefined, color: form.status === s.id ? s.color : textMuted, background: form.status === s.id ? s.color + "18" : undefined, cursor: "pointer" }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          <Label t="Notes" />
          <textarea placeholder="Interview scheduled for Monday, waiting for feedback..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} style={{ ...inp, resize: "none", lineHeight: 1.5, marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} style={{ ...glassBtn, flex: 1, padding: 12, fontSize: 14, fontWeight: 700, background: accent, color: D ? "#1a1410" : "#2d2520", borderRadius: 12, border: "none", cursor: "pointer" }}>
              {editing ? "✓ Save Changes" : "✓ Add Application"}
            </button>
          </div>
        </div>
      )}

      {/* Sort */}
      {apps.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: textMuted }}>Sort:</span>
          {["date", "company"].map(s => (
            <button key={s} onClick={() => setSortBy(s)} style={{ ...glassBtn, padding: "5px 12px", fontSize: 12, borderRadius: 10, color: sortBy === s ? theme.accent1 : textMuted, border: sortBy === s ? `1.5px solid ${theme.accent1}` : undefined, cursor: "pointer" }}>
              {s === "date" ? "📅 Date" : "🔤 Company"}
            </button>
          ))}
          <span style={{ fontSize: 11, color: textMuted, marginLeft: "auto" }}>{filtered.length} showing</span>
        </div>
      )}

      {/* Empty state */}
      {apps.length === 0 && (
        <div style={{ ...glassCard, padding: "50px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 44, marginBottom: 14 }}>📊</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 8 }}>No applications yet</p>
          <p style={{ fontSize: 13, color: textSecondary, marginBottom: 22, lineHeight: 1.6 }}>Start tracking every job you apply to.<br />Never forget a follow-up again.</p>
          <button onClick={() => setShowForm(true)} style={{ ...glassBtn, padding: "12px 28px", fontSize: 14, fontWeight: 700, background: accent, color: D ? "#1a1410" : "#2d2520", borderRadius: 14, border: "none" }}>+ Add First Application</button>
        </div>
      )}

      {/* Applications list */}
      {filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(app => {
            const st = STATUSES.find(s => s.id === app.status) || STATUSES[0];
            return (
              <div key={app.id} style={{ ...glassCard, padding: "14px 18px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: st.color, borderRadius: "20px 0 0 20px" }} />
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: textPrimary }}>{app.company}</span>
                        <span style={{ fontSize: 11, color: textSecondary }}>· {app.role}</span>
                        {app.salary && <span style={{ fontSize: 10, color: textMuted }}>· {app.salary}</span>}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 7, background: st.color + "22", color: st.color, border: `1px solid ${st.color}44` }}>{st.icon} {st.label}</span>
                        {app.platform && <span style={{ fontSize: 10, color: textMuted }}>📍 {app.platform}</span>}
                        <span style={{ fontSize: 10, color: textMuted }}>📅 {app.appliedDate}</span>
                      </div>
                      {app.notes && <p style={{ fontSize: 11, color: textSecondary, margin: "6px 0 0", fontStyle: "italic", lineHeight: 1.4 }}>"{app.notes}"</p>}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {app.link && <a href={app.link} target="_blank" rel="noopener noreferrer" style={{ ...glassBtn, padding: "5px 10px", fontSize: 11, color: theme.accent1, borderRadius: 9, textDecoration: "none" }}>🔗</a>}
                      <button onClick={() => edit(app)} style={{ ...glassBtn, padding: "5px 10px", fontSize: 11, color: textSecondary, borderRadius: 9, cursor: "pointer" }}>✏️</button>
                      <button onClick={() => del(app.id)} style={{ ...glassBtn, padding: "5px 10px", fontSize: 11, color: D ? "#f08080" : "#b03030", borderRadius: 9, cursor: "pointer" }}>🗑️</button>
                    </div>
                  </div>
                  {/* Quick status update */}
                  <div style={{ display: "flex", gap: 5, marginTop: 10, flexWrap: "wrap" }}>
                    {STATUSES.map(s => (
                      <button key={s.id} onClick={() => updateStatus(app.id, s.id)} style={{ padding: "3px 8px", borderRadius: 7, border: app.status === s.id ? `1.5px solid ${s.color}` : `1px solid ${D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)"}`, background: app.status === s.id ? s.color + "20" : "transparent", color: app.status === s.id ? s.color : textMuted, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>
                        {s.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && apps.length > 0 && (
        <div style={{ ...glassCard, padding: "30px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: textSecondary }}>No applications with status "{filterStatus}". <span onClick={() => setFilterStatus("all")} style={{ color: theme.accent1, cursor: "pointer", fontWeight: 700 }}>Show all →</span></p>
        </div>
      )}
    </div>
  );
}
