import DownloadResume from "../components/DownloadResume";

const PreviewPage = ({
  form, appliedTemplateHtml, setAppliedTemplateHtml,
  glassCard, glassBtn, textPrimary, textSecondary, textMuted, theme, D, isPro, setPage,
  glassBase,
}) => {
  const renderDefaultPreview = () => (
    <div style={{ padding: "48px 40px", fontFamily: "var(--font-body)", color: "#1a1612", background: "#fff" }}>
      <div style={{ marginBottom: "32px", borderBottom: "1px solid rgba(201,169,110,0.3)", paddingBottom: "24px", display: "flex", alignItems: "flex-start", gap: "24px" }}>
        {form.photo && <img src={form.photo} alt="Profile" style={{ width: "96px", height: "96px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "3px solid #f8f4e6", boxShadow: "0 4px 16px rgba(201,169,110,0.15)" }} />}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: "700", color: "#1a1612", letterSpacing: "-1px", marginBottom: "8px", lineHeight: 1.1 }}>{form.name || "Your Name"}</h1>
          {form.experience?.[0]?.role && <p style={{ fontSize: "16px", color: "#666", margin: "0 0 12px", fontWeight: 500 }}>{form.experience[0].role}{form.experience[0].company ? ` · ${form.experience[0].company}` : ""}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "13px", color: "#888" }}>
            {form.email && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>✉ {form.email}</span>}
            {form.phone && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>📞 {form.phone}</span>}
            {form.location && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>📍 {form.location}</span>}
            {form.linkedin && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>🔗 {form.linkedin}</span>}
          </div>
        </div>
      </div>
      
      {form.summary && (
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            Summary <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(201,169,110,0.3), transparent)" }} />
          </h2>
          <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.7", margin: 0 }}>{form.summary}</p>
        </div>
      )}

      {form.experience?.some(e => e.role) && (
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            Experience <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(201,169,110,0.3), transparent)" }} />
          </h2>
          {form.experience.filter(e => e.role).map((e, i) => (
            <div key={i} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <p style={{ fontSize: "15px", fontWeight: "700", color: "#1a1612", margin: 0 }}>{e.role}{e.company && <span style={{ color: "#666", fontWeight: "400" }}> · {e.company}</span>}</p>
                <p style={{ fontSize: "12px", color: "#888", margin: 0, fontWeight: "500", fontVariantNumeric: "tabular-nums" }}>{e.duration}</p>
              </div>
              {e.desc && <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.65", marginTop: "6px", marginBottom: 0 }}>{e.desc}</p>}
            </div>
          ))}
        </div>
      )}

      {form.education?.some(e => e.degree) && (
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            Education <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(201,169,110,0.3), transparent)" }} />
          </h2>
          {form.education.filter(e => e.degree).map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1612", margin: 0 }}>{e.degree}{e.school && <span style={{ color: "#666", fontWeight: "400" }}> — {e.school}</span>}</p>
              <p style={{ fontSize: "12px", color: "#888", margin: 0, fontWeight: "500", fontVariantNumeric: "tabular-nums" }}>{e.year}</p>
            </div>
          ))}
        </div>
      )}

      {form.skills && (
        <div>
          <h2 style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            Skills <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(201,169,110,0.3), transparent)" }} />
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {form.skills.split(",").map((s, i) => <span key={i} style={{ background: "#fcfaf5", border: "1px solid rgba(201,169,110,0.2)", padding: "6px 14px", borderRadius: "8px", fontSize: "13px", color: "#555", fontWeight: "500" }}>{s.trim()}</span>)}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      
      <div className="animate-fade-in-down" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "4px" }}>Resume Preview</h2>
          <p style={{ fontSize: "13px", color: textSecondary }}>This is how your final resume will look.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setPage("builder")} className="btn-glass" style={{ padding: "10px 16px", fontSize: "13px", borderRadius: "14px", color: textSecondary }}>
            ✏️ Edit
          </button>
        </div>
      </div>

      {appliedTemplateHtml && (
        <div className="animate-fade-in-scale" style={{ ...glassCard, padding: "14px 20px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: D ? "rgba(125,207,160,0.08)" : "rgba(46,125,82,0.06)", border: `1px solid ${D ? "rgba(125,207,160,0.2)" : "rgba(46,125,82,0.2)"}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>✅</span>
            <span style={{ fontSize: "13px", color: D ? "#7dcfa0" : "#2e7d52", fontWeight: "600" }}>Custom premium template applied</span>
          </div>
          <button onClick={() => setAppliedTemplateHtml(null)} className="btn-glass" style={{ padding: "6px 14px", fontSize: "12px", color: textMuted, borderRadius: "10px" }}>✕ Reset to default</button>
        </div>
      )}

      <div className="animate-fade-in-up delay-2" style={{ position: "relative" }}>
        {/* Glow effect behind resume */}
        <div className="animate-pulse" style={{ position: "absolute", top: "10%", left: "5%", right: "5%", bottom: "10%", background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)", filter: "blur(60px)", zIndex: -1, pointerEvents: "none" }} />
        
        <div id="resume-printable" style={{ background: "#fff", borderRadius: "24px", overflow: "hidden", boxShadow: D ? "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)" : "0 24px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)" }}>
          {appliedTemplateHtml ? <div dangerouslySetInnerHTML={{ __html: appliedTemplateHtml }} /> : renderDefaultPreview()}
        </div>
      </div>

      <div className="animate-fade-in-up delay-4" style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <DownloadResume form={form} glassCard={glassCard} glassBase={glassBase} glassBtn={glassBtn} textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} theme={theme} D={D} />
        
        {!isPro && (
          <button onClick={() => setPage("upgrade")} className="card-hover-lift animate-pulse-glow" style={{ width: "100%", padding: "18px", fontSize: "14px", fontWeight: "700", background: `linear-gradient(135deg, ${theme.accent1}15, ${theme.accent2}08)`, color: textPrimary, borderRadius: "16px", border: `1px solid ${theme.accent1}44`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ color: theme.accent1 }}>✦</span> Remove watermark & unlock 4 premium templates
          </button>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
