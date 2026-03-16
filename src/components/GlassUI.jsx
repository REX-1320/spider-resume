export const liquidGlass = {
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(20px) saturate(200%) brightness(1.05)",
  WebkitBackdropFilter: "blur(20px) saturate(200%) brightness(1.05)",
  border: "1px solid rgba(255,255,255,0.55)",
  boxShadow: "0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.03)",
};

export const liquidGlassDark = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
};

export const LabelCapsule = ({ label, isDark, textMuted }) => (
  <div style={{
    display: "inline-block", fontSize: "10px", fontWeight: "700",
    letterSpacing: "0.08em", padding: "3px 12px", borderRadius: "999px",
    marginBottom: "5px",
    background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)",
    backdropFilter: "blur(16px) saturate(200%)",
    WebkitBackdropFilter: "blur(16px) saturate(200%)",
    border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.75)",
    boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.08)" : "inset 0 1px 0 rgba(255,255,255,0.95), 0 1px 4px rgba(0,0,0,0.04)",
    color: textMuted,
  }}>{label}</div>
);

export const GInput = ({ inputStyle, style, isDark, label, textMuted, ...props }) => (
  <div style={{ width: "100%", boxSizing: "border-box", marginBottom: "10px" }}>
    {label && <LabelCapsule label={label} isDark={isDark} textMuted={textMuted} />}
    <input style={{ ...inputStyle, ...(isDark ? liquidGlassDark : liquidGlass), borderRadius: "12px", padding: "10px 14px", width: "100%", boxSizing: "border-box", ...style }} {...props} />
  </div>
);

export const GTextarea = ({ inputStyle, style, isDark, label, textMuted, ...props }) => (
  <div style={{ width: "100%", boxSizing: "border-box", marginBottom: "10px" }}>
    {label && <LabelCapsule label={label} isDark={isDark} textMuted={textMuted} />}
    <textarea style={{ ...inputStyle, ...(isDark ? liquidGlassDark : liquidGlass), borderRadius: "12px", padding: "10px 14px", resize: "none", width: "100%", boxSizing: "border-box", ...style }} {...props} />
  </div>
);

export const GSection = ({ glassCard, textMuted, title, children, action }) => (
  <div style={{ ...glassCard, padding: "18px", marginBottom: "14px", overflow: "hidden", boxSizing: "border-box" }}>
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
