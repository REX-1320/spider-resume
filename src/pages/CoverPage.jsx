// src/pages/CoverPage.jsx — AI Cover Letter Generator
import { useState } from "react";

const TONES = [
  { id: "professional", label: "Professional", icon: "👔" },
  { id: "enthusiastic", label: "Enthusiastic", icon: "🔥" },
  { id: "concise", label: "Concise", icon: "⚡" },
  { id: "creative", label: "Creative", icon: "🎨" },
  { id: "formal", label: "Formal", icon: "🎩" },
  { id: "friendly", label: "Friendly", icon: "😊" },
];

export default function CoverPage({ callAI, form, glassCard, glassBase, glassBtn, glassInput, textPrimary, textSecondary, textMuted, theme, D }) {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [tone, setTone] = useState("professional");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [version, setVersion] = useState(0);

  const generate = async () => {
    setLoading(true);
    setCopied(false);
    try {
      const response = await callAI(`Write a ${tone} cover letter for ${form.name || "the applicant"} applying for "${jobTitle || "the advertised position"}" at "${company || "your company"}".

Resume data:
- Name: ${form.name || "N/A"}
- Email: ${form.email || ""}
- Current/Latest Role: ${form.experience?.[0]?.role || "N/A"} at ${form.experience?.[0]?.company || "N/A"}
- Experience: ${form.experience?.map(e => `${e.role} at ${e.company} (${e.duration})`).filter(e => !e.includes("N/A")).join("; ") || "N/A"}
- Education: ${form.education?.map(e => `${e.degree} from ${e.school}`).filter(e => !e.includes("undefined")).join("; ") || "N/A"}
- Skills: ${form.skills || "N/A"}
- Summary: ${form.summary || "N/A"}
${jobDesc ? `\nJob description context: ${jobDesc}` : ""}

Instructions:
- Tone: ${tone} — really commit to this tone
- Structure: Opening hook → Why this company → What I bring → Call to action
- Length: 3-4 paragraphs, under 300 words
- Do NOT use placeholder brackets like [Your Name] — use real data
- Do NOT start with "I am writing to..."
- Make the opening line memorable and specific to ${company || "the company"}
- End with name: ${form.name || "Applicant"}
- This is version #${version + 1} — make it fresh and different from any previous version
- Return ONLY the cover letter text, no extra commentary or title`);
      const result = typeof response === 'string' ? response : response.content;
      console.log(`AI Model Used: ${response.provider} - ${response.model}`);

      setLetter(result.trim());
      setVersion(v => v + 1);
    } catch (e) {
      setLetter("❌ Failed to generate. Please try again.");
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const accent = `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`;
  const inputStyle = {  borderRadius: 14, padding: "11px 16px", fontSize: 13, color: textPrimary, width: "100%", boxSizing: "border-box", outline: "none", fontFamily: "inherit" };
  const Label = ({ t }) => <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 12px", borderRadius: 999, marginBottom: 6, display: "inline-block", background: D ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)", border: D ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.75)", color: textMuted }}>{t}</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", zIndex: 1, position: "relative" }}>
      {/* Header */}
      <div className="animate-fade-in-down" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="ambient-blob animate-float" style={{ width: "56px", height: "56px", borderRadius: "16px", background: `linear-gradient(135deg, ${theme.accent1}20, ${theme.accent2}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
            📝
          </div>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "4px", letterSpacing: "-0.5px" }}>Cover Letter Generator</h2>
            <p style={{ fontSize: "14px", color: textSecondary, margin: 0 }}>AI writes a tailored, job-specific cover letter from your resume.</p>
          </div>
        </div>
      </div>

      <div className="card-hover-lift animate-fade-in-up delay-1 glass-panel" style={{ padding: "32px", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "400px", height: "400px", background: `radial-gradient(circle, ${theme.accent1}10 0%, transparent 60%)`, pointerEvents: "none" }} />
        
        {/* Resume being used */}
        {form.name && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "16px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, marginBottom: "32px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `linear-gradient(135deg, ${theme.accent1}20, ${theme.accent2}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>👤</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "15px", fontWeight: "800", color: textPrimary, margin: "0 0 4px" }}>{form.name}</p>
              <p style={{ fontSize: "13px", color: textSecondary, margin: 0 }}>{form.experience?.[0]?.role || ""} {form.experience?.[0]?.company ? `· ${form.experience[0].company}` : ""}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "100px", background: "rgba(76,175,125,0.1)", border: "1px solid rgba(76,175,125,0.2)" }}>
              <span style={{ fontSize: "14px" }}>✨</span>
              <span style={{ fontSize: "11px", fontWeight: "800", color: D ? "#7dcfa0" : "#2e7d52", letterSpacing: "0.05em", textTransform: "uppercase" }}>Resume Linked</span>
            </div>
          </div>
        )}

        {/* Job details */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", color: textMuted, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "24px", height: "1px", background: textMuted }} /> Target Role
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: textSecondary, marginBottom: "8px" }}>Job Title</label>
              <input placeholder="e.g. Senior Frontend Engineer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: textSecondary, marginBottom: "8px" }}>Company Name</label>
              <input placeholder="e.g. Google, Microsoft" value={company} onChange={e => setCompany(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: textSecondary, marginBottom: "8px" }}>Job Description <span style={{ color: textMuted, fontWeight: "normal" }}>(Optional but recommended)</span></label>
            <textarea placeholder="Paste the job description or key requirements here to perfectly tailor the letter..." value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }} />
          </div>
        </div>

        {/* Tone selector */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", color: textMuted, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "24px", height: "1px", background: textMuted }} /> Letter Tone
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {TONES.map(t => (
              <button 
                key={t.id} 
                onClick={() => setTone(t.id)} 
                className="nav-pill"
                style={{ 
                  padding: "12px 20px", 
                  fontSize: "14px", 
                  fontWeight: tone === t.id ? "800" : "600", 
                  borderRadius: "100px", 
                  border: tone === t.id ? `1px solid ${theme.accent1}` : `1px solid transparent`, 
                  color: tone === t.id ? theme.accent1 : textSecondary, 
                  background: tone === t.id ? `linear-gradient(135deg, ${theme.accent1}15, ${theme.accent2}05)` : (D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"), 
                  cursor: "pointer", 
                  transition: "all 0.2s", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  boxShadow: tone === t.id ? `0 4px 12px ${theme.accent1}20` : "none" 
                }}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button 
          onClick={generate} 
          disabled={loading} 
          className={loading ? "btn-glass" : "btn-premium animate-pulse-glow"} 
          style={{ 
            width: "100%", 
            padding: "18px", 
            fontSize: "16px", 
            fontWeight: "800", 
            background: loading ? "transparent" : `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, 
            color: loading ? textMuted : (D ? "#0c0a08" : "#fff"), 
            borderRadius: "16px", 
            cursor: loading ? "not-allowed" : "pointer", 
            border: loading ? `1px solid ${D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: loading ? "none" : `0 8px 24px ${theme.accent1}40`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}>
          {loading ? (
             <><span className="spinner" style={{ display: "inline-block", width: "18px", height: "18px", border: `2px solid ${textMuted}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Generating custom letter...</>
          ) : version > 0 ? "🔄 Regenerate Different Version" : "✨ Generate Perfect Cover Letter"}
        </button>
      </div>

      {/* Output Area */}
      {letter && (
        <div className="card-hover-lift animate-fade-in-up delay-2 glass-panel" style={{ padding: "32px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: `linear-gradient(90deg, ${theme.accent1}, ${theme.accent2})` }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: textPrimary, margin: 0 }}>Generated Result</h3>
              {version > 0 && (
                <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "100px", background: `${theme.accent1}20`, color: theme.accent1, border: `1px solid ${theme.accent1}40` }}>
                  Version {version}
                </span>
              )}
            </div>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={generate} disabled={loading} className="btn-glass" style={{ padding: "8px 16px", fontSize: "14px", fontWeight: "700", borderRadius: "12px", color: textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                🔄 Regenerate
              </button>
              <button onClick={copy} className={copied ? "btn-glass" : "btn-premium"} style={{ padding: "8px 20px", fontSize: "14px", fontWeight: "800", borderRadius: "12px", background: copied ? "rgba(76,175,125,0.1)" : `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, color: copied ? (D ? "#7dcfa0" : "#2e7d52") : (D ? "#0c0a08" : "#fff"), border: copied ? "1px solid rgba(76,175,125,0.3)" : "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}>
                {copied ? "✓ Copied to Clipboard" : "📋 Copy Application"}
              </button>
            </div>
          </div>
          
          <div style={{ padding: "4px", borderRadius: "16px", background: D ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
            <textarea 
              value={letter} 
              onChange={e => setLetter(e.target.value)} 
              rows={22} 
              style={{ 
                ...inputStyle, 
                lineHeight: 1.8, 
                fontFamily: "'Georgia', 'Times New Roman', serif", 
                fontSize: "15px", 
                resize: "vertical", 
                borderRadius: "12px", 
                padding: "24px",
                background: "transparent",
                border: "none"
              }} 
            />
          </div>
          
          <p style={{ fontSize: "13px", color: textMuted, marginTop: "20px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span>✏️</span> The letter is fully editable above. Review and tailor it before sending!
          </p>
        </div>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
