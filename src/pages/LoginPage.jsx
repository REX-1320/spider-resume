import { LOGO_SRC } from "../constants/themes";

const LoginPage = ({
  authMode, setAuthMode, authEmail, setAuthEmail, authPassword, setAuthPassword,
  authError, setAuthError, authBusy, loginGoogle, loginEmail, setScreen,
}) => (
  <div style={{ minHeight: "100vh", width: "100vw", fontFamily: "var(--font-display)", background: "linear-gradient(135deg, #07060b 0%, #120a14 30%, #0c0810 60%, #08060d 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
    
    {/* Ambient glow */}
    <div className="ambient-blob" style={{ top: "-100px", left: "-100px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(201,169,110,0.1), transparent 70%)" }} />
    <div className="ambient-blob" style={{ bottom: "-80px", right: "-80px", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(120,80,200,0.08), transparent 70%)", animationDelay: "-8s" }} />
    
    <div className="animate-fade-in-scale" style={{ width: "100%", maxWidth: "400px", position: "relative", zIndex: 1 }}>
      <div className="animate-fade-in-down" style={{ textAlign: "center", marginBottom: "36px" }}>
        <img src={LOGO_SRC} className="animate-float" style={{ height: "70px", mixBlendMode: "screen", marginBottom: "12px", filter: "drop-shadow(0 0 20px rgba(201,169,110,0.25))", animationDuration: "5s" }} alt="Spider" />
        <p style={{ color: "rgba(200,180,155,0.5)", fontSize: "15px", fontWeight: "500" }}>{authMode === "login" ? "Welcome back" : "Create your free account"}</p>
      </div>

      <div className="animate-glass-reveal" style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)",
        border: "1px solid rgba(201,169,110,0.12)",
        borderRadius: "28px", padding: "32px 28px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>
        {/* Google Login */}
        <button onClick={loginGoogle} disabled={authBusy}
          className="btn-glass"
          style={{ width: "100%", padding: "14px", borderRadius: "16px", fontSize: "14px", fontWeight: "600", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "rgba(240,230,215,0.85)", borderColor: "rgba(201,169,110,0.15)" }}>
          <span style={{ fontSize: "20px", fontWeight: "700" }}>G</span> Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent)" }} />
          <span style={{ fontSize: "11px", color: "rgba(180,160,135,0.35)", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent)" }} />
        </div>

        <input type="email" placeholder="Email address" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
          className="input-glass"
          style={{ marginBottom: "12px", color: "rgba(240,230,215,0.9)" }} />
        <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && loginEmail()}
          className="input-glass"
          style={{ marginBottom: "18px", color: "rgba(240,230,215,0.9)" }} />

        {authError && (
          <div className="animate-fade-in-scale" style={{ padding: "10px 14px", borderRadius: "12px", background: "rgba(240,80,80,0.08)", border: "1px solid rgba(240,80,80,0.15)", marginBottom: "14px" }}>
            <p style={{ fontSize: "12px", color: "#f08080", textAlign: "center", margin: 0 }}>{authError}</p>
          </div>
        )}

        <button onClick={loginEmail} disabled={authBusy}
          className="btn-premium"
          style={{ width: "100%", padding: "15px", borderRadius: "16px", border: "none", background: "linear-gradient(135deg, #c9a96e, #e8c88a, #dab878)", color: "#0c0a08", fontSize: "15px", fontWeight: "800", marginBottom: "20px", boxShadow: "0 4px 24px rgba(201,169,110,0.25)" }}>
          {authBusy ? "Please wait..." : authMode === "login" ? "Log In" : "Create Account"}
        </button>

        <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(180,160,135,0.5)" }}>
          {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError(""); }} style={{ color: "#e8c88a", cursor: "pointer", fontWeight: "700", transition: "opacity 0.2s" }}>
            {authMode === "login" ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>

      <p onClick={() => setScreen("landing")} className="animate-fade-in delay-4" style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "rgba(180,160,135,0.3)", cursor: "pointer", transition: "color 0.2s" }}>← Back to home</p>
    </div>
  </div>
);

export default LoginPage;
