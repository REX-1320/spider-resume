import { useState } from "react";
import { liquidGlass, liquidGlassDark } from "../components/GlassUI";
import { PROMO_CODES } from "../constants/themes";

const AccountPage = ({
  userData, isPro, setIsPro, setUserData, user, db,
  logout, setPage, setScreen,
  glassCard, glassBase, glassBtn, textPrimary, textSecondary, textMuted, theme, D,
}) => {
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState(null);
  const [promoMsg, setPromoMsg] = useState("");

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    const promo = PROMO_CODES[code];
    if (!promo) { setPromoStatus("error"); setPromoMsg("Invalid promo code. Try again!"); return; }
    if (!user) { setPromoStatus("error"); setPromoMsg("Please log in first to apply a promo code."); return; }
    if (userData?.usedPromos?.includes(code)) { setPromoStatus("error"); setPromoMsg("You've already used this promo code."); return; }
    const { doc: firestoreDoc, updateDoc } = await import("firebase/firestore");
    const ref = firestoreDoc(db, "users", user.uid);
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + promo.months);
    await updateDoc(ref, { isPro: true, plan: "promo", promoCode: code, promoExpires: expiresAt.toISOString(), usedPromos: [...(userData?.usedPromos || []), code] });
    setIsPro(true);
    setUserData(p => ({ ...p, isPro: true, plan: "promo", promoCode: code }));
    setPromoStatus("success");
    setPromoMsg(`🎉 ${promo.label} activated! Enjoy Spider Pro.`);
    setTimeout(() => setPage("builder"), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "540px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      
      <div className="animate-fade-in-down" style={{ marginBottom: "32px", textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "8px", letterSpacing: "-0.5px" }}>Account Settings</h2>
        <p style={{ fontSize: "14px", color: textSecondary }}>Manage your profile and subscription.</p>
      </div>

      <div className="card-hover-lift animate-fade-in-up delay-1 glass-panel" style={{ padding: "28px", marginBottom: "20px" }}>
        <p style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: textMuted, marginBottom: "20px" }}>👤 Profile</p>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <div className="animate-pulse-glow" style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "800", color: D ? "#0c0a08" : "#fff", boxShadow: `0 8px 24px ${theme.accent1}44` }}>
            {(userData?.name || userData?.email || "U")[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "18px", fontWeight: "800", color: textPrimary, fontFamily: "var(--font-display)", marginBottom: "4px" }}>{userData?.name || "Premium User"}</p>
            <p style={{ fontSize: "13px", color: textSecondary }}>{userData?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="btn-glass" style={{ width: "100%", padding: "14px", fontSize: "14px", fontWeight: "600", color: textMuted, borderRadius: "16px" }}>
          🚪 Sign Out
        </button>
      </div>

      <div className="card-hover-lift animate-fade-in-up delay-2 glass-panel" style={{ padding: "28px", marginBottom: "20px", position: "relative", overflow: "hidden" }}>
        {isPro && <div className="animate-pulse" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "150px", background: `linear-gradient(90deg, transparent, rgba(201,169,110,0.1))`, pointerEvents: "none" }} />}
        
        <p style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: textMuted, marginBottom: "20px" }}>📊 Subscription</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <p style={{ fontSize: "24px", fontWeight: "900", fontFamily: "var(--font-display)", color: isPro ? theme.accent1 : textPrimary, marginBottom: "4px" }}>
              {isPro ? "✦ Spider Pro" : "Free Plan"}
            </p>
            <p style={{ fontSize: "13px", color: textSecondary }}>
              {isPro ? `Active: ${userData?.plan === "monthly" ? "₹99/month" : "Lifetime Access"}` : "1 AI generation per day"}
            </p>
          </div>
          {isPro ? (
            <span className="animate-pulse-glow" style={{ padding: "6px 14px", borderRadius: "99px", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, fontSize: "11px", fontWeight: "800", color: D ? "#0c0a08" : "#fff", boxShadow: `0 4px 12px ${theme.accent1}40` }}>ACTIVE</span>
          ) : (
            <span style={{ padding: "6px 14px", borderRadius: "99px", background: D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", fontSize: "11px", fontWeight: "800", color: textMuted }}>FREE</span>
          )}
        </div>

        {!isPro && (
          <div className="liquid-glass" style={{ borderRadius: "16px", padding: "16px 20px", marginBottom: "20px", background: D ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", color: textSecondary, fontWeight: "500" }}>Daily AI Usage</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: textPrimary, fontVariantNumeric: "tabular-nums" }}>{userData?.usageCount || 0} / 1</span>
            </div>
            <div style={{ height: "6px", borderRadius: "99px", background: D ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: "99px", width: `${Math.min((userData?.usageCount || 0) * 100, 100)}%`, background: `linear-gradient(90deg, ${theme.accent1}, ${theme.accent2})`, transition: "width 0.5s ease" }} />
            </div>
          </div>
        )}

        {!isPro && (
          <button onClick={() => setPage("upgrade")} className="btn-premium animate-pulse-glow" style={{ width: "100%", padding: "16px", fontSize: "14px", fontWeight: "800", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, color: D ? "#0c0a08" : "#fff", borderRadius: "16px", border: "none" }}>
            ✦ Upgrade to Pro
          </button>
        )}
        
        {isPro && userData?.plan === "monthly" && (
          <p style={{ fontSize: "12px", color: textMuted, textAlign: "center", marginTop: "16px" }}>Need help? Support: support@spiderresumeai.com</p>
        )}
      </div>

      {/* PROMO CODE */}
      {!isPro && (
        <div className="card-hover-lift animate-fade-in-up delay-3 glass-panel" style={{ padding: "24px 28px", marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: textMuted, marginBottom: "16px" }}>🎟️ Have a Promo Code?</p>
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <div style={{ flex: 1, ...(D ? liquidGlassDark : liquidGlass), borderRadius: "16px", padding: "12px 20px", display: "flex", alignItems: "center" }}>
              <input value={promoInput} onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoStatus(null); setPromoMsg(""); }}
                onKeyDown={e => e.key === "Enter" && applyPromo()} placeholder="Enter code here"
                style={{ background: "none", border: "none", outline: "none", fontSize: "14px", fontWeight: "700", letterSpacing: "0.08em", color: textPrimary, width: "100%", fontFamily: "inherit" }} />
            </div>
            <button onClick={applyPromo} disabled={!promoInput.trim()} className="btn-glass"
              style={{ padding: "0 24px", borderRadius: "16px", background: promoInput.trim() ? `linear-gradient(135deg, ${theme.accent1}33, ${theme.accent2}22)` : "transparent", color: promoInput.trim() ? theme.accent1 : textMuted, border: `1px solid ${promoInput.trim() ? theme.accent1 + "66" : D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, fontSize: "14px", fontWeight: "800", cursor: !promoInput.trim() ? "not-allowed" : "pointer", transition: "all 0.3s ease" }}>
              Apply
            </button>
          </div>
          {promoStatus === "success" && (
            <div className="animate-fade-in-down" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "14px", background: D ? "rgba(125,207,160,0.15)" : "rgba(46,125,82,0.1)", border: "1px solid rgba(125,207,160,0.3)" }}>
              <span>✨</span><span style={{ fontSize: "13px", color: D ? "#a0e2bc" : "#2e7d52", fontWeight: "700" }}>{promoMsg}</span>
            </div>
          )}
          {promoStatus === "error" && (
            <div className="animate-fade-in-down" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "14px", background: D ? "rgba(240,128,128,0.15)" : "rgba(176,48,48,0.1)", border: "1px solid rgba(240,128,128,0.3)" }}>
              <span>⚠️</span><span style={{ fontSize: "13px", color: D ? "#ffb3b3" : "#b03030", fontWeight: "600" }}>{promoMsg}</span>
            </div>
          )}
        </div>
      )}

      <div className="card-hover-lift animate-fade-in-up delay-4 glass-panel" style={{ padding: "28px" }}>
        <p style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: textMuted, marginBottom: "20px" }}>ℹ️ Quick Guide</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            ["✏️","Builder","Fill your info, education & skills"],
            ["✨","AI Generate","Auto-write summaries & descriptions"],
            ["🎯","ATS Score","See how recruiters rank your resume"],
            ["👁","Preview","View final design & download PDF"],
            ["✦","Spider Pro","Unlimited AI, premium templates & no ads"]
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "12px", borderRadius: "14px",  background: "transparent" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                {icon === "✦" ? <span style={{ color: theme.accent1 }}>✦</span> : icon}
              </div>
              <div style={{ paddingTop: "2px" }}>
                <p style={{ fontSize: "14px", fontWeight: "700", color: textPrimary, marginBottom: "4px" }}>{title}</p>
                <p style={{ fontSize: "13px", color: textSecondary, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default AccountPage;
