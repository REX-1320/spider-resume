// src/pages/LinkedInPage.jsx — LinkedIn Profile Optimizer
import { useState } from "react";

const SECTIONS = [
  { id: "headline", label: "Headline", icon: "🏷️", desc: "The line below your name — most viewed part of your profile" },
  { id: "about", label: "About", icon: "📖", desc: "Your summary section — 2,000 characters to tell your story" },
  { id: "experience", label: "Experience", icon: "💼", desc: "Job descriptions that get you found by recruiters" },
  { id: "skills", label: "Skills & Keywords", icon: "⚡", desc: "Top skills to add for maximum recruiter search visibility" },
  { id: "tips", label: "Profile Tips", icon: "💡", desc: "Actionable checklist to complete your LinkedIn profile" },
];

export default function LinkedInPage({ callAI, form, glassCard, glassBase, glassBtn, glassInput, textPrimary, textSecondary, textMuted, theme, D }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("headline");
  const [targetRole, setTargetRole] = useState("");
  const [copied, setCopied] = useState({});

  const optimize = async () => {
    setLoading(true);
    setResults(null);
    try {
      const role = targetRole || form.experience?.[0]?.role || "professional";
      const raw = await callAI(`You are a LinkedIn profile optimization expert. Rewrite and optimize this person's LinkedIn profile for maximum recruiter visibility and engagement.

Person: ${form.name || "Professional"}
Target Role: ${role}
Current Summary: ${form.summary || "N/A"}
Experience: ${form.experience?.map(e => `${e.role} at ${e.company}: ${e.desc}`).join(" | ") || "N/A"}
Education: ${form.education?.map(e => `${e.degree} from ${e.school}`).join(", ") || "N/A"}
Skills: ${form.skills || "N/A"}

Return ONLY valid JSON (no markdown):
{
  "headline": "Optimized LinkedIn headline (120 chars max, keyword-rich, role + value prop)",
  "headlineAlternatives": ["alt headline 1", "alt headline 2", "alt headline 3"],
  "about": "Full optimized About section (1st person, 250-300 words, story-driven, ends with CTA, includes keywords naturally)",
  "experienceDescriptions": [{"role": "job title", "company": "company", "optimized": "Rewritten bullet-point style description (3-4 bullet points starting with action verbs, quantified where possible)"}],
  "topSkills": ["skill1","skill2","skill3","skill4","skill5","skill6","skill7","skill8","skill9","skill10"],
  "keywordsToAdd": ["keyword1","keyword2","keyword3","keyword4","keyword5"],
  "profileTips": [{"tip":"Specific actionable tip","priority":"high|medium|low","impact":"Why this matters"}],
  "profileScore": 72,
  "scoreBreakdown": {"headline": 80, "about": 65, "experience": 75, "skills": 70, "photo": 50}
}`);

      const cleaned = raw.replace(/```json|```/g, "").trim();
      setResults(JSON.parse(cleaned));
    } catch (e) {
      alert("Optimization failed — please try again.");
    }
    setLoading(false);
  };

  const copy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopied(c => ({ ...c, [key]: true }));
    setTimeout(() => setCopied(c => ({ ...c, [key]: false })), 2000);
  };

  const accent = `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`;
  const inp = { ...glassInput, borderRadius: 14, padding: "10px 16px", fontSize: 13, color: textPrimary, width: "100%", boxSizing: "border-box", outline: "none", fontFamily: "inherit" };
  const CopyBtn = ({ k, text }) => (
    <button onClick={() => copy(k, text)} style={{ ...glassBtn, padding: "5px 12px", fontSize: 11, borderRadius: 9, color: copied[k] ? (D ? "#7dcfa0" : "#2e7d52") : textMuted, border: copied[k] ? "1px solid rgba(76,175,125,0.4)" : undefined, cursor: "pointer" }}>
      {copied[k] ? "✓ Copied" : "📋 Copy"}
    </button>
  );
  const priorityColor = { high: "#EF4444", medium: "#F59E0B", low: "#10B981" };

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "20px 16px 40px", zIndex: 1, position: "relative" }}>
      {/* Header */}
      <div style={{ ...glassCard, padding: "18px 22px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#0A66C222", border: "1.5px solid #0A66C244", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💼</div>
          <div>
            <p style={{ fontSize: 17, fontWeight: 800, color: textPrimary, margin: "0 0 3px" }}>LinkedIn Profile Optimizer</p>
            <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>AI rewrites your LinkedIn to get found by recruiters</p>
          </div>
        </div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, margin: "0 0 6px" }}>Target Role</p>
        <input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder={form.experience?.[0]?.role || "e.g. Senior Product Manager at Series B Startup"} style={{ ...inp, marginBottom: 12 }} />
        <button onClick={optimize} disabled={loading} style={{ ...glassBtn, width: "100%", padding: 13, fontSize: 14, fontWeight: 700, background: loading ? "transparent" : accent, color: loading ? textMuted : (D ? "#1a1410" : "#2d2520"), borderRadius: 14, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "🤖 Optimizing your LinkedIn..." : results ? "🔄 Re-optimize" : "🚀 Optimize My LinkedIn"}
        </button>
      </div>

      {/* Empty state */}
      {!loading && !results && (
        <div style={{ ...glassCard, padding: "48px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 44, marginBottom: 14 }}>💼</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 8 }}>Unlock recruiter visibility</p>
          <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.7, marginBottom: 22 }}>AI will rewrite your headline, About section, experience descriptions, and give you a skills checklist — all optimized for recruiter searches.</p>
          <button onClick={optimize} style={{ ...glassBtn, padding: "12px 28px", fontSize: 14, fontWeight: 700, background: accent, color: D ? "#1a1410" : "#2d2520", borderRadius: 14, border: "none" }}>Optimize Now</button>
        </div>
      )}

      {loading && (
        <div style={{ ...glassCard, padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16, animation: "spin 2s linear infinite", display: "inline-block" }}>⚙️</div>
          <p style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 6 }}>Optimizing your profile...</p>
          <p style={{ fontSize: 12, color: textMuted }}>Analyzing your experience and crafting recruiter-friendly content</p>
        </div>
      )}

      {results && (
        <>
          {/* Score card */}
          <div style={{ ...glassCard, padding: "18px 22px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 36, fontWeight: 900, color: results.profileScore >= 80 ? "#10B981" : results.profileScore >= 60 ? theme.accent1 : "#EF4444", margin: 0, lineHeight: 1 }}>{results.profileScore}</p>
                <p style={{ fontSize: 10, color: textMuted, margin: 0 }}>Profile Score</p>
              </div>
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {Object.entries(results.scoreBreakdown || {}).map(([k, v]) => (
                  <div key={k}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: textSecondary, textTransform: "capitalize" }}>{k}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: v >= 80 ? "#10B981" : v >= 60 ? theme.accent1 : "#EF4444" }}>{v}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 99, background: D ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)" }}>
                      <div style={{ height: "100%", borderRadius: 99, width: `${v}%`, background: v >= 80 ? "#10B981" : v >= 60 ? theme.accent1 : "#EF4444" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section tabs */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 2 }}>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ ...glassBtn, padding: "8px 14px", fontSize: 12, borderRadius: 12, border: activeSection === s.id ? `1.5px solid ${theme.accent1}` : undefined, color: activeSection === s.id ? theme.accent1 : textSecondary, background: activeSection === s.id ? `${theme.accent1}18` : undefined, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          {/* Headline section */}
          {activeSection === "headline" && (
            <div style={{ ...glassCard, padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: textPrimary, margin: 0 }}>🏷️ Optimized Headline</p>
                <CopyBtn k="headline" text={results.headline} />
              </div>
              <div style={{ padding: "14px 16px", borderRadius: 14, background: D ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.5)", border: `1px solid ${theme.accent1}44`, marginBottom: 16 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: textPrimary, margin: 0, lineHeight: 1.4 }}>{results.headline}</p>
                <p style={{ fontSize: 10, color: textMuted, margin: "6px 0 0" }}>{results.headline?.length || 0}/120 characters</p>
              </div>
              {results.headlineAlternatives?.length > 0 && (
                <>
                  <p style={{ fontSize: 11, fontWeight: 700, color: textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Alternatives</p>
                  {results.headlineAlternatives.map((alt, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: D ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.4)", border: `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)"}`, marginBottom: 8 }}>
                      <p style={{ fontSize: 13, color: textPrimary, flex: 1, margin: 0 }}>{alt}</p>
                      <CopyBtn k={`alt${i}`} text={alt} />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* About section */}
          {activeSection === "about" && (
            <div style={{ ...glassCard, padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: textPrimary, margin: 0 }}>📖 About Section</p>
                <CopyBtn k="about" text={results.about} />
              </div>
              <textarea value={results.about} readOnly rows={14} style={{ ...inp, fontFamily: "inherit", lineHeight: 1.75, resize: "none" }} />
              <p style={{ fontSize: 10, color: textMuted, marginTop: 8 }}>{results.about?.length || 0}/2000 characters</p>
            </div>
          )}

          {/* Experience */}
          {activeSection === "experience" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(results.experienceDescriptions || []).map((exp, i) => (
                <div key={i} style={{ ...glassCard, padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: textPrimary, margin: 0 }}>{exp.role}</p>
                      <p style={{ fontSize: 11, color: textMuted, margin: "2px 0 0" }}>{exp.company}</p>
                    </div>
                    <CopyBtn k={`exp${i}`} text={exp.optimized} />
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: 12, background: D ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.45)", border: `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)"}` }}>
                    <p style={{ fontSize: 13, color: textSecondary, margin: 0, lineHeight: 1.75, whiteSpace: "pre-line" }}>{exp.optimized}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {activeSection === "skills" && (
            <div style={{ ...glassCard, padding: "18px 22px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: textPrimary, margin: "0 0 14px" }}>⚡ Top Skills to Add</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {(results.topSkills || []).map((s, i) => (
                  <span key={i} onClick={() => copy(`skill${i}`, s)} style={{ padding: "6px 14px", borderRadius: 10, background: `${theme.accent1}18`, border: `1px solid ${theme.accent1}44`, color: theme.accent1, fontSize: 12, fontWeight: 600, cursor: "pointer" }} title="Click to copy">{s}</span>
                ))}
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: 10 }}>Keywords to Include in Your Profile</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(results.keywordsToAdd || []).map((k, i) => (
                  <span key={i} style={{ padding: "5px 12px", borderRadius: 10, background: D ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.45)", border: `1px solid ${D ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.65)"}`, color: textSecondary, fontSize: 11 }}>#{k}</span>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {activeSection === "tips" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(results.profileTips || []).map((tip, i) => (
                <div key={i} style={{ ...glassCard, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: priorityColor[tip.priority] || theme.accent1, marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0 }}>{tip.tip}</p>
                      <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 7, background: (priorityColor[tip.priority] || theme.accent1) + "20", color: priorityColor[tip.priority] || theme.accent1, fontWeight: 700, textTransform: "uppercase", flexShrink: 0 }}>{tip.priority}</span>
                    </div>
                    <p style={{ fontSize: 11, color: textMuted, margin: 0, lineHeight: 1.5 }}>{tip.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
