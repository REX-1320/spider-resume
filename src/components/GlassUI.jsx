/* ═══════════════════════════════════════════════════════════════
   GlassUI — Premium Liquid Acrylic Glass Components
   ═══════════════════════════════════════════════════════════════ */

export const liquidGlass = {
  position: "relative",
  background: "linear-gradient(135deg, rgba(255,255,255,0.30), rgba(255,255,255,0.10))",
  backdropFilter: "blur(28px) saturate(180%)",
  WebkitBackdropFilter: "blur(28px) saturate(180%)",
  border: "1px solid transparent",
  borderTopColor: "rgba(255,255,255,0.85)",
  borderLeftColor: "rgba(255,255,255,0.7)",
  borderRightColor: "rgba(255,255,255,0.05)",
  borderBottomColor: "rgba(255,255,255,0.1)",
  boxShadow:
    "0 12px 40px rgba(0,0,0,0.18), " +
    "inset 2px 2px 6px rgba(255,255,255,0.75), " +
    "inset -6px -6px 14px rgba(0,0,0,0.25), " +
    "inset 0 0 18px rgba(255,255,255,0.12)",
};

export const liquidGlassDark = {
  position: "relative",
  background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.02))",
  backdropFilter: "blur(32px) saturate(200%) brightness(1.2)",
  WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.2)",
  border: "1px solid transparent",
  borderTopColor: "rgba(255,255,255,0.4)",
  borderLeftColor: "rgba(255,255,255,0.3)",
  borderRightColor: "rgba(255,255,255,0.02)",
  borderBottomColor: "rgba(255,255,255,0.05)",
  boxShadow:
    "0 16px 50px rgba(0,0,0,0.4), " +
    "inset 2px 2px 6px rgba(255,255,255,0.3), " +
    "inset -6px -6px 14px rgba(0,0,0,0.4), " +
    "inset 0 0 18px rgba(255,255,255,0.1)",
};

export const LabelCapsule = ({ label, isDark, textMuted }) => (
  <div style={{
    display: "inline-block", fontSize: "10px", fontWeight: "700",
    letterSpacing: "0.08em", padding: "4px 14px", borderRadius: "999px",
    marginBottom: "6px",
    background: isDark
      ? "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))"
      : "linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.25))",
    backdropFilter: "blur(16px) saturate(200%)",
    WebkitBackdropFilter: "blur(16px) saturate(200%)",
    border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.75)",
    boxShadow: isDark
      ? "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.2)"
      : "inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(0,0,0,0.06), inset -1px -1px 3px rgba(0,0,0,0.08)",
    color: textMuted,
  }}>{label}</div>
);

export const GInput = ({ inputStyle, style, isDark, label, textMuted, ...props }) => (
  <div style={{ width: "100%", boxSizing: "border-box", marginBottom: "10px" }}>
    {label && <LabelCapsule label={label} isDark={isDark} textMuted={textMuted} />}
    <input className="glass-input" style={{ ...inputStyle, width: "100%", boxSizing: "border-box", ...style }} {...props} />
  </div>
);

export const GTextarea = ({ inputStyle, style, isDark, label, textMuted, ...props }) => (
  <div style={{ width: "100%", boxSizing: "border-box", marginBottom: "10px" }}>
    {label && <LabelCapsule label={label} isDark={isDark} textMuted={textMuted} />}
    <textarea className="glass-input" style={{ ...inputStyle, resize: "none", width: "100%", boxSizing: "border-box", ...style }} {...props} />
  </div>
);

export const GSection = ({ glassCard, textMuted, title, children, action }) => (
  <div className="glass-panel" style={{ ...(glassCard || {}), marginBottom: "14px", overflow: "hidden", boxSizing: "border-box" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
      {typeof title === "string" ? (
        <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted }}>{title}</span>
      ) : (
        title
      )}
      {action}
    </div>
    <div style={{ width: "100%", boxSizing: "border-box" }}>{children}</div>
  </div>
);
