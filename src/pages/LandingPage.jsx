import { useState, useEffect } from "react";
import AdBanner from "../components/AdBanner";
import { LOGO_SRC } from "../constants/themes";

const LandingPage = ({
  theme, D, setScreen, setAuthMode, setIsGuest, legalModal, setLegalModal,
}) => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(true);
    const t = setTimeout(() => setFeaturesVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", width: "100vw", fontFamily: "var(--font-display)", background: "linear-gradient(135deg, #07060b 0%, #120a14 30%, #0c0810 60%, #08060d 100%)", color: "white", overflowX: "hidden", boxSizing: "border-box", position: "relative" }}>
      
      {/* ── ANIMATED AMBIENT BLOBS ── */}
      <div className="ambient-blob" style={{ top: "-120px", left: "-80px", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(201,169,110,0.12) 0%, rgba(180,30,30,0.08) 40%, transparent 70%)" }} />
      <div className="ambient-blob" style={{ bottom: "-100px", right: "-100px", width: "450px", height: "450px", background: "radial-gradient(circle, rgba(120,80,200,0.1) 0%, rgba(60,30,120,0.06) 50%, transparent 70%)", animationDelay: "-7s" }} />
      <div className="ambient-blob" style={{ top: "35%", left: "45%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)", animationDelay: "-14s" }} />

      {/* ── FLOATING PARTICLES ── */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-float-slow" style={{
          position: "fixed", width: `${3 + i}px`, height: `${3 + i}px`, borderRadius: "50%",
          background: `rgba(201,169,110,${0.15 + i * 0.05})`,
          top: `${15 + i * 14}%`, left: `${10 + i * 15}%`,
          animationDelay: `${i * -1.5}s`, pointerEvents: "none", zIndex: 0,
          boxShadow: `0 0 ${8 + i * 4}px rgba(201,169,110,${0.1 + i * 0.03})`,
        }} />
      ))}

      {/* ── NAV ── */}
      <nav className="animate-fade-in-down" style={{
        position: "sticky", top: 0, zIndex: 100, padding: "14px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(8,6,12,0.6)",
        backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)",
        borderBottom: "1px solid rgba(201,169,110,0.08)",
        width: "100%", boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={LOGO_SRC} style={{ height: "42px", mixBlendMode: "screen", filter: "drop-shadow(0 0 12px rgba(201,169,110,0.3))" }} alt="Spider" />
          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a96e, #e8c88a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SPIDER AI</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={() => { setAuthMode("login"); setScreen("login"); }}
            className="btn-glass" style={{ padding: "9px 22px", fontSize: "13px", color: "rgba(240,230,215,0.85)", borderColor: "rgba(201,169,110,0.2)" }}>
            Log In
          </button>
          <button onClick={() => { setAuthMode("signup"); setScreen("login"); }}
            className="btn-premium" style={{ padding: "9px 22px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #c9a96e, #e8c88a, #dab878)", color: "#0c0a08", fontSize: "13px", fontWeight: "800", boxShadow: "0 4px 20px rgba(201,169,110,0.25)" }}>
            Get Started Free
          </button>
          <button onClick={() => { setIsGuest(true); setScreen("app"); }}
            style={{ padding: "9px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(200,180,155,0.45)", cursor: "pointer", fontSize: "12px", fontWeight: "500", transition: "all 0.3s ease" }}>
            👁 Preview
          </button>
        </div>
      </nav>

      {/* ── SPIDER HERO BG ── */}
      <div className="animate-breathe" style={{ position: "fixed", right: "-40px", bottom: "-20px", width: "55vw", height: "55vw", maxWidth: "650px", maxHeight: "650px", backgroundImage: "url(/spider_hero.png)", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "bottom right", opacity: 0.08, pointerEvents: "none", zIndex: 0, mixBlendMode: "screen", filter: "drop-shadow(0 0 80px rgba(201,169,110,0.15))" }} />

      {/* ── HERO SECTION ── */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "100px 28px 80px", textAlign: "center", position: "relative", zIndex: 1 }}>
        
        {/* AI Badge */}
        <div className="animate-fade-in-scale delay-1" style={{
          display: "inline-flex", alignItems: "center", gap: "10px", padding: "7px 20px",
          borderRadius: "999px",
          background: "rgba(201,169,110,0.08)",
          border: "1px solid rgba(201,169,110,0.2)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          marginBottom: "36px",
          opacity: heroVisible ? 1 : 0, transition: "opacity 0.8s ease 0.2s",
        }}>
          <span style={{ fontSize: "14px" }}>✨</span>
          <span style={{ fontSize: "13px", fontWeight: "600", letterSpacing: "0.02em", background: "linear-gradient(135deg, #e8c88a, #c9a96e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Powered by AI — Free to start</span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up delay-2" style={{
          fontSize: "clamp(40px, 9vw, 72px)", fontWeight: "900", letterSpacing: "-3px", lineHeight: 1.0, marginBottom: "24px",
          fontFamily: "var(--font-display)",
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s",
        }}>
          Build a resume that<br />
          <span className="animate-gradient" style={{
            background: "linear-gradient(135deg, #c9a96e, #e8c88a, #f0d8a8, #c9a96e)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 8px rgba(201,169,110,0.2))",
          }}>gets you hired.</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up delay-3" style={{
          fontSize: "18px", color: "rgba(200,180,155,0.55)", marginBottom: "48px", lineHeight: 1.7,
          maxWidth: "560px", margin: "0 auto 48px",
          fontFamily: "var(--font-body)", fontWeight: "400",
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease 0.5s",
        }}>
          Spider AI writes your resume summary, improves descriptions, and checks ATS compatibility — in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-4" style={{
          display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease 0.6s",
        }}>
          <button onClick={() => { setAuthMode("signup"); setScreen("login"); }}
            className="btn-premium animate-pulse-glow"
            style={{ padding: "18px 40px", borderRadius: "18px", border: "none", background: "linear-gradient(135deg, #c9a96e, #e8c88a, #dab878)", color: "#0c0a08", fontSize: "17px", fontWeight: "800", letterSpacing: "-0.3px", boxShadow: "0 8px 40px rgba(201,169,110,0.3), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
            🕷️ Start Building for Free
          </button>
          <button onClick={() => { setAuthMode("login"); setScreen("login"); }}
            className="btn-glass"
            style={{ padding: "18px 40px", fontSize: "17px", color: "rgba(240,230,215,0.7)", borderColor: "rgba(201,169,110,0.15)" }}>
            Sign In →
          </button>
        </div>

        {/* Trust indicators */}
        <div className="animate-fade-in delay-6" style={{
          marginTop: "48px", display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap",
          opacity: heroVisible ? 1 : 0, transition: "opacity 1s ease 1s",
        }}>
          {["10K+ resumes built", "AI-powered writing", "ATS optimized"].map(t => (
            <span key={t} style={{ fontSize: "12px", fontWeight: "600", color: "rgba(180,160,135,0.35)", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(201,169,110,0.5)" }} /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 28px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "80px" }}>
          {[
            ["✨", "AI Resume Writer", "AI rewrites your experience into professional, impactful descriptions", "#c9a96e"],
            ["🎯", "ATS Checker", "See exactly how automated screening systems will rate your resume", "#7dcfa0"],
            ["📄", "Pro Templates", "Modern, Minimal, Bold — designs that recruiters actually prefer", "#78a0f0"],
            ["⬇️", "PDF Download", "Clean, print-ready resume exported in one tap", "#e8a06e"],
          ].map(([icon, title, desc, accentColor], idx) => (
            <div key={title} className="card-hover-lift animate-glass-reveal"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "24px", padding: "28px 24px",
                animationDelay: `${0.1 + idx * 0.1}s`,
                position: "relative", overflow: "hidden",
              }}>
              {/* Accent glow */}
              <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "80px", height: "80px", borderRadius: "50%", background: `radial-gradient(circle, ${accentColor}15, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ fontSize: "32px", marginBottom: "16px", filter: `drop-shadow(0 4px 12px ${accentColor}33)` }}>{icon}</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "rgba(240,230,215,0.92)", marginBottom: "10px", fontFamily: "var(--font-display)", letterSpacing: "-0.3px" }}>{title}</div>
              <div style={{ fontSize: "13px", color: "rgba(180,160,135,0.5)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>{desc}</div>
            </div>
          ))}
        </div>

        <AdBanner isDark={true} />

        {/* ── HOW IT WORKS ── */}
        <h2 className="animate-fade-in-up" style={{
          fontSize: "32px", fontWeight: "800", textAlign: "center", marginBottom: "40px",
          color: "rgba(240,230,215,0.92)", fontFamily: "var(--font-display)", letterSpacing: "-1px",
        }}>How it works</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "80px", position: "relative" }}>
          {/* Connecting line */}
          <div style={{ position: "absolute", left: "28px", top: "30px", bottom: "30px", width: "2px", background: "linear-gradient(to bottom, rgba(201,169,110,0.3), rgba(201,169,110,0.05))", borderRadius: "99px" }} />
          {[
            ["1", "Create your free account", "Sign up with Google or email in 10 seconds"],
            ["2", "Fill in your details", "Add experience, education, skills — or import an existing resume"],
            ["3", "Generate with AI", "One click — AI writes your summary and polishes descriptions"],
            ["4", "Check ATS score", "See exactly how recruiters' systems will rate you"],
            ["5", "Download PDF", "Print-ready, professionally formatted resume"],
          ].map(([num, title, desc], idx) => (
            <div key={num} className="animate-fade-in-up card-hover-lift"
              style={{
                display: "flex", alignItems: "flex-start", gap: "18px",
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "20px", padding: "20px 24px",
                animationDelay: `${idx * 0.1}s`,
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}>
              <div className="animate-float" style={{
                minWidth: "40px", height: "40px", borderRadius: "50%",
                background: "linear-gradient(135deg, #c9a96e, #e8c88a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "900", fontSize: "15px", color: "#0c0a08",
                boxShadow: "0 4px 16px rgba(201,169,110,0.25)",
                animationDelay: `${idx * 0.3}s`, animationDuration: "5s",
                flexShrink: 0,
              }}>{num}</div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "rgba(240,230,215,0.9)", marginBottom: "4px", fontFamily: "var(--font-display)" }}>{title}</div>
                <div style={{ fontSize: "13px", color: "rgba(180,160,135,0.5)", lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <AdBanner isDark={true} />

        {/* ── PRICING ── */}
        <h2 className="animate-fade-in-up" style={{
          fontSize: "32px", fontWeight: "800", textAlign: "center", marginBottom: "12px",
          color: "rgba(240,230,215,0.92)", fontFamily: "var(--font-display)", letterSpacing: "-1px",
        }}>Simple, transparent pricing</h2>
        <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(180,160,135,0.4)", marginBottom: "40px" }}>Start free. Upgrade when you're ready.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "80px", maxWidth: "600px", margin: "0 auto 80px" }}>
          {[
            { plan: "Free", price: "₹0", period: "forever", features: ["1 AI generate/day", "Classic template", "ATS checker", "PDF download"], cta: "Start Free", pro: false },
            { plan: "Pro", price: "₹99", period: "/month", features: ["Unlimited AI generates", "All 4 templates", "Priority AI models", "Remove all ads", "Early access features"], cta: "Go Pro ✦", pro: true },
          ].map(({ plan, price, period, features, cta, pro }) => (
            <div key={plan} className="card-hover-lift"
              style={{
                background: pro ? "rgba(201,169,110,0.06)" : "rgba(255,255,255,0.02)",
                backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                border: `1px solid ${pro ? "rgba(201,169,110,0.25)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: "24px", padding: "32px 24px",
                position: "relative", overflow: "hidden",
              }}>
              {pro && <div className="animate-shimmer" style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: "24px" }} />}
              <div style={{ fontSize: "12px", fontWeight: "800", color: pro ? "#e8c88a" : "rgba(200,180,155,0.5)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.12em" }}>{plan}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
                <span style={{ fontSize: "40px", fontWeight: "900", color: pro ? "#e8c88a" : "rgba(240,230,215,0.9)", fontFamily: "var(--font-display)", letterSpacing: "-2px" }}>{price}</span>
                <span style={{ fontSize: "13px", color: "rgba(180,160,135,0.4)" }}>{period}</span>
              </div>
              <div style={{ marginTop: "24px", marginBottom: "24px" }}>
                {features.map(f => (
                  <div key={f} style={{ fontSize: "13px", color: "rgba(200,180,155,0.6)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: pro ? "#c9a96e" : "rgba(200,180,155,0.4)" }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button onClick={() => { setAuthMode("signup"); setScreen("login"); }}
                className={pro ? "btn-premium" : "btn-glass"}
                style={{
                  width: "100%", padding: "14px", borderRadius: "14px", border: "none", fontSize: "14px", fontWeight: "700",
                  background: pro ? "linear-gradient(135deg, #c9a96e, #e8c88a)" : "rgba(255,255,255,0.06)",
                  color: pro ? "#0c0a08" : "rgba(240,230,215,0.7)",
                  boxShadow: pro ? "0 4px 20px rgba(201,169,110,0.2)" : "none",
                }}>
                {cta}
              </button>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div style={{ textAlign: "center", color: "rgba(180,160,135,0.3)", fontSize: "12px", paddingBottom: "50px", fontFamily: "var(--font-body)" }}>
          <div style={{ width: "40px", height: "2px", background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)", margin: "0 auto 24px", borderRadius: "99px" }} />
          <p style={{ marginBottom: "8px" }}>🕷️ Spider Resume AI — Built with Groq & Gemini AI</p>
          <p>© 2026 ·{" "}
            <span onClick={() => setScreen("about")} style={{ cursor: "pointer", color: "rgba(201,169,110,0.4)", transition: "color 0.2s" }}>About</span>
            {" · "}
            <span onClick={() => setScreen("privacy")} style={{ cursor: "pointer", color: "rgba(201,169,110,0.4)", transition: "color 0.2s" }}>Privacy</span>
            {" · "}
            <span onClick={() => setScreen("terms")} style={{ cursor: "pointer", color: "rgba(201,169,110,0.4)", transition: "color 0.2s" }}>Terms</span>
            {" · "}
            <a href="mailto:contact@spiderresume.com" style={{ color: "rgba(201,169,110,0.4)", textDecoration: "none", transition: "color 0.2s" }}>Contact</a>
          </p>
        </div>
      </div>

      {/* ── LEGAL MODALS ── */}
      {legalModal && (
        <div onClick={() => setLegalModal(null)} className="animate-fade-in" style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", boxSizing: "border-box" }}>
          <div onClick={e => e.stopPropagation()} className="animate-fade-in-scale" style={{ width: "100%", maxWidth: "600px", maxHeight: "80vh", background: "rgba(16,12,22,0.95)", backdropFilter: "blur(40px)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: "28px", padding: "36px 30px", overflowY: "auto", position: "relative" }}>
            <button onClick={() => setLegalModal(null)} style={{ position: "absolute", top: "18px", right: "18px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", color: "rgba(240,230,215,0.6)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>✕</button>
            <div style={{ color: "rgba(200,180,155,0.7)", lineHeight: 1.7 }}>
              <h2 style={{ fontSize: "24px", fontWeight: "800", color: "rgba(240,230,215,0.95)", marginBottom: "6px", fontFamily: "var(--font-display)" }}>{legalModal === "privacy" ? "Privacy Policy" : "Terms of Service"}</h2>
              <p style={{ fontSize: "11px", color: "rgba(180,160,135,0.4)", marginBottom: "28px" }}>Last updated: March 2026</p>
              <p style={{ fontSize: "13px", lineHeight: 1.8 }}>
                {legalModal === "privacy" 
                  ? "We collect your name, email, and resume content to provide the Spider Resume AI service. Data is stored securely in Google Firestore. AI processing is transient. Payments are handled by Razorpay — we never store card details. You can request data deletion at any time by contacting support@spiderresumeai.com."
                  : "By using Spider Resume AI, you agree to these terms. Free users get 1 AI generation per day. Pro users get unlimited access. All payments are final. You're responsible for verifying AI-generated content. We make no guarantees regarding job placement. Contact support@spiderresumeai.com for questions."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
