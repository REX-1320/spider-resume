export const liquidGlass = {
  position: "relative",
  background: "rgba(255, 255, 255, 0.02)",
  backdropFilter: "blur(32px) saturate(180%) brightness(1.1)",
  WebkitBackdropFilter: "blur(32px) saturate(180%) brightness(1.1)",
  border: "1px solid transparent",
  borderTopColor: "rgba(255, 255, 255, 0.5)",
  borderLeftColor: "rgba(255, 255, 255, 0.4)",
  borderRightColor: "rgba(255, 255, 255, 0.05)",
  borderBottomColor: "rgba(255, 255, 255, 0.1)",
  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(0, 0, 0, 0.03), inset 0 4px 20px rgba(255, 255, 255, 0.15)",
};

export const liquidGlassDark = {
  position: "relative",
  background: "rgba(255, 255, 255, 0.01)",
  backdropFilter: "blur(32px) saturate(180%) brightness(1.2)",
  WebkitBackdropFilter: "blur(32px) saturate(180%) brightness(1.2)",
  border: "1px solid transparent",
  borderTopColor: "rgba(255, 255, 255, 0.15)",
  borderLeftColor: "rgba(255, 255, 255, 0.1)",
  borderRightColor: "rgba(255, 255, 255, 0.02)",
  borderBottomColor: "rgba(255, 255, 255, 0.05)",
  boxShadow: "0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -1px 2px rgba(0, 0, 0, 0.2), inset 0 4px 16px rgba(255, 255, 255, 0.04)",
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
