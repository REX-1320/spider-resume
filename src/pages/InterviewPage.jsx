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
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px 40px", zIndex: 1, position: "relative" }}>
      {/* Header */}
      <div style={{ ...glassCard, padding: "18px 22px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 17, fontWeight: 800, color: textPrimary, margin: "0 0 4px" }}>🎤 Interview Prep</p>
            <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>AI generates questions from your resume — with tips and sample answers</p>
          </div>
          {questions.length > 0 && (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: theme.accent1, margin: 0 }}>{practicedCount}/{questions.length}</p>
              <p style={{ fontSize: 10, color: textMuted, margin: 0 }}>practiced</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: 14, marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: 6 }}>Target Role (optional)</p>
          <input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder={form.experience?.[0]?.role || "e.g. Senior Frontend Engineer at Google"} style={{ ...glassInput, borderRadius: 14, padding: "10px 16px", fontSize: 13, color: textPrimary, width: "100%", boxSizing: "border-box" }} />
        </div>

        <button onClick={generate} disabled={loading} style={{ ...glassBtn, width: "100%", padding: 13, fontSize: 14, fontWeight: 700, background: loading ? "transparent" : accent, color: loading ? textMuted : (D ? "#1a1410" : "#2d2520"), borderRadius: 14, cursor: loading ? "not-allowed" : "pointer", border: "none" }}>
          {loading ? "🤖 Generating your questions..." : questions.length > 0 ? "🔄 Regenerate Questions" : "🎤 Generate 20 Interview Questions"}
        </button>
      </div>

      {/* Empty state */}
      {!loading && questions.length === 0 && (
        <div style={{ ...glassCard, padding: "48px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 44, marginBottom: 14 }}>🎤</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 8 }}>Ready to practice?</p>
          <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.6, marginBottom: 22 }}>AI will generate 20 questions tailored to your resume — behavioral, technical, situational, and HR rounds.</p>
          <button onClick={generate} style={{ ...glassBtn, padding: "12px 28px", fontSize: 14, fontWeight: 700, background: accent, color: D ? "#1a1410" : "#2d2520", borderRadius: 14, border: "none" }}>Generate Questions</button>
        </div>
      )}

      {/* Filter tabs */}
      {questions.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setFilter(c.id)} style={{ ...glassBtn, padding: "7px 14px", fontSize: 12, borderRadius: 12, border: filter === c.id ? `1.5px solid ${theme.accent1}` : undefined, color: filter === c.id ? theme.accent1 : textSecondary, background: filter === c.id ? `${theme.accent1}18` : undefined, cursor: "pointer" }}>
              {c.icon} {c.label} {c.id !== "all" && <span style={{ fontSize: 10, opacity: 0.7 }}>({questions.filter(q => q.category === c.id).length})</span>}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ ...glassCard, padding: 18, opacity: 0.5, animation: `intpulse 1.3s ease ${i * 0.1}s infinite` }}>
              <div style={{ height: 10, width: "40%", borderRadius: 6, background: D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", marginBottom: 8 }} />
              <div style={{ height: 8, width: "85%", borderRadius: 6, background: D ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)" }} />
            </div>
          ))}
        </div>
      )}

      {/* Questions */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((q, idx) => {
            const color = catColors[q.category] || theme.accent1;
            const isOpen = expanded === q.id;
            const done = practiced.has(q.id);
            return (
              <div key={q.id} style={{ ...glassCard, overflow: "hidden", opacity: done ? 0.7 : 1, transition: "opacity 0.2s" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: color, borderRadius: "20px 0 0 20px" }} />
                <div style={{ padding: "14px 16px 14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ minWidth: 26, height: 26, borderRadius: "50%", background: color + "22", border: `1.5px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color, flexShrink: 0 }}>{idx + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color, padding: "2px 7px", borderRadius: 7, background: color + "18" }}>{q.category}</span>
                        {done && <span style={{ fontSize: 9, fontWeight: 700, color: D ? "#7dcfa0" : "#2e7d52", padding: "2px 7px", borderRadius: 7, background: "rgba(76,175,125,0.15)" }}>✓ Practiced</span>}
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, lineHeight: 1.5 }}>{q.question}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => setPracticed(s => { const n = new Set(s); done ? n.delete(q.id) : n.add(q.id); return n; })} style={{ ...glassBtn, padding: "5px 10px", fontSize: 11, borderRadius: 9, color: done ? (D ? "#7dcfa0" : "#2e7d52") : textMuted, border: done ? "1px solid rgba(76,175,125,0.4)" : undefined, cursor: "pointer" }}>
                        {done ? "✓" : "○"}
                      </button>
                      <button onClick={() => setExpanded(isOpen ? null : q.id)} style={{ ...glassBtn, padding: "5px 10px", fontSize: 11, borderRadius: 9, color: textSecondary, cursor: "pointer" }}>
                        {isOpen ? "▲" : "▼"}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: 12, paddingLeft: 36 }}>
                      <div style={{ padding: "10px 14px", borderRadius: 12, background: D ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.4)", border: `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)"}`, marginBottom: 8 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: textMuted, margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Why they ask this</p>
                        <p style={{ fontSize: 12, color: textSecondary, margin: 0, lineHeight: 1.6 }}>{q.why}</p>
                      </div>
                      <div style={{ padding: "10px 14px", borderRadius: 12, background: color + "10", border: `1px solid ${color}30`, marginBottom: 8 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color, margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>How to answer</p>
                        <p style={{ fontSize: 12, color: textSecondary, margin: 0, lineHeight: 1.6 }}>{q.tip}</p>
                      </div>
                      <div style={{ padding: "10px 14px", borderRadius: 12, background: D ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.5)", border: `1px solid ${D ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.7)"}` }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: textMuted, margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Sample answer framework</p>
                        <p style={{ fontSize: 12, color: textPrimary, margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>"{q.sampleAnswer}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress bar */}
      {questions.length > 0 && (
        <div style={{ ...glassCard, padding: "16px 20px", marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: textSecondary }}>Practice Progress</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: textPrimary }}>{practicedCount} / {questions.length} done</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: D ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)" }}>
            <div style={{ height: "100%", borderRadius: 99, width: `${(practicedCount / questions.length) * 100}%`, background: accent, transition: "width 0.3s ease" }} />
          </div>
          {practicedCount === questions.length && questions.length > 0 && (
            <p style={{ textAlign: "center", fontSize: 13, color: D ? "#7dcfa0" : "#2e7d52", fontWeight: 700, marginTop: 10 }}>🎉 All questions practiced! You're ready for your interview.</p>
          )}
        </div>
      )}
      <style>{`@keyframes intpulse{0%,100%{opacity:.4}50%{opacity:.7}}`}</style>
    </div>
  );
}
