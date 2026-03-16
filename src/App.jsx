import { useState, useEffect, useMemo } from "react";
import { auth, db, googleProvider } from "./firebase";
import {
  signInWithPopup, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "firebase/auth";
import {
  doc, getDoc, setDoc, updateDoc, increment
} from "firebase/firestore";

// Constants
import {
  LIGHT_THEMES_FREE, DARK_THEMES_FREE, LIGHT_THEMES_PRO, DARK_THEMES_PRO,
  FREE_TEMPLATES, PRO_TEMPLATES, LOGO_SRC, DESKTOP_STYLE, PRINT_STYLE,
} from "./constants/themes";

// AI
import { createAIService } from "./ai/aiService";

// Components
import LoadingScreen from "./components/LoadingScreen";
import AdBanner from "./components/AdBanner";

// Pages (existing)
import PrivacyPolicy from "./PrivacyPolicy";
import Terms from "./Terms";
import About from "./About";
import ChatPage from "./pages/ChatPage";
import TemplatesPage from "./pages/TemplatesPage";
import JobsPage from "./pages/JobsPage";
import CoverPage from "./pages/CoverPage";
import InterviewPage from "./pages/InterviewPage";
import TrackerPage from "./pages/TrackerPage";
import LinkedInPage from "./pages/LinkedInPage";

// Pages (new — extracted from App)
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import BuilderPage from "./pages/BuilderPage";
import PreviewPage from "./pages/PreviewPage";
import ScorePage from "./pages/ScorePage";
import AccountPage from "./pages/AccountPage";
import UpgradePage from "./pages/UpgradePage";

export default function SpiderResumeAI() {
  const [isDark, setIsDark] = useState(false);
  const [themeId, setThemeId] = useState(() => {
    const allIds = [
      "sunset","lavender","ocean","rose","mint","peach","arctic","sand","cherry","sage",
      "ember","violet","midnight","crimson","forest","royal","obsidian","aurora","dusk","neon"
    ];
    return allIds[Math.floor(Math.random() * allIds.length)];
  });
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [screen, setScreen] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [page, setPage] = useState("builder");
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState("Classic");
  const [appliedTemplateHtml, setAppliedTemplateHtml] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", linkedin: "", summary: "", education: [{ degree: "", school: "", year: "" }], experience: [{ role: "", company: "", duration: "", desc: "" }], skills: "", photo: "" });
  const [aiGenerated, setAiGenerated] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [legalModal, setLegalModal] = useState(null);

  // File import state
  const [fileImporting, setFileImporting] = useState(false);
  const [fileImportDone, setFileImportDone] = useState(false);
  const [fileImportError, setFileImportError] = useState("");

  // Sidebar state
  const [menuOpen, setMenuOpen] = useState(false);

  // Themes — always include pro themes so the object resolves; picker gates selection
  const allThemes = [...LIGHT_THEMES_FREE, ...DARK_THEMES_FREE, ...LIGHT_THEMES_PRO, ...DARK_THEMES_PRO];
  const theme = allThemes.find(t => t.id === themeId) || allThemes[0];
  const D = isDark;

  // API keys
  const geminiKey = import.meta.env.VITE_GEMINI_KEY || "";
  const groqKey  = import.meta.env.VITE_GROQ_KEY   || "";
  const groqKey2 = import.meta.env.VITE_GROQ_KEY_2 || "";
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "";

  // AI service
  const aiService = useMemo(() => createAIService({ groqKey, groqKey2, geminiKey }), [groqKey, groqKey2, geminiKey]);
  const { callAI, callVisionAI } = aiService;

  // Sync body background
  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.minHeight = "100vh";
    document.body.style.margin = "0";
    document.body.style.overflowX = "hidden";
  }, [theme.bg]);

  // Close theme menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeMenuOpen && !e.target.closest('[data-theme-menu]')) setThemeMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [themeMenuOpen]);

  // Auth listener
  useEffect(() => {
    if (!auth) { setAuthLoading(false); return; }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) { await loadUserData(u.uid, u.email, u.displayName); setScreen("app"); }
      else setScreen("landing");
    });
    return unsub;
  }, []);

  // Derived styles
  const textPrimary = D ? "rgba(240,230,215,0.95)" : "rgba(10,8,20,0.88)";
  const textSecondary = D ? "rgba(200,180,155,0.65)" : "rgba(40,30,50,0.55)";
  const textMuted = D ? "rgba(180,160,135,0.45)" : "rgba(80,60,90,0.4)";
  // True liquid glass — pure transparency with a distinct glossy surface reflection
  const glassBase = {
    background: D 
      ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)" 
      : "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 100%)",
    backdropFilter: "blur(40px) saturate(180%) brightness(1.1)",
    WebkitBackdropFilter: "blur(40px) saturate(180%) brightness(1.1)",
    border: "1px solid transparent",
    borderTopColor: D ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.6)",
    borderLeftColor: D ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)",
    borderRightColor: D ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)",
    borderBottomColor: D ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)",
    boxShadow: D 
      ? "0 16px 48px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.15)" 
      : "0 16px 48px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.5)"
  };
  const glassCard = { ...glassBase, borderRadius: "24px" };
  const glassInput = { 
    ...glassBase, 
    borderRadius: "14px", padding: "11px 16px", fontSize: "14px", 
    color: textPrimary, width: "100%", outline: "none", 
    background: D ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.06)",
    boxShadow: D ? "inset 0 4px 16px rgba(0,0,0,0.5)" : "inset 0 4px 16px rgba(0,0,0,0.12)",
    borderTopColor: D ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
    borderLeftColor: D ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.15)",
    borderRightColor: D ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.3)",
    borderBottomColor: D ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)"
  };
  const glassBtn = { 
    ...glassBase, 
    borderRadius: "100px", cursor: "pointer", fontWeight: "600", fontSize: "14px", 
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)", 
    background: D 
      ? "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)" 
      : "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 100%)"
  };

  // ── Business Logic ──

  const loadUserData = async (uid, email, name) => {
    if (!db) return;
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    const today = new Date().toDateString();
    if (!snap.exists()) {
      const newUser = { email, name: name || email, isPro: false, usageDate: today, usageCount: 0, createdAt: new Date().toISOString() };
      await setDoc(ref, newUser);
      setUserData(newUser); setIsPro(false);
    } else {
      const data = snap.data();
      if (data.usageDate !== today) { await updateDoc(ref, { usageDate: today, usageCount: 0 }); data.usageDate = today; data.usageCount = 0; }
      setUserData(data); setIsPro(data.isPro || false);
    }
  };

  const incrementUsage = async () => {
    if (!user || isGuest || !db) return;
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, { usageCount: increment(1) });
    setUserData(p => ({ ...p, usageCount: (p?.usageCount || 0) + 1 }));
  };

  const canGenerate = () => isGuest ? false : (isPro || (userData?.usageCount || 0) < 1);

  const generateAI = async () => {
    if (!canGenerate()) { setPage("upgrade"); return; }
    setLoading(true);
    try {
      const raw = await callAI("Generate a professional resume summary and improve job descriptions. Return ONLY JSON: {\"summary\":\"...\",\"experience\":[\"desc1\",\"desc2\"]}. No markdown.\nPerson: " + JSON.stringify(form));
      const parsed = JSON.parse(raw);
      setForm(p => ({ ...p, summary: parsed.summary || p.summary, experience: p.experience.map((exp, i) => ({ ...exp, desc: parsed.experience?.[i] || exp.desc })) }));
      await incrementUsage();
      setAiGenerated(true);
    } catch (e) { alert("Failed: " + e.message); }
    setLoading(false);
  };

  const analyzeResume = async () => {
    if (!canGenerate()) { setPage("upgrade"); return; }
    setScoreLoading(true); setScoreData(null);
    try {
      const raw = await callAI("Analyze this resume. Return ONLY valid JSON: {\"overallScore\":85,\"atsScore\":80,\"contentScore\":85,\"formatScore\":90,\"atsChecks\":[{\"label\":\"Contact info present\",\"pass\":true},{\"label\":\"Work experience included\",\"pass\":true},{\"label\":\"Education section filled\",\"pass\":true},{\"label\":\"Skills keywords present\",\"pass\":true},{\"label\":\"Professional summary written\",\"pass\":true},{\"label\":\"No special characters\",\"pass\":true},{\"label\":\"Dates formatted consistently\",\"pass\":true},{\"label\":\"LinkedIn included\",\"pass\":false}],\"tips\":[\"tip1\",\"tip2\",\"tip3\",\"tip4\"],\"strengths\":[\"s1\",\"s2\"],\"verdict\":\"verdict here\"}. Use real values. Resume: " + JSON.stringify(form));
      const parsed = JSON.parse(raw);
      setScoreData(parsed); setPage("score");
    } catch (e) { alert("Failed: " + e.message); }
    setScoreLoading(false);
  };

  const openRazorpay = (plan) => {
    if (!window.Razorpay) { alert("Payment system is loading. Please try again in a moment."); return; }
    if (!user) { alert("Please log in to purchase Pro."); setScreen("login"); return; }
    const options = {
      key: RAZORPAY_KEY, amount: plan === "monthly" ? 9900 : 49900, currency: "INR",
      name: "Spider Resume AI", description: plan === "monthly" ? "Pro Monthly" : "Pro Lifetime", image: LOGO_SRC,
      handler: async (response) => {
        if (user) {
          const ref = doc(db, "users", user.uid);
          await updateDoc(ref, { isPro: true, plan, razorpayPaymentId: response.razorpay_payment_id, subscribedAt: new Date().toISOString() });
          setIsPro(true); setUserData(p => ({ ...p, isPro: true, plan })); setPage("builder");
          alert("🎉 Welcome to Pro! All features unlocked.");
        }
      },
      prefill: { name: userData?.name || "", email: userData?.email || "" },
      theme: { color: "#c9a96e" },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => { alert("Payment failed: " + (response.error.description || "Please try again")); });
    rzp.open();
  };

  // Auth functions
  const loginGoogle = async () => {
    setAuthBusy(true); setAuthError("");
    try { await signInWithPopup(auth, googleProvider); } catch (e) { setAuthError(e.message); }
    setAuthBusy(false);
  };
  const loginEmail = async () => {
    setAuthBusy(true); setAuthError("");
    try {
      if (authMode === "login") await signInWithEmailAndPassword(auth, authEmail, authPassword);
      else await createUserWithEmailAndPassword(auth, authEmail, authPassword);
    } catch (e) { setAuthError(e.message.replace("Firebase: ", "").replace(/\(auth.*\)/, "")); }
    setAuthBusy(false);
  };
  const logout = async () => { await signOut(auth); setScreen("landing"); setUserData(null); setIsPro(false); };

  // File import handler
  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileImporting(true); setFileImportDone(false); setFileImportError("");
    try {
      const isPDF = file.type === "application/pdf";
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (isPDF) { res(ev.target.result.split(",")[1]); return; }
          const img = new Image();
          img.onload = () => {
            const MAX = 1600; let { width, height } = img;
            if (width > MAX || height > MAX) {
              if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
              else { width = Math.round(width * MAX / height); height = MAX; }
            }
            const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
            canvas.getContext("2d").drawImage(img, 0, 0, width, height);
            res(canvas.toDataURL("image/jpeg", 0.92).split(",")[1]);
          };
          img.onerror = rej; img.src = ev.target.result;
        };
        reader.onerror = rej; reader.readAsDataURL(file);
      });
      const extractPrompt = `You are a professional resume parser. Look at this resume ${isPDF ? "document" : "image"} carefully and extract ALL information you can see.\n\nReturn ONLY a raw JSON object. No markdown. No code blocks. No explanation. Just JSON starting with { and ending with }.\n\n{\n  "name": "full name",\n  "email": "email or empty string",\n  "phone": "phone or empty string",\n  "location": "city country or empty string",\n  "linkedin": "linkedin URL or empty string",\n  "summary": "write a strong 2-3 sentence professional summary from their experience",\n  "skills": "skill1, skill2, skill3 (comma separated, include ALL skills tools languages)",\n  "education": [{"degree": "degree and field", "school": "school name", "year": "year"}],\n  "experience": [{"role": "job title", "company": "company name", "duration": "dates", "desc": "2-3 sentence description"}]\n}\n\nExtract EVERY detail visible. Include ALL jobs in experience array. Include ALL degrees in education. Generate summary if not present.`;
      const mimeType = isPDF ? "application/pdf" : "image/jpeg";
      const rawText = await callVisionAI(base64, mimeType, extractPrompt);
      if (!rawText || rawText.trim().length < 20) throw new Error("AI returned empty response — check your Gemini API key in Vercel settings.");
      let jsonText = rawText.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      const jsonStart = jsonText.indexOf("{"); const jsonEnd = jsonText.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) throw new Error("AI did not return valid JSON — please try again.");
      jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonText);
      setForm(p => ({
        name: parsed.name || p.name, email: parsed.email || p.email, phone: parsed.phone || p.phone,
        location: parsed.location || p.location, linkedin: parsed.linkedin || p.linkedin,
        summary: parsed.summary || p.summary, skills: parsed.skills || p.skills, photo: p.photo,
        education: Array.isArray(parsed.education) && parsed.education.length ? parsed.education : p.education,
        experience: Array.isArray(parsed.experience) && parsed.experience.length ? parsed.experience : p.experience,
      }));
      setFileImportDone(true);
    } catch (err) {
      const msg = err.message || "";
      if (!geminiKey || msg.includes("VITE_GEMINI")) setFileImportError("❌ Gemini API key missing — add VITE_GEMINI_KEY in Vercel settings.");
      else if (msg.includes("401") || msg.includes("403") || msg.includes("API key not valid")) setFileImportError("❌ Invalid Gemini API key — check VITE_GEMINI_KEY in Vercel settings.");
      else if (msg.includes("429") || msg.includes("quota") || msg.includes("rate") || msg.includes("RESOURCE_EXHAUSTED")) setFileImportError("❌ Rate limit — wait 30 seconds and try again.");
      else if (msg.includes("JSON") || msg.includes("parse") || msg.includes("Unexpected token")) setFileImportError("❌ Could not parse resume — try a clearer image or text-based PDF.");
      else if (msg.includes("empty response")) setFileImportError("❌ " + msg);
      else setFileImportError(`❌ ${msg || "Upload failed — try again."}`);
    }
    setFileImporting(false); e.target.value = "";
  };

  const allTemplates = [...FREE_TEMPLATES, ...PRO_TEMPLATES];

  // Shared props
  const styleProps = { glassCard, glassBase, glassBtn, glassInput, textPrimary, textSecondary, textMuted, theme, D };
  const pageProps = { ...styleProps, theme, D };

  // ─── LOADING SCREEN ───
  if (authLoading) return <LoadingScreen />;

  // ─── LEGAL PAGES ───
  if (screen === "privacy") return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
      <PrivacyPolicy onBack={() => setScreen("landing")} {...pageProps} />
    </div>
  );
  if (screen === "terms") return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
      <Terms onBack={() => setScreen("landing")} {...pageProps} />
    </div>
  );
  if (screen === "about") return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>
      <About onBack={() => setScreen("landing")} {...pageProps} />
    </div>
  );

  // ─── LANDING PAGE ───
  if (screen === "landing") return (
    <LandingPage theme={theme} D={D} setScreen={setScreen} setAuthMode={setAuthMode} setIsGuest={setIsGuest} legalModal={legalModal} setLegalModal={setLegalModal} />
  );

  // ─── LOGIN PAGE ───
  if (screen === "login") return (
    <LoginPage authMode={authMode} setAuthMode={setAuthMode} authEmail={authEmail} setAuthEmail={setAuthEmail}
      authPassword={authPassword} setAuthPassword={setAuthPassword} authError={authError} setAuthError={setAuthError}
      authBusy={authBusy} loginGoogle={loginGoogle} loginEmail={loginEmail} setScreen={setScreen} />
  );
  // ─── MAIN APP ───
  
  const navItems = [
    { key: "builder",   icon: "✏️",  label: "Build" },
    { key: "chat",      icon: "🤖",  label: "AI Chat" },
    { key: "templates", icon: "🎨",  label: "Templates" },
    { key: "jobs",      icon: "🎯",  label: "Jobs" },
    { key: "cover",     icon: "📝",  label: "Cover Letter" },
    { key: "interview", icon: "🎤",  label: "Interview" },
    { key: "tracker",   icon: "📊",  label: "Tracker" },
    { key: "linkedin",  icon: "💼",  label: "LinkedIn" },
    { key: "preview",   icon: "👁",  label: "Preview" },
    { key: "score",     icon: "🔍",  label: "ATS Score" },
    { key: "account",   icon: "👤",  label: "Account" },
  ];

  const handleNavClick = (key) => { setPage(key); setMenuOpen(false); };

  return (
    <div style={{ fontFamily: "var(--font-body)", background: theme.bg, position: "relative", overflow: "hidden", minHeight: "100vh", width: "100vw", boxSizing: "border-box", transition: "background 0.8s ease" }}>
      
      {/* Spider watermark — blended into bg */}
      <div className="animate-breathe" style={{
        position: "fixed", right: "-20px", bottom: "-20px",
        width: "60vw", height: "60vw", maxWidth: "800px", maxHeight: "800px",
        backgroundImage: "url(/spider_hero.png)", backgroundSize: "contain",
        backgroundRepeat: "no-repeat", backgroundPosition: "bottom right",
        opacity: D ? 0.12 : 0.08, pointerEvents: "none", zIndex: 0,
        mixBlendMode: "soft-light",
        filter: `drop-shadow(0 0 80px ${theme.accent1}30) brightness(${D ? 1.2 : 0.9})`,
      }} />
      
      {/* Animated ambient blobs */}
      {[
        ["fixed","top","-80px","left","-80px","420px",theme.blob1],
        ["fixed","bottom","-60px","right","-60px","360px",theme.blob2],
        ["fixed","top","35%","left","55%","280px",theme.blob3]
      ].map(([pos,v1,v1v,v2,v2v,size,color],i) => (
        <div key={i} className="ambient-blob" style={{ position: pos, [v1]: v1v, [v2]: v2v, width: size, height: size, background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, animationDelay: `${i * -7}s` }} />
      ))}

      {/* ── FLOATING TOP BAR ── */}
      <div className="animate-fade-in-down" style={{
        position: "fixed", top: "12px", left: "12px", right: "12px", zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", borderRadius: "20px",
        background: D ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.12)",
        backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)",
        border: `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.35)"}`,
        boxShadow: D ? "0 8px 40px rgba(0,0,0,0.3)" : "0 8px 40px rgba(0,0,0,0.06)",
      }}>
        {/* Left: Menu button + Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => setMenuOpen(o => !o)} style={{
            width: "40px", height: "40px", borderRadius: "14px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: menuOpen ? (D ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.4)") : (D ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.2)"),
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${D ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.4)"}`,
            transition: "all 0.3s var(--ease-spring)",
            fontSize: "18px", color: textPrimary,
          }}>
            {menuOpen ? "✕" : "☰"}
          </button>
          <img src={LOGO_SRC} alt="Spider" onError={e => { e.target.style.display = "none"; }}
            style={{ height: "34px", width: "auto", objectFit: "contain", mixBlendMode: D ? "screen" : "multiply", filter: D ? `drop-shadow(0 0 12px ${theme.accent1}40)` : `drop-shadow(0 2px 6px rgba(0,0,0,0.1))` }} />
          {isPro && <span className="badge-pro" style={{ color: D ? "#0c0a08" : "#fff", fontSize: "9px" }}>PRO</span>}
        </div>

        {/* Right: Current page indicator + dark toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Current page capsule */}
          <div style={{
            padding: "6px 16px", borderRadius: "100px",
            background: D ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.25)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${D ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.45)"}`,
            fontSize: "12px", fontWeight: "600", color: textSecondary,
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <span>{navItems.find(n => n.key === page)?.icon}</span>
            <span className="hide-mobile">{navItems.find(n => n.key === page)?.label}</span>
          </div>

          {/* Dark/Light toggle */}
          <button onClick={() => setIsDark(d => !d)} style={{
            width: "38px", height: "38px", borderRadius: "14px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
            background: D ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.25)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${D ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)"}`,
            transition: "all 0.3s var(--ease-spring)", color: textPrimary,
          }}>
            {D ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* ── SIDEBAR OVERLAY (click outside to close) ── */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} className="animate-fade-in" style={{
          position: "fixed", inset: 0, zIndex: 250,
          background: D ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.15)",
          backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        }} />
      )}

      {/* ── VERTICAL SLIDE-IN SIDEBAR ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 300,
        width: "260px",
        transform: menuOpen ? "translateX(0)" : "translateX(-110%)",
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        display: "flex", flexDirection: "column",
        padding: "24px 16px",
        background: D ? "rgba(15,10,25,0.7)" : "rgba(255,255,255,0.2)",
        backdropFilter: "blur(60px) saturate(200%)", WebkitBackdropFilter: "blur(60px) saturate(200%)",
        borderRight: `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.4)"}`,
        boxShadow: D ? "8px 0 60px rgba(0,0,0,0.5)" : "8px 0 60px rgba(0,0,0,0.08)",
      }}>
        {/* Sidebar header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", paddingLeft: "8px" }}>
          <img src={LOGO_SRC} alt="Spider" onError={e => { e.target.style.display = "none"; }}
            style={{ height: "32px", mixBlendMode: D ? "screen" : "multiply", filter: D ? `drop-shadow(0 0 10px ${theme.accent1}40)` : "none" }} />
          <button onClick={() => setMenuOpen(false)} style={{
            marginLeft: "auto", width: "32px", height: "32px", borderRadius: "10px",
            background: D ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.25)",
            border: `1px solid ${D ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.35)"}`,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", color: textMuted, transition: "all 0.2s",
          }}>✕</button>
        </div>

        {/* Nav items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, overflowY: "auto" }}>
          {navItems.map(({ key, icon, label }) => {
            const active = page === key;
            return (
              <button key={key} onClick={() => handleNavClick(key)}
                className="sidebar-nav-item"
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 16px", borderRadius: "16px",
                  fontSize: "14px", fontWeight: active ? "700" : "500",
                  fontFamily: "var(--font-body)", cursor: "pointer",
                  textAlign: "left", width: "100%",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  border: active
                    ? `1px solid ${D ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)"}`
                    : "1px solid transparent",
                  background: active
                    ? (D ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.45)")
                    : "transparent",
                  backdropFilter: active ? "blur(24px) saturate(200%)" : "none",
                  WebkitBackdropFilter: active ? "blur(24px) saturate(200%)" : "none",
                  color: active ? textPrimary : textSecondary,
                  boxShadow: active
                    ? (D ? "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" : "0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)")
                    : "none",
                }}>
                <span style={{ fontSize: "18px", width: "24px", textAlign: "center" }}>{icon}</span>
                <span>{label}</span>
                {active && <span style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, boxShadow: `0 0 10px ${theme.accent1}` }} />}
              </button>
            );
          })}
        </div>

        {/* Sidebar footer */}
        <div style={{ borderTop: `1px solid ${D ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.3)"}`, paddingTop: "16px", marginTop: "12px" }}>
          {!isPro && (
            <button onClick={() => handleNavClick("upgrade")} style={{
              width: "100%", padding: "14px", borderRadius: "16px",
              fontSize: "14px", fontWeight: "800", cursor: "pointer",
              background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`,
              color: D ? "#0c0a08" : "#fff", border: "none",
              boxShadow: `0 4px 20px ${theme.accent1}40`,
              fontFamily: "var(--font-body)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "all 0.3s var(--ease-spring)",
            }}>
              ✦ Upgrade to Pro
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", padding: "0 4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: theme.accent1, boxShadow: `0 0 8px ${theme.accent1}`, animation: "pulseGlowing 2s infinite" }} />
            <span style={{ fontSize: "11px", color: textMuted, fontWeight: "500" }}>
              {isGuest ? "Guest Mode" : isPro ? "Pro Plan ✦" : `${Math.max(0, 1 - (userData?.usageCount || 0))} AI generate left`}
            </span>
          </div>
        </div>
      </div>

      {/* ── PAGE CONTENT ── */}
      <div className="animate-fade-in" style={{ paddingTop: "76px", minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {page === "builder" && (
          <BuilderPage form={form} setForm={setForm} template={template} setTemplate={setTemplate}
            allTemplates={allTemplates} {...styleProps} isPro={isPro} page={page} setPage={setPage}
            loading={loading} generateAI={generateAI} aiGenerated={aiGenerated}
            scoreLoading={scoreLoading} analyzeResume={analyzeResume} canGenerate={canGenerate} callAI={callAI}
            fileImporting={fileImporting} fileImportDone={fileImportDone} fileImportError={fileImportError} handleFileImport={handleFileImport} />
        )}
        {page === "preview" && (
          <PreviewPage form={form} appliedTemplateHtml={appliedTemplateHtml} setAppliedTemplateHtml={setAppliedTemplateHtml}
            {...styleProps} isPro={isPro} setPage={setPage} />
        )}
        {page === "score" && (
          <ScorePage scoreData={scoreData} scoreLoading={scoreLoading} analyzeResume={analyzeResume} setPage={setPage} {...styleProps} />
        )}
        {page === "account" && (
          <AccountPage userData={userData} isPro={isPro} setIsPro={setIsPro} setUserData={setUserData}
            user={user} db={db} logout={logout} setPage={setPage} setScreen={setScreen} {...styleProps} />
        )}
        {page === "chat" && (
          <ChatPage callAI={callAI} setForm={setForm} setPage={setPage} {...styleProps} />
        )}
        {page === "templates" && (
          <TemplatesPage callAI={callAI} form={form} setForm={setForm} setTemplate={setTemplate} setPage={setPage}
            setAppliedTemplateHtml={setAppliedTemplateHtml} {...styleProps} isPro={isPro} />
        )}
        {page === "jobs" && <JobsPage callAI={callAI} form={form} {...styleProps} />}
        {page === "cover" && <CoverPage callAI={callAI} form={form} {...styleProps} />}
        {page === "interview" && <InterviewPage callAI={callAI} form={form} {...styleProps} />}
        {page === "tracker" && <TrackerPage {...styleProps} />}
        {page === "linkedin" && <LinkedInPage callAI={callAI} form={form} {...styleProps} />}
        {page === "upgrade" && <UpgradePage openRazorpay={openRazorpay} setPage={setPage} {...styleProps} />}
      </div>

      {!isPro && <AdBanner isDark={D} />}
    </div>
  );
}