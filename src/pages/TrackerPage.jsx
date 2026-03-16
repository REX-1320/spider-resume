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
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", zIndex: 1, position: "relative" }}>
      {/* Header */}
      <div className="animate-fade-in-down" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "6px", letterSpacing: "-0.5px" }}>Application Tracker</h2>
          <p style={{ fontSize: "14px", color: textSecondary, margin: 0 }}>Track every job you apply to. Never lose a lead.</p>
        </div>
        <button onClick={() => { setForm(empty()); setEditing(null); setShowForm(s => !s); }} className={showForm ? "btn-glass" : "btn-premium animate-pulse-glow"} style={{ padding: "12px 24px", fontSize: "14px", fontWeight: "700", background: showForm ? "transparent" : accent, color: showForm ? textMuted : (D ? "#0c0a08" : "#fff"), borderRadius: "100px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: showForm ? "none" : `0 8px 16px ${theme.accent1}40` }}>
          {showForm ? "✕ Close" : "+ Add Application"}
        </button>
      </div>

      {/* Stats strip */}
      <div className="animate-fade-in-up delay-1 scroll-hide" style={{ display: "flex", gap: "12px", overflowX: "auto", marginBottom: "32px", paddingBottom: "12px", padding: "4px", margin: "-4px -4px 28px" }}>
        {[{ id: "all", label: "Total", icon: "📋", color: theme.accent1, count: apps.length }, ...STATUSES.map(s => ({ ...s, count: counts[s.id] }))].map(s => {
          const isActive = filterStatus === s.id;
          return (
            <button key={s.id} onClick={() => setFilterStatus(s.id)} className="card-hover-lift" style={{ ...glassBtn, padding: "16px 20px", borderRadius: "16px", border: isActive ? `1px solid ${s.color}` : `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, background: isActive ? `linear-gradient(135deg, ${s.color}15, ${s.color}05)` : (D ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.4)"), cursor: "pointer", flexShrink: 0, textAlign: "left", minWidth: "120px", display: "flex", flexDirection: "column", gap: "8px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: isActive ? `0 8px 24px ${s.color}20` : undefined }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span style={{ fontSize: "18px" }}>{s.icon}</span>
                <span style={{ fontSize: "20px", fontWeight: "800", fontFamily: "var(--font-display)", color: s.color }}>{s.count}</span>
              </div>
              <p style={{ fontSize: "12px", fontWeight: isActive ? "800" : "600", letterSpacing: "0.05em", color: isActive ? s.color : textMuted, margin: 0, textTransform: "uppercase" }}>{s.label}</p>
            </button>
          );
        })}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="animate-fade-in-down" style={{ ...glassCard, padding: "32px", marginBottom: "32px", border: `1px solid ${theme.accent1}40`, boxShadow: `0 24px 48px ${theme.accent1}15`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "300px", background: `radial-gradient(circle, ${theme.accent1}10, transparent 70%)`, pointerEvents: "none" }} />
          
          <h3 style={{ fontSize: "20px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, margin: "0 0 24px", display: "flex", alignItems: "center", gap: "8px" }}>
            {editing ? "✏️ Edit Application" : "✨ New Application"}
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "24px" }}>
            <div><Label t="Company *" /><input placeholder="e.g. Google" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="input-glass" style={inp} /></div>
            <div><Label t="Role *" /><input placeholder="e.g. Senior Frontend Engineer" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="input-glass" style={inp} /></div>
            <div><Label t="Platform" /><input placeholder="e.g. LinkedIn, Career Site" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} className="input-glass" style={inp} /></div>
            <div><Label t="Applied Date" /><input type="date" value={form.appliedDate} onChange={e => setForm(f => ({ ...f, appliedDate: e.target.value }))} className="input-glass" style={inp} /></div>
            <div><Label t="Expected Salary" /><input placeholder="e.g. ₹24 LPA" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} className="input-glass" style={inp} /></div>
            <div><Label t="Job Link (optional)" /><input placeholder="https://..." value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} className="input-glass" style={inp} /></div>
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <Label t="Status" />
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {STATUSES.map(s => (
                <button key={s.id} onClick={() => setForm(f => ({ ...f, status: s.id }))} style={{ padding: "10px 16px", fontSize: "13px", fontWeight: "600", borderRadius: "12px", border: form.status === s.id ? `1px solid ${s.color}` : `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, color: form.status === s.id ? s.color : textMuted, background: form.status === s.id ? `linear-gradient(135deg, ${s.color}15, ${s.color}05)` : (D ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.4)"), cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: "32px" }}>
            <Label t="Notes" />
            <textarea placeholder="Interview scheduled for Monday, waiting for feedback..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} className="input-glass" style={{ ...inp, resize: "vertical", minHeight: "80px", marginTop: "8px" }} />
          </div>
          
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button onClick={() => { setForm(empty()); setEditing(null); setShowForm(false); }} className="btn-glass" style={{ padding: "14px 24px", fontSize: "14px", fontWeight: "600", color: textSecondary, borderRadius: "100px" }}>
              Cancel
            </button>
            <button onClick={save} className="btn-premium animate-pulse-glow" style={{ padding: "14px 32px", fontSize: "14px", fontWeight: "800", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, color: D ? "#0c0a08" : "#fff", borderRadius: "100px", border: "none", boxShadow: `0 8px 16px ${theme.accent1}40` }}>
              {editing ? "Save Changes" : "Save Application"}
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      {apps.length > 1 && (
        <div className="animate-fade-in-up delay-2" style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "center", flexWrap: "wrap", padding: "16px 20px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderRadius: "16px", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted }}>Sort By</span>
          <div style={{ display: "flex", gap: "8px", background: D ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.5)", padding: "4px", borderRadius: "12px" }}>
            {["date", "company"].map(s => (
              <button key={s} onClick={() => setSortBy(s)} className="nav-pill" style={{ padding: "8px 16px", fontSize: "13px", fontWeight: sortBy === s ? "700" : "600", borderRadius: "10px", color: sortBy === s ? theme.accent1 : textSecondary, background: sortBy === s ? (D ? "rgba(255,255,255,0.05)" : "#fff") : "transparent", boxShadow: sortBy === s ? "0 2px 8px rgba(0,0,0,0.05)" : "none", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                {s === "date" ? "📅 Applied Date" : "🔤 Company Name"}
              </button>
            ))}
          </div>
          <span style={{ fontSize: "13px", fontWeight: "600", color: textMuted, marginLeft: "auto" }}>Showing {filtered.length} {filtered.length === 1 ? "application" : "applications"}</span>
        </div>
      )}

      {/* Empty state */}
      {apps.length === 0 && !showForm && (
        <div className="card-hover-lift animate-fade-in-up delay-2" style={{ ...glassCard, padding: "80px 24px", textAlign: "center", border: `1px dashed ${theme.accent1}40` }}>
          <div className="ambient-blob animate-float" style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", background: `linear-gradient(135deg, ${theme.accent1}20, ${theme.accent2}20)`, borderRadius: "50%" }}>📊</div>
          <p style={{ fontSize: "24px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "12px", letterSpacing: "-0.5px" }}>No applications yet</p>
          <p style={{ fontSize: "15px", color: textSecondary, marginBottom: "32px", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 32px" }}>Start tracking every job you apply to.<br />Never forget a follow-up again.</p>
          <button onClick={() => setShowForm(true)} className="btn-premium animate-pulse-glow" style={{ padding: "16px 32px", fontSize: "15px", fontWeight: "800", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, color: D ? "#0c0a08" : "#fff", borderRadius: "100px", border: "none" }}>+ Add First Application</button>
        </div>
      )}

      {/* Applications list */}
      {filtered.length > 0 && (
        <div className="animate-fade-in-up delay-3" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filtered.map(app => {
            const st = STATUSES.find(s => s.id === app.status) || STATUSES[0];
            return (
              <div key={app.id} className="card-hover-lift" style={{ ...glassCard, padding: 0, position: "relative", overflow: "hidden", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                {/* Status Color Bar */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: st.color }} />
                
                <div style={{ padding: "24px 24px 24px 28px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
                    
                    {/* Main Info */}
                    <div style={{ flex: 1, minWidth: "250px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "20px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, letterSpacing: "-0.3px" }}>{app.company}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "100px", background: st.color + "15", color: st.color, border: `1px solid ${st.color}30`, textTransform: "uppercase" }}>
                            {st.icon} {st.label}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                        <span style={{ fontSize: "15px", fontWeight: "600", color: textPrimary }}>{app.role}</span>
                        {(app.salary || app.platform || app.appliedDate) && <span style={{ color: textMuted }}>•</span>}
                        {app.salary && <span style={{ fontSize: "13px", fontWeight: "500", color: textSecondary, display: "flex", alignItems: "center", gap: "4px" }}>💰 {app.salary}</span>}
                        {app.platform && <span style={{ color: textMuted }}>•</span>}
                        {app.platform && <span style={{ fontSize: "13px", fontWeight: "500", color: textSecondary, display: "flex", alignItems: "center", gap: "4px" }}>📍 {app.platform}</span>}
                        <span style={{ color: textMuted }}>•</span>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: textSecondary, display: "flex", alignItems: "center", gap: "4px" }}>📅 {new Date(app.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      
                      {app.notes && (
                        <div style={{ padding: "12px 16px", borderRadius: "12px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                          <p style={{ fontSize: "13px", color: textSecondary, margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>"{app.notes}"</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions & Quick Status Update */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-end" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {app.link && (
                          <a href={app.link} target="_blank" rel="noopener noreferrer" className="btn-glass" title="Open Job Link" style={{ padding: "8px 16px", fontSize: "13px", fontWeight: "700", color: theme.accent1, borderRadius: "12px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                            🔗 Link
                          </a>
                        )}
                        <button onClick={() => edit(app)} className="btn-glass" title="Edit Application" style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontSize: "14px", color: textSecondary, borderRadius: "12px" }}>✏️</button>
                        <button onClick={() => del(app.id)} className="btn-glass" title="Delete Application" style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontSize: "14px", color: D ? "#f08080" : "#b03030", borderRadius: "12px" }}>🗑️</button>
                      </div>
                      
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end", background: D ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.4)", padding: "4px", borderRadius: "12px" }}>
                        {STATUSES.map(s => (
                          <button key={s.id} title={`Mark as ${s.label}`} onClick={() => updateStatus(app.id, s.id)} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", border: app.status === s.id ? `1px solid ${s.color}` : "border: none", background: app.status === s.id ? s.color + "20" : "transparent", color: app.status === s.id ? s.color : textMuted, fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}>
                            {s.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty Filter State */}
      {filtered.length === 0 && apps.length > 0 && (
        <div className="animate-fade-in-up" style={{ ...glassCard, padding: "40px 24px", textAlign: "center", border: `1px dashed ${D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}>
          <p style={{ fontSize: "15px", color: textSecondary, margin: "0 0 16px" }}>No applications found with status <strong style={{ color: textPrimary }}>"{STATUSES.find(s => s.id === filterStatus)?.label}"</strong>.</p>
          <button onClick={() => setFilterStatus("all")} className="btn-glass" style={{ padding: "10px 20px", fontSize: "13px", fontWeight: "700", color: theme.accent1, borderRadius: "100px" }}>
            Show all applications
          </button>
        </div>
      )}
    </div>
  );
}
