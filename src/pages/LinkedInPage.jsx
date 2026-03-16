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
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", zIndex: 1, position: "relative" }}>
      {/* Header */}
      <div className="animate-fade-in-down" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#0A66C215", border: "1px solid #0A66C230", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", boxShadow: "0 8px 16px rgba(10, 102, 194, 0.1)" }}>
            💼
          </div>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "4px", letterSpacing: "-0.5px" }}>LinkedIn Optimizer</h2>
            <p style={{ fontSize: "14px", color: textSecondary, margin: 0 }}>AI rewrites your profile for maximum recruiter visibility.</p>
          </div>
        </div>
        
        {results && (
          <div className="animate-fade-in-scale" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 16px", borderRadius: "100px", background: "rgba(76,175,125,0.1)", border: "1px solid rgba(76,175,125,0.2)" }}>
            <span style={{ fontSize: "16px" }}>✨</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: D ? "#7dcfa0" : "#2e7d52", letterSpacing: "0.05em", textTransform: "uppercase" }}>Fully Optimized</span>
          </div>
        )}
      </div>

      <div className="card-hover-lift animate-fade-in-up delay-1" style={{ ...glassCard, padding: "24px 28px", marginBottom: "32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "300px", height: "300px", background: `radial-gradient(circle, #0A66C210 0%, transparent 60%)`, pointerEvents: "none" }} />
        
        <label style={{ display: "block", fontSize: "12px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: textMuted, marginBottom: "12px" }}>Target Role for Optimization</label>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>
          <input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder={form.experience?.[0]?.role || "e.g. Senior Product Manager at Series B Startup"} style={{ flex: 1, minWidth: "250px", background: D ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)", border: `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius:"14px", padding:"16px 20px", fontSize: "15px", color:textPrimary, outline: "none", transition: "all 0.2s" }} />
          <button onClick={optimize} disabled={loading} className={loading ? "btn-glass" : "btn-premium animate-pulse-glow"} style={{ padding:"0 28px", height: "auto", minHeight: "54px", fontSize: "15px", fontWeight: "800", background: loading ? "transparent" : `linear-gradient(135deg, #0A66C2, #004182)`, color: loading ? textMuted : "#fff", borderRadius:"14px", border: loading ? undefined : "none", cursor:loading?"not-allowed":"pointer", flexShrink:0, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: loading ? "none" : "0 8px 16px rgba(10, 102, 194, 0.3)" }}>
            {loading ? (
              <><span className="spinner" style={{ display: "inline-block", width: "16px", height: "16px", border: `2px solid ${textMuted}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Optimizing...</>
            ) : results ? "🔄 Re-optimize" : "🚀 Optimize Profile"}
          </button>
        </div>
      </div>

      {/* Empty state */}
      {!loading && !results && (
        <div className="card-hover-lift animate-fade-in-up delay-2" style={{ ...glassCard, padding: "80px 24px", textAlign: "center", border: `1px dashed #0A66C240` }}>
          <div className="ambient-blob animate-float" style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", background: `linear-gradient(135deg, #0A66C220, #00418220)`, borderRadius: "50%" }}>💼</div>
          <p style={{ fontSize: "24px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "12px", letterSpacing: "-0.5px" }}>Unlock recruiter visibility</p>
          <p style={{ fontSize: "15px", color: textSecondary, lineHeight: 1.6, marginBottom: "32px", maxWidth: "480px", margin: "0 auto 32px" }}>AI will automatically rewrite your headline, About section, experience descriptions, and give you a skills checklist—all optimized for recruiter searches and the LinkedIn algorithm.</p>
          <button onClick={optimize} className="btn-premium animate-pulse-glow" style={{ padding: "16px 32px", fontSize: "15px", fontWeight: "800", background: `linear-gradient(135deg, #0A66C2, #004182)`, color: "#fff", borderRadius: "100px", border: "none", boxShadow: "0 8px 16px rgba(10, 102, 194, 0.3)" }}>Optimize Now</button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ ...glassCard, padding: "32px", opacity: 0.5, animation: `pulseGlowing 2s ease infinite`, border: `1px solid #0A66C230` }}>
            <div style={{ textAlign: "center" }}>
               <div className="spinner" style={{ display: "inline-block", width: "40px", height: "40px", border: `3px solid #0A66C240`, borderTopColor: "#0A66C2", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "16px" }} />
               <p style={{ fontSize: "16px", fontWeight: "800", color: textPrimary, margin: "0 0 8px" }}>Analyzing your profile data...</p>
               <p style={{ fontSize: "14px", color: textMuted }}>Crafting recruiter-friendly headlines and summaries.</p>
            </div>
          </div>
        </div>
      )}

      {results && (
        <div className="animate-fade-in-up delay-2">
          {/* Score card */}
          <div className="card-hover-lift" style={{ ...glassCard, padding: "32px", marginBottom: "32px", background: `linear-gradient(135deg, ${results.profileScore >= 80 ? "rgba(76,175,125,0.05)" : results.profileScore >= 60 ? theme.accent1 + "05" : "rgba(239,68,68,0.05)"}, transparent)`, border: `1px solid ${results.profileScore >= 80 ? "rgba(76,175,125,0.2)" : results.profileScore >= 60 ? theme.accent1 + "30" : "rgba(239,68,68,0.2)"}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap" }}>
              
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ position: "relative", width: "100px", height: "100px" }}>
                  <svg viewBox="0 0 36 36" style={{ width: "100px", height: "100px", transform: "rotate(-90deg)" }}>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={results.profileScore >= 80 ? "#10B981" : results.profileScore >= 60 ? theme.accent1 : "#EF4444"} strokeWidth="3" strokeDasharray={`${results.profileScore}, 100`} style={{ transition: "stroke-dasharray 1s ease-out" }} />
                  </svg>
                  <div style={{ position: "absolute", inset:0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                     <span style={{ fontSize: "32px", fontWeight: "900", fontFamily: "var(--font-display)", color: results.profileScore >= 80 ? (D ? "#7dcfa0" : "#2e7d52") : results.profileScore >= 60 ? theme.accent1 : "#EF4444", lineHeight: 1 }}>{results.profileScore}</span>
                  </div>
                </div>
                <p style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, margin: 0 }}>Profile Score</p>
              </div>
              
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "20px" }}>
                {Object.entries(results.scoreBreakdown || {}).map(([k, v]) => (
                  <div key={k}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: textSecondary, textTransform: "capitalize", letterSpacing: "0.05em" }}>{k}</span>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: v >= 80 ? (D ? "#7dcfa0" : "#2e7d52") : v >= 60 ? theme.accent1 : (D ? "#f08080" : "#b03030") }}>{v}/100</span>
                    </div>
                    <div style={{ height: "6px", borderRadius: "100px", background: D ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: "100px", width: `${v}%`, background: v >= 80 ? "#10B981" : v >= 60 ? theme.accent1 : "#EF4444", transition: "width 1s ease-out" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section tabs */}
          <div className="scroll-hide" style={{ display: "flex", gap: "8px", overflowX: "auto", marginBottom: "32px", paddingBottom: "4px" }}>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} className="nav-pill" style={{ padding: "12px 20px", fontSize: "14px", fontWeight: activeSection === s.id ? "800" : "600", borderRadius: "100px", border: activeSection === s.id ? `1px solid ${theme.accent1}` : `1px solid transparent`, color: activeSection === s.id ? theme.accent1 : textSecondary, background: activeSection === s.id ? `linear-gradient(135deg, ${theme.accent1}15, ${theme.accent2}05)` : (D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"), cursor: "pointer", flexShrink: 0, transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px", boxShadow: activeSection === s.id ? `0 4px 12px ${theme.accent1}20` : "none" }}>
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>

          {/* Tab Content Areas */}
          <div className="animate-fade-in">
            {/* Headline section */}
            {activeSection === "headline" && (
              <div className="card-hover-lift" style={{ ...glassCard, padding: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "800", color: textPrimary, margin: "0 0 4px", display: "flex", alignItems: "center", gap: "8px" }}>🏷️ Optimized Headline</h3>
                    <p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>The single most critical part for recruiter search rankings.</p>
                  </div>
                </div>
                
                <div style={{ position: "relative", padding: "24px", borderRadius: "16px", background: D ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)", border: `1px solid ${theme.accent1}40`, boxShadow: `inset 0 0 20px ${theme.accent1}05`, marginBottom: "32px" }}>
                  <p style={{ fontSize: "20px", fontWeight: "800", color: textPrimary, margin: "0 0 16px", lineHeight: 1.4, fontFamily: "var(--font-display)" }}>{results.headline}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px", paddingTop: "16px", borderTop: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                     <span style={{ fontSize: "12px", fontWeight: "600", color: textMuted }}>{results.headline?.length || 0}/120 maximum characters allowed</span>
                     <CopyBtn k="headline" text={results.headline} />
                  </div>
                </div>
                
                {results.headlineAlternatives?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: "12px", fontWeight: "800", color: textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Variations to consider</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {results.headlineAlternatives.map((alt, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "14px", background: D ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, transition: "background 0.2s" }}>
                          <p style={{ fontSize: "15px", fontWeight: "600", color: textSecondary, flex: 1, margin: 0, lineHeight: 1.5 }}>{alt}</p>
                          <CopyBtn k={`alt${i}`} text={alt} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* About section */}
            {activeSection === "about" && (
              <div className="card-hover-lift" style={{ ...glassCard, padding: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "800", color: textPrimary, margin: "0 0 4px", display: "flex", alignItems: "center", gap: "8px" }}>📖 About Section</h3>
                    <p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>Story-driven summary naturally packed with keywords.</p>
                  </div>
                  <CopyBtn k="about" text={results.about} />
                </div>
                
                <div style={{ padding: "24px", borderRadius: "16px", background: D ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                   <p style={{ fontSize: "15px", color: textPrimary, margin: 0, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{results.about}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                   <span style={{ fontSize: "12px", fontWeight: "600", color: textMuted }}>{(results.about?.length || 0)}/2000 characters used</span>
                </div>
              </div>
            )}

            {/* Experience */}
            {activeSection === "experience" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {(results.experienceDescriptions || []).map((exp, i) => (
                  <div key={i} className="card-hover-lift" style={{ ...glassCard, padding: "28px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "20px" }}>
                      <div>
                        <h3 style={{ fontSize: "18px", fontWeight: "800", color: textPrimary, margin: "0 0 4px" }}>{exp.role}</h3>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: theme.accent1, margin: 0 }}>{exp.company}</p>
                      </div>
                      <CopyBtn k={`exp${i}`} text={exp.optimized} />
                    </div>
                    
                    <div style={{ padding: "20px", borderRadius: "12px", background: D ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                      <p style={{ fontSize: "14px", color: textSecondary, margin: 0, lineHeight: 1.8, whiteSpace: "pre-line" }}>{exp.optimized}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {activeSection === "skills" && (
              <div className="card-hover-lift" style={{ ...glassCard, padding: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: textPrimary, margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>⚡ Top Skills to Add</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "32px" }}>
                  {(results.topSkills || []).map((s, i) => (
                    <button key={i} onClick={() => copy(`skill${i}`, s)} className="btn-glass" style={{ padding: "8px 16px", borderRadius: "10px", background: `linear-gradient(135deg, ${theme.accent1}15, ${theme.accent2}05)`, border: `1px solid ${theme.accent1}40`, color: theme.accent1, fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }} title="Click to copy">
                      {copied[`skill${i}`] ? "✓ Copied" : s}
                    </button>
                  ))}
                </div>
                
                <h4 style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: "16px", borderTop: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, paddingTop: "24px" }}>Core Keywords to Naturally Include</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {(results.keywordsToAdd || []).map((k, i) => (
                    <span key={i} style={{ padding: "6px 14px", borderRadius: "10px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, color: textSecondary, fontSize: "13px", fontWeight: "600" }}>#{k}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {activeSection === "tips" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {(results.profileTips || []).map((tip, i) => {
                  const pColor = priorityColor[tip.priority] || theme.accent1;
                  return (
                    <div key={i} className="card-hover-lift" style={{ ...glassCard, padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start", borderLeft: `4px solid ${pColor}` }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: pColor + "15", border: `1px solid ${pColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                        {tip.priority === "high" ? "🔥" : tip.priority === "medium" ? "⭐" : "💡"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                          <h4 style={{ fontSize: "16px", fontWeight: "800", color: textPrimary, margin: 0 }}>{tip.tip}</h4>
                          <span style={{ fontSize: "10px", padding: "4px 8px", borderRadius: "100px", background: pColor + "15", color: pColor, fontWeight: "800", letterSpacing: "0.05em", textTransform: "uppercase", border: `1px solid ${pColor}30` }}>{tip.priority} Priority</span>
                        </div>
                        <p style={{ fontSize: "14px", color: textSecondary, margin: 0, lineHeight: 1.6 }}>{tip.impact}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
