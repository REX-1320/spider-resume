// src/pages/InterviewPage.jsx — AI Interview Prep
import { useState } from "react";

const CATEGORIES = [
  { id: "all", label: "All Questions", icon: "🎯" },
  { id: "behavioral", label: "Behavioral", icon: "🧠" },
  { id: "technical", label: "Technical", icon: "💻" },
  { id: "situational", label: "Situational", icon: "🎭" },
  { id: "hr", label: "HR / Culture", icon: "👥" },
];

export default function InterviewPage({ callAI, form, glassCard, glassBase, glassBtn, glassInput, textPrimary, textSecondary, textMuted, theme, D }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [practiced, setPracticed] = useState(new Set());

  const generate = async () => {
    setLoading(true);
    setExpanded(null);
    setPracticed(new Set());
    try {
      const role = targetRole || form.experience?.[0]?.role || "the applied position";
      const raw = await callAI(`Generate exactly 20 interview questions for ${form.name || "a candidate"} applying for "${role}".

Their background: ${form.summary || ""} Skills: ${form.skills || ""}. Experience: ${form.experience?.map(e => `${e.role} at ${e.company}`).join(", ") || "N/A"}. Education: ${form.education?.[0]?.degree || "N/A"}.

Return ONLY valid JSON array of 20 objects (no markdown):
[{"id":1,"category":"behavioral|technical|situational|hr","question":"Full interview question?","why":"Why interviewers ask this (1 sentence)","tip":"How to answer it well (2-3 sentences)","sampleAnswer":"A brief sample answer framework (2-4 sentences) tailored to their background"}]

Mix: 5 behavioral, 5 technical, 5 situational, 5 HR. Make questions specific to their actual role and skills, not generic.`);

      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setQuestions(Array.isArray(parsed) ? parsed.slice(0, 20) : []);
    } catch (e) {
      alert("Generation failed — please try again.");
    }
    setLoading(false);
  };

  const accent = `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`;
  const catColors = { behavioral: "#8B5CF6", technical: "#0EA5E9", situational: "#F59E0B", hr: "#10B981" };

  const filtered = filter === "all" ? questions : questions.filter(q => q.category === filter);
  const practicedCount = practiced.size;

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", zIndex: 1, position: "relative" }}>
      {/* Header */}
      <div className="animate-fade-in-down" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "6px", letterSpacing: "-0.5px" }}>Interview Prep</h2>
          <p style={{ fontSize: "14px", color: textSecondary, margin: 0 }}>AI-generated questions tailored to your resume, with tips and samples.</p>
        </div>
        
        {questions.length > 0 && (
          <div className="animate-fade-in-scale" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 20px", borderRadius: "16px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
            <div style={{ position: "relative", width: "48px", height: "48px" }}>
              <svg viewBox="0 0 36 36" style={{ width: "48px", height: "48px", transform: "rotate(-90deg)" }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={theme.accent1} strokeWidth="3" strokeDasharray={`${(practicedCount / questions.length) * 100}, 100`} style={{ transition: "stroke-dasharray 0.5s ease" }} />
              </svg>
              <div style={{ position: "absolute", inset:0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary }}>
                {Math.round((practicedCount / questions.length) * 100)}%
              </div>
            </div>
            <div>
              <p style={{ fontSize: "16px", fontWeight: "800", color: textPrimary, margin: "0 0 2px", fontFamily: "var(--font-display)" }}>{practicedCount} / {questions.length}</p>
              <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, margin: 0 }}>Practiced</p>
            </div>
          </div>
        )}
      </div>

      <div className="card-hover-lift animate-fade-in-up delay-1 glass-panel" style={{ padding: "24px 28px", marginBottom: "32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "300px", height: "300px", background: `radial-gradient(circle, ${theme.accent1}15 0%, transparent 60%)`, pointerEvents: "none" }} />
        
        <label style={{ display: "block", fontSize: "12px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: textMuted, marginBottom: "12px" }}>Target Role (Optional)</label>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>
          <input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder={form.experience?.[0]?.role || "e.g. Senior Frontend Engineer at Google"} style={{ flex: 1, minWidth: "250px", background: D ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)", border: `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius:"14px", padding:"16px 20px", fontSize: "15px", color:textPrimary, outline: "none", transition: "all 0.2s" }} />
          <button onClick={generate} disabled={loading} className={loading ? "btn-glass" : "btn-premium animate-pulse-glow"} style={{ padding:"0 28px", height: "auto", minHeight: "54px", fontSize: "15px", fontWeight: "700", background: loading ? "transparent" : accent, color: loading ? textMuted : (D?"#0c0a08":"#fff"), borderRadius:"14px", border: loading ? undefined : "none", cursor:loading?"not-allowed":"pointer", flexShrink:0, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            {loading ? (
              <><span className="spinner" style={{ display: "inline-block", width: "16px", height: "16px", border: `2px solid ${textMuted}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Generating AI Questions...</>
            ) : questions.length > 0 ? "🔄 Regenerate" : "🎤 Generate Questions"}
          </button>
        </div>
      </div>

      {/* Empty state */}
      {!loading && questions.length === 0 && (
        <div className="card-hover-lift animate-fade-in-up delay-2 glass-panel" style={{ padding: "80px 24px", textAlign: "center", border: `1px dashed ${theme.accent1}40` }}>
          <div className="ambient-blob animate-float" style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", background: `linear-gradient(135deg, ${theme.accent1}20, ${theme.accent2}20)`, borderRadius: "50%" }}>🎤</div>
          <p style={{ fontSize: "24px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "12px", letterSpacing: "-0.5px" }}>Ready to practice?</p>
          <p style={{ fontSize: "15px", color: textSecondary, lineHeight: 1.6, marginBottom: "32px", maxWidth: "480px", margin: "0 auto 32px" }}>AI will generate 20 highly specific questions tailored to your resume—covering behavioral, technical, situational, and HR rounds.</p>
          <button onClick={generate} className="btn-premium animate-pulse-glow" style={{ padding: "16px 32px", fontSize: "15px", fontWeight: "800", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, color: D ? "#0c0a08" : "#fff", borderRadius: "100px", border: "none" }}>Generate AI Questions</button>
        </div>
      )}

      {/* Filter tabs */}
      {questions.length > 0 && (
        <div className="animate-fade-in-up delay-1" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setFilter(c.id)} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: "600", borderRadius: "100px", border: filter === c.id ? `1px solid ${theme.accent1}` : `1px solid transparent`, color: filter === c.id ? theme.accent1 : textSecondary, background: filter === c.id ? `linear-gradient(135deg, ${theme.accent1}15, ${theme.accent2}05)` : (D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"), cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>{c.icon}</span> {c.label} {c.id !== "all" && <span style={{ opacity: 0.6, fontSize: "11px", fontWeight: "700" }}>{questions.filter(q => q.category === c.id).length}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-panel" style={{ padding: "24px", opacity: 0.5, animation: `pulseGLow 2s ease ${i * 0.1}s infinite`, border: `1px solid ${theme.accent1}20` }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: "12px", width: "30%", borderRadius: "6px", background: D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", marginBottom: "12px" }} />
                  <div style={{ height: "10px", width: "85%", borderRadius: "6px", background: D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Questions list */}
      {!loading && filtered.length > 0 && (
        <div className="animate-fade-in-up delay-2" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filtered.map((q, idx) => {
            const color = catColors[q.category] || theme.accent1;
            const isOpen = expanded === q.id;
            const done = practiced.has(q.id);
            
            return (
              <div key={q.id} className="card-hover-lift glass-panel" style={{ overflow: "hidden", opacity: done ? 0.6 : 1, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", padding: 0, border: isOpen ? `1px solid ${color}40` : `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, boxShadow: isOpen ? `0 12px 40px ${color}15` : undefined }}>
                {/* Left Accent Bar */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: done ? (D ? "#7dcfa0" : "#2e7d52") : color }} />
                
                <div style={{ padding: "24px 24px 24px 28px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                    {/* Index / Category Icon Base */}
                    <div style={{ minWidth: "36px", height: "36px", borderRadius: "12px", background: done ? "rgba(76,175,125,0.15)" : color + "15", border: `1px solid ${done ? "rgba(76,175,125,0.3)" : color + "30"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800", color: done ? (D ? "#7dcfa0" : "#2e7d52") : color, flexShrink: 0 }}>
                      {done ? "✓" : (isOpen ? idx + 1 : idx + 1)}
                    </div>
                    
                    {/* Question Content */}
                    <div style={{ flex: 1, minWidth: 0, paddingTop: "2px", cursor: "pointer" }} onClick={() => setExpanded(isOpen ? null : q.id)}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color, padding: "4px 8px", borderRadius: "100px", background: color + "15", border: `1px solid ${color}30` }}>
                          {CATEGORIES.find(c => c.id === q.category)?.icon} {q.category}
                        </span>
                        {done && <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.05em", color: D ? "#7dcfa0" : "#2e7d52", padding: "4px 8px", borderRadius: "100px", background: "rgba(76,175,125,0.15)", border: "1px solid rgba(76,175,125,0.3)" }}>✓ Practiced</span>}
                      </div>
                      <p style={{ fontSize: isOpen ? "16px" : "15px", fontWeight: isOpen ? "700" : "600", color: textPrimary, margin: 0, lineHeight: 1.5, transition: "all 0.2s" }}>{q.question}</p>
                    </div>
                    
                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button onClick={(e) => { e.stopPropagation(); setPracticed(s => { const n = new Set(s); done ? n.delete(q.id) : n.add(q.id); return n; }); }} className="btn-glass" style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontSize: "14px", borderRadius: "12px", color: done ? (D ? "#7dcfa0" : "#2e7d52") : textMuted, border: done ? "1px solid rgba(76,175,125,0.4)" : `1px solid ${D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, background: done ? "rgba(76,175,125,0.1)" : undefined }}>
                        {done ? "✓" : "○"}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setExpanded(isOpen ? null : q.id); }} className="btn-glass" style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontSize: "12px", borderRadius: "12px", color: textSecondary }}>
                        {isOpen ? "▲" : "▼"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content (AI Tips & Answers) */}
                  {isOpen && (
                    <div className="animate-fade-in-down" style={{ marginTop: "24px", paddingLeft: "52px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                        <div style={{ padding: "16px 20px", borderRadius: "16px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                          <p style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: textMuted, margin: "0 0 8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            <span style={{ fontSize: "14px" }}>🤔</span> Why they ask this
                          </p>
                          <p style={{ fontSize: "14px", color: textSecondary, margin: 0, lineHeight: 1.6 }}>{q.why}</p>
                        </div>
                        
                        <div style={{ padding: "16px 20px", borderRadius: "16px", background: color + "08", border: `1px solid ${color}30` }}>
                          <p style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color, margin: "0 0 8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            <span style={{ fontSize: "14px" }}>💡</span> Pro Tip
                          </p>
                          <p style={{ fontSize: "14px", color: textSecondary, margin: 0, lineHeight: 1.6 }}>{q.tip}</p>
                        </div>
                        
                        <div style={{ padding: "20px", borderRadius: "16px", background: D ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)", border: `1px solid ${D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                          <p style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: theme.accent1, margin: "0 0 12px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            <span style={{ fontSize: "14px" }}>🤖</span> Sample AI Answer
                          </p>
                          <p style={{ fontSize: "15px", color: textPrimary, margin: 0, lineHeight: 1.7, fontStyle: "italic", borderLeft: `2px solid ${theme.accent1}60`, paddingLeft: "16px" }}>"{q.sampleAnswer}"</p>
                        </div>
                      </div>
                      
                      {!done && (
                        <button onClick={() => setPracticed(s => { const n = new Set(s); n.add(q.id); return n; })} className="btn-premium animate-pulse-glow" style={{ marginTop: "20px", padding: "12px 24px", fontSize: "13px", fontWeight: "700", background: "rgba(76,175,125,0.15)", color: D ? "#7dcfa0" : "#2e7d52", border: "1px solid rgba(76,175,125,0.3)", borderRadius: "100px", display: "flex", alignItems: "center", gap: "8px" }}>
                          ✓ Mark as Practiced
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress Completion State */}
      {questions.length > 0 && practicedCount === questions.length && (
        <div className="animate-fade-in-scale glass-panel" style={{ padding: "32px", marginTop: "32px", textAlign: "center", background: "linear-gradient(135deg, rgba(76,175,125,0.1), rgba(76,175,125,0.05))", border: "1px solid rgba(76,175,125,0.3)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
          <p style={{ fontSize: "20px", fontWeight: "800", fontFamily: "var(--font-display)", color: D ? "#7dcfa0" : "#2e7d52", margin: "0 0 8px" }}>All 20 questions practiced!</p>
          <p style={{ fontSize: "14px", color: textSecondary, margin: "0 0 24px" }}>You are well prepared. Want to tackle a different role?</p>
          <button onClick={() => { setTargetRole(""); setQuestions([]); setPracticed(new Set()); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn-glass" style={{ padding: "12px 24px", fontSize: "14px", fontWeight: "700", borderRadius: "100px", background: "rgba(76,175,125,0.15)", color: D ? "#7dcfa0" : "#2e7d52" }}>
            Start Fresh
          </button>
        </div>
      )}
    </div>
  );
}
