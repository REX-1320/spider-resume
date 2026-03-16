import { LOGO_SRC } from "../constants/themes";

const UpgradePage = ({
  openRazorpay, setPage,
  glassCard, glassBase, glassBtn, textPrimary, textSecondary, textMuted, theme, D,
}) => (
  <div className="animate-fade-in" style={{ maxWidth: "500px", margin: "0 auto", padding: "64px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
    
    {/* Amber glow effect */}
    <div className="ambient-blob animate-pulse" style={{ top: "10%", left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />

    <div className="animate-fade-in-down" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", borderRadius: "99px", background: D ? "rgba(201,169,110,0.1)" : "rgba(201,169,110,0.08)", border: `1px solid rgba(201,169,110,0.2)`, marginBottom: "28px" }}>
      <img src={LOGO_SRC} alt="Spider" style={{ height: "24px", width: "auto", objectFit: "contain", mixBlendMode: D ? "screen" : "multiply", filter: D ? "drop-shadow(0 0 10px rgba(201,169,110,0.4))" : "none" }} />
      <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.14em", textTransform: "uppercase", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Spider Pro</span>
    </div>

    <h2 className="animate-fade-in-up delay-1" style={{ fontSize: "40px", fontWeight: "900", fontFamily: "var(--font-display)", color: textPrimary, letterSpacing: "-1.5px", marginBottom: "16px", lineHeight: 1.1 }}>
      Elevate your resume.<br />
      <span style={{ background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2}, #fcf0d8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 4px 16px rgba(201,169,110,0.3))" }}>Land the job.</span>
    </h2>
    <p className="animate-fade-in-up delay-2" style={{ color: textSecondary, fontSize: "15px", marginBottom: "40px", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>Stand out from the crowd with premium templates and unlimited AI generations.</p>

    <div className="animate-fade-in-up delay-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
      {[
        { price: "₹99", label: "per month", tag: null, plan: "monthly" }, 
        { price: "₹499", label: "lifetime access", tag: "BEST VALUE ✨", plan: "lifetime" }
      ].map(({ price, label, tag, plan }) => (
        <div key={plan} onClick={() => openRazorpay(plan)} className="card-hover-lift" style={{ 
          position: "relative", 
          background: plan === "lifetime" ? (D ? "rgba(201,169,110,0.06)" : "rgba(201,169,110,0.04)") : (D ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.08)"),
          backdropFilter: "blur(24px) saturate(200%)", WebkitBackdropFilter: "blur(24px) saturate(200%)",
          border: plan === "lifetime" ? `1px solid rgba(201,169,110,0.3)` : `1px solid ${D ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
          borderRadius: "24px",
          padding: "28px 16px", cursor: "pointer", 
          boxShadow: plan === "lifetime" ? "0 12px 40px rgba(201,169,110,0.15)" : "none",
          transition: "all 0.3s ease"
        }}>
          {tag && <div className="animate-pulse-glow" style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", fontSize: "10px", fontWeight: "800", padding: "4px 14px", borderRadius: "12px", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, color: D ? "#0c0a08" : "#fff", whiteSpace: "nowrap", boxShadow: `0 4px 16px ${theme.accent1}40` }}>{tag}</div>}
          <p style={{ fontSize: "36px", fontWeight: "900", fontFamily: "var(--font-display)", color: plan === "lifetime" ? "#e8c88a" : textPrimary, marginBottom: "4px", letterSpacing: "-1px" }}>{price}</p>
          <p style={{ fontSize: "12px", color: textSecondary, fontWeight: "500" }}>{label}</p>
        </div>
      ))}
    </div>

    <div className="animate-fade-in-up delay-4" style={{ marginBottom: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {[
        ["🚫", "No watermarks or advertisements"],
        ["🎨", "Access to all 4 premium templates"],
        ["⬇️", "Unlimited high-res PDF downloads"],
        ["⚡", "Unlimited priority AI generations"],
        ["🔮", "First access to new app features"]
      ].map(([icon, text], i) => (
        <div key={text} className="animate-fade-in-right" style={{ display: "flex", alignItems: "center", gap: "16px", background: D ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.06)", border: `1px solid ${D ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"}`, borderRadius: "16px", padding: "16px 20px", textAlign: "left", animationDelay: `${0.4 + i * 0.1}s` }}>
          <span style={{ fontSize: "20px", filter: "drop-shadow(0 2px 8px rgba(201,169,110,0.2))" }}>{icon}</span>
          <span style={{ fontSize: "14px", fontWeight: "600", color: textPrimary }}>{text}</span>
          <span style={{ marginLeft: "auto", color: theme.accent1, fontWeight: "800" }}>✓</span>
        </div>
      ))}
    </div>

    <div className="animate-fade-in-up delay-5">
      <button onClick={() => openRazorpay("monthly")} className="btn-premium animate-pulse-glow" style={{ width: "100%", padding: "18px", fontSize: "16px", fontWeight: "800", cursor: "pointer", borderRadius: "20px", border: "none", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2}, #dab878)`, color: D ? "#0c0a08" : "#fff", marginBottom: "16px", boxShadow: `0 8px 32px ${theme.accent1}44` }}>
        ✦ Upgrade to Pro — ₹99/month
      </button>
      
      <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "12px", color: textMuted, marginBottom: "24px" }}>
        <span style={{ fontSize: "14px" }}>🔒</span> Secure payments by Razorpay
      </p>

      <button onClick={() => setPage("builder")} style={{ background: "none", border: "none", cursor: "pointer", color: textSecondary, fontSize: "14px", fontWeight: "600", padding: "12px", transition: "color 0.2s" }}>
        ← Back to builder
      </button>
    </div>
  </div>
);

export default UpgradePage;
