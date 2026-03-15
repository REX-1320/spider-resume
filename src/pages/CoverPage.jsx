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
      const result = await callAI(`Write a ${tone} cover letter for ${form.name || "the applicant"} applying for "${jobTitle || "the advertised position"}" at "${company || "your company"}".

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
  const inputStyle = { ...glassInput, borderRadius: 14, padding: "11px 16px", fontSize: 13, color: textPrimary, width: "100%", boxSizing: "border-box", outline: "none", fontFamily: "inherit" };
  const Label = ({ t }) => <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 12px", borderRadius: 999, marginBottom: 6, display: "inline-block", background: D ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)", border: D ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.75)", color: textMuted }}>{t}</div>;

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "20px 16px 40px", zIndex: 1, position: "relative" }}>
      {/* Header */}
      <div style={{ ...glassCard, padding: "18px 22px", marginBottom: 14 }}>
        <p style={{ fontSize: 17, fontWeight: 800, color: textPrimary, margin: "0 0 4px" }}>📝 Cover Letter Generator</p>
        <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>AI writes a tailored, job-specific cover letter from your resume — edit and copy instantly.</p>
      </div>

      {/* Job details */}
      <div style={{ ...glassCard, padding: "18px 20px", marginBottom: 12 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: 12 }}>Job Details</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div><Label t="Job Title" /><input placeholder="Software Engineer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} style={inputStyle} /></div>
          <div><Label t="Company Name" /><input placeholder="Google, Infosys..." value={company} onChange={e => setCompany(e.target.value)} style={inputStyle} /></div>
        </div>
        <Label t="Job Description (optional — improves accuracy)" />
        <textarea placeholder="Paste job description or key requirements here..." value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={3} style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} />
      </div>

      {/* Tone selector */}
      <div style={{ ...glassCard, padding: "16px 20px", marginBottom: 14 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: 10 }}>Tone</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TONES.map(t => (
            <button key={t.id} onClick={() => setTone(t.id)} style={{ ...glassBtn, padding: "7px 14px", fontSize: 12, fontWeight: 600, borderRadius: 12, border: tone === t.id ? `1.5px solid ${theme.accent1}` : undefined, color: tone === t.id ? theme.accent1 : textSecondary, background: tone === t.id ? `${theme.accent1}18` : undefined, cursor: "pointer" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resume being used */}
      {form.name && (
        <div style={{ ...glassCard, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>👤</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: textPrimary, margin: 0 }}>{form.name}</p>
            <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>{form.experience?.[0]?.role || ""}  {form.experience?.[0]?.company ? `· ${form.experience[0].company}` : ""}</p>
          </div>
          <span style={{ fontSize: 10, color: D ? "#7dcfa0" : "#2e7d52", fontWeight: 700 }}>✓ Using your resume</span>
        </div>
      )}

      {/* Generate */}
      <button onClick={generate} disabled={loading} style={{ ...glassBtn, width: "100%", padding: 14, fontSize: 15, fontWeight: 700, marginBottom: 18, background: loading ? "transparent" : accent, color: loading ? textMuted : (D ? "#1a1410" : "#2d2520"), borderRadius: 16, cursor: loading ? "not-allowed" : "pointer", border: "none" }}>
        {loading ? "✨ Writing your cover letter..." : version > 0 ? "🔄 Regenerate Cover Letter" : "✨ Generate Cover Letter"}
      </button>

      {/* Output */}
      {letter && (
        <div style={{ ...glassCard, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, margin: 0 }}>Your Cover Letter</p>
              {version > 1 && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 8, background: `${theme.accent1}22`, color: theme.accent1, fontWeight: 700 }}>v{version}</span>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={copy} style={{ ...glassBtn, padding: "6px 14px", fontSize: 12, borderRadius: 10, color: copied ? (D ? "#7dcfa0" : "#2e7d52") : textSecondary, border: copied ? "1px solid rgba(76,175,125,0.4)" : undefined, cursor: "pointer" }}>
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
              <button onClick={generate} disabled={loading} style={{ ...glassBtn, padding: "6px 14px", fontSize: 12, borderRadius: 10, color: textSecondary, cursor: "pointer" }}>🔄 Redo</button>
            </div>
          </div>
          <textarea value={letter} onChange={e => setLetter(e.target.value)} rows={20} style={{ ...inputStyle, lineHeight: 1.8, fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: 13, resize: "vertical", borderRadius: 14, padding: 16 }} />
          <p style={{ fontSize: 11, color: textMuted, marginTop: 10, textAlign: "center" }}>✏️ Editable — make it yours. Copy and paste into your job application.</p>
        </div>
      )}
    </div>
  );
}
