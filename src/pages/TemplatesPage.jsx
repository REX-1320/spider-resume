// src/pages/TemplatesPage.jsx — AI Template Generator (20 templates, regenerate, custom prompt)
import { useState } from "react";

const TEMPLATE_STYLES = [
  { id: "modern", label: "Modern", icon: "⚡" },
  { id: "minimal", label: "Minimal", icon: "◻" },
  { id: "premium", label: "Premium", icon: "💎" },
  { id: "luxury", label: "Luxury", icon: "✨" },
  { id: "bold", label: "Bold", icon: "🔥" },
  { id: "classic", label: "Classic", icon: "📋" },
  { id: "creative", label: "Creative", icon: "🎨" },
  { id: "tech", label: "Tech", icon: "💻" },
  { id: "executive", label: "Executive", icon: "👔" },
  { id: "fresh", label: "Fresher", icon: "🎓" },
  { id: "any", label: "AI Decides", icon: "🤖" },
];

export default function TemplatesPage({ callAI, form, setForm, setTemplate, setPage, glassCard, glassBase, glassBtn, glassInput, textPrimary, textSecondary, textMuted, theme, D }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [applied, setApplied] = useState(false);
  const [styleFilter, setStyleFilter] = useState("any");
  const [customPrompt, setCustomPrompt] = useState("");
  const [genCount, setGenCount] = useState(0);

  const generate = async () => {
    setLoading(true);
    setApplied(false);
    setSelected(null);

    const person = form.name || "a professional";
    const role = form.experience?.[0]?.role || "Job Seeker";
    const skills = form.skills || "various skills";
    const edu = form.education?.[0]?.degree || "";
    const styleNote = styleFilter === "any" ? "mix of all styles" : `focus on ${styleFilter} style`;
    const extra = customPrompt ? `User's specific request: "${customPrompt}"` : "";

    try {
      const raw = await callAI(`Generate exactly 20 unique resume template designs for ${person}, a ${role}${edu ? ` with ${edu}` : ""}, skilled in ${skills}.
Style focus: ${styleNote}. ${extra}
This is generation #${genCount + 1} — make these DIFFERENT from any previous generation. Be creative and varied.

Return ONLY a valid JSON array of exactly 20 objects. No markdown, no explanation:
[{"id":1,"name":"Template name (2-4 words)","style":"Modern|Minimal|Premium|Luxury|Bold|Classic|Creative|Tech|Executive|Fresher","vibe":"One punchy sentence describing its feel","accent":"#hexcolor","layout":"Single column|Two column|Sidebar|Header-focused|Skills-first","font":"Font pairing suggestion","bestFor":"Specific role/industry","colorScheme":"brief color description","summary":"Custom 1-2 sentence professional summary for this person in this template's voice"}]
Make each genuinely different. Vary styles, colors, layouts, tones. Use real hex colors. Be specific about who each template suits.`);

      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setTemplates(Array.isArray(parsed) ? parsed.slice(0, 20) : []);
      setGenCount(c => c + 1);
    } catch (e) {
      alert("Generation failed — please try again.");
    }
    setLoading(false);
  };

  const apply = (t) => {
    setSelected(t.id);
    const map = { Modern: "Modern", Tech: "Modern", Premium: "Modern", Minimal: "Minimal", Creative: "Minimal", Luxury: "Minimal", Bold: "Bold", Executive: "Classic", Classic: "Classic", Fresher: "Classic", Fresh: "Classic" };
    setTemplate(map[t.style] || "Classic");
    if (t.summary) setForm(p => ({ ...p, summary: t.summary }));
    setApplied(true);
  };

  const accent = `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 40px", zIndex: 1, position: "relative" }}>
      {/* Header card */}
      <div style={{ ...glassCard, padding: "20px 22px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 17, fontWeight: 800, color: textPrimary, margin: "0 0 4px" }}>🎨 AI Template Generator</p>
            <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>Generate 20 unique resume designs tailored to your profile</p>
          </div>
          {genCount > 0 && (
            <span style={{ fontSize: 10, padding: "4px 10px", borderRadius: 10, background: `${theme.accent1}22`, color: theme.accent1, fontWeight: 700, border: `1px solid ${theme.accent1}44`, alignSelf: "flex-start" }}>
              Generation #{genCount}
            </span>
          )}
        </div>

        {/* Style filter */}
        <div style={{ marginTop: 14, marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: 8 }}>Style Focus</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TEMPLATE_STYLES.map(s => (
              <button key={s.id} onClick={() => setStyleFilter(s.id)} style={{ ...glassBtn, padding: "6px 12px", fontSize: 12, borderRadius: 10, border: styleFilter === s.id ? `1.5px solid ${theme.accent1}` : undefined, color: styleFilter === s.id ? theme.accent1 : textSecondary, background: styleFilter === s.id ? `${theme.accent1}18` : undefined, cursor: "pointer" }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom prompt */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: 6 }}>Describe Your Ideal Resume (optional)</p>
          <input
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder='e.g. "dark background with gold accents, two-column, tech startup vibe"'
            style={{ ...glassInput, borderRadius: 14, padding: "10px 16px", fontSize: 13, color: textPrimary, width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <button onClick={generate} disabled={loading} style={{ ...glassBtn, width: "100%", padding: 13, fontSize: 14, fontWeight: 700, background: loading ? "transparent" : accent, color: loading ? textMuted : (D ? "#1a1410" : "#2d2520"), borderRadius: 14, cursor: loading ? "not-allowed" : "pointer", border: "none" }}>
          {loading ? "✨ Generating 20 templates..." : genCount > 0 ? "🔄 Regenerate 20 New Templates" : "✨ Generate 20 Templates"}
        </button>
      </div>

      {/* Applied banner */}
      {applied && (
        <div style={{ ...glassCard, padding: "12px 18px", marginBottom: 14, background: D ? "rgba(76,175,125,0.1)" : "rgba(76,175,125,0.08)", border: "1px solid rgba(76,175,125,0.28)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: D ? "#7dcfa0" : "#2e7d52", fontWeight: 600 }}>✅ Template applied! Summary updated in your resume.</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setPage("builder")} style={{ ...glassBtn, padding: "7px 14px", fontSize: 12, color: D ? "#7dcfa0" : "#2e7d52", borderRadius: 10 }}>✏️ Builder</button>
            <button onClick={() => setPage("preview")} style={{ ...glassBtn, padding: "7px 14px", fontSize: 12, color: D ? "#7dcfa0" : "#2e7d52", borderRadius: 10 }}>👁 Preview</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && templates.length === 0 && (
        <div style={{ ...glassCard, padding: "50px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 44, marginBottom: 14 }}>🎨</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 8 }}>No templates yet</p>
          <p style={{ fontSize: 13, color: textSecondary, marginBottom: 22, lineHeight: 1.6 }}>
            Choose a style focus, optionally describe what you want,<br />then hit Generate — AI creates 20 personalized designs.
          </p>
          <button onClick={generate} style={{ ...glassBtn, padding: "12px 28px", fontSize: 14, fontWeight: 700, background: accent, color: D ? "#1a1410" : "#2d2520", borderRadius: 14, border: "none" }}>✨ Generate 20 Templates</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ ...glassCard, padding: 18, minHeight: 160, opacity: 0.5 + (i % 3) * 0.1, animation: `tmplpulse 1.4s ease ${i * 0.04}s infinite` }}>
              <div style={{ height: 3, borderRadius: 3, background: D ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)", marginBottom: 12 }} />
              <div style={{ height: 10, width: "60%", borderRadius: 6, background: D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", marginBottom: 8 }} />
              <div style={{ height: 8, width: "90%", borderRadius: 6, background: D ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)", marginBottom: 6 }} />
              <div style={{ height: 8, width: "75%", borderRadius: 6, background: D ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)" }} />
            </div>
          ))}
        </div>
      )}

      {/* Templates grid */}
      {!loading && templates.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(205px,1fr))", gap: 12 }}>
          {templates.map(t => (
            <div key={t.id} onClick={() => apply(t)} style={{ ...glassCard, padding: "0 0 16px", cursor: "pointer", border: selected === t.id ? `2px solid ${t.accent || theme.accent1}` : glassCard.border, transition: "all 0.2s", overflow: "hidden", position: "relative" }}>
              {/* Color bar */}
              <div style={{ height: 4, background: t.accent || theme.accent1, width: "100%", marginBottom: 14 }} />
              {selected === t.id && (
                <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderRadius: "50%", background: t.accent || theme.accent1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }}>✓</div>
              )}
              <div style={{ padding: "0 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: t.accent || theme.accent1 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.accent || theme.accent1 }}>{t.style}</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 800, color: textPrimary, margin: "0 0 5px", lineHeight: 1.3 }}>{t.name}</p>
                <p style={{ fontSize: 11, color: textSecondary, margin: "0 0 10px", lineHeight: 1.5 }}>{t.vibe}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 10 }}>
                  <span style={{ fontSize: 10, color: textMuted }}>📐 {t.layout}</span>
                  <span style={{ fontSize: 10, color: textMuted }}>🎨 {t.colorScheme}</span>
                  <span style={{ fontSize: 10, color: textMuted }}>✍️ {t.font}</span>
                  <span style={{ fontSize: 10, color: textMuted }}>🎯 {t.bestFor}</span>
                </div>
                {t.summary && (
                  <div style={{ padding: "8px 10px", borderRadius: 10, background: D ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.4)", border: `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)"}`, marginBottom: 12 }}>
                    <p style={{ fontSize: 10, color: textSecondary, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>"{t.summary.substring(0, 90)}{t.summary.length > 90 ? "…" : ""}"</p>
                  </div>
                )}
                <button style={{ width: "100%", padding: "8px", borderRadius: 10, border: `1px solid ${t.accent || theme.accent1}55`, background: selected === t.id ? `${t.accent || theme.accent1}22` : "transparent", color: t.accent || theme.accent1, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {selected === t.id ? "✓ Applied" : "Apply Style"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regenerate button at bottom */}
      {!loading && templates.length > 0 && (
        <button onClick={generate} style={{ ...glassBtn, width: "100%", padding: 13, fontSize: 14, fontWeight: 700, marginTop: 20, background: accent, color: D ? "#1a1410" : "#2d2520", borderRadius: 14, border: "none" }}>
          🔄 Generate 20 New Templates
        </button>
      )}

      <style>{`@keyframes tmplpulse{0%,100%{opacity:.45}50%{opacity:.75}}`}</style>
    </div>
  );
}
