import { useState, useEffect } from "react";
import { auth, db, googleProvider } from "./firebase";
import {
  signInWithPopup, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "firebase/auth";
import {
  doc, getDoc, setDoc, updateDoc, increment
} from "firebase/firestore";
import PrivacyPolicy from "./PrivacyPolicy";
import Terms from "./Terms";
import About from "./About";
import AIExtras from "./components/AIExtras";
import DownloadResume from "./components/DownloadResume";
import ChatPage from "./pages/ChatPage";
import TemplatesPage from "./pages/TemplatesPage";
import JobsPage from "./pages/JobsPage";
import CoverPage from "./pages/CoverPage";
import InterviewPage from "./pages/InterviewPage";
import TrackerPage from "./pages/TrackerPage";
import LinkedInPage from "./pages/LinkedInPage";
const DESKTOP_STYLE = `
@media (min-width: 860px) {
  .desktop-preview { display: block !important; }
}
@media (max-width: 859px) {
  .desktop-grid { grid-template-columns: 1fr !important; }
}
`;

const PRINT_STYLE = `@media print {
  body * { visibility: hidden !important; }
  #resume-printable, #resume-printable * { visibility: visible !important; }
  #resume-printable { position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; padding: 32px 40px !important; background: white !important; box-shadow: none !important; border: none !important; z-index: 99999 !important; }
  #resume-printable h1 { color: #1a1612 !important; font-size: 22px !important; }
  #resume-printable h2 { color: #666 !important; font-size: 9px !important; }
  #resume-printable p, #resume-printable span { color: #333 !important; }
}`;

const FREE_TEMPLATES = ["Classic"];
const PRO_TEMPLATES = ["Modern", "Minimal", "Bold"];
const LOGO_SRC = "/logo.png";

// Free themes (available to all users)
const LIGHT_THEMES_FREE = [
  // ── 10 FREE LIGHT THEMES ──
  { id: "sunset",    name: "Sunset",    bg: "linear-gradient(135deg, #f0e0d0 0%, #e8d0c0 25%, #ddd0c8 50%, #d0d8e0 75%, #dcd0e0 100%)", accent1: "#c9845e", accent2: "#e8a878", blob1: "rgba(255,180,120,0.35)", blob2: "rgba(180,200,255,0.28)", blob3: "rgba(200,240,210,0.22)" },
  { id: "lavender",  name: "Lavender",  bg: "linear-gradient(135deg, #e4dcf5 0%, #d8ccec 25%, #dcd8ec 50%, #d0d4f0 75%, #dcd8f0 100%)", accent1: "#8a5ec9", accent2: "#aa80e8", blob1: "rgba(180,130,255,0.35)", blob2: "rgba(140,170,255,0.28)", blob3: "rgba(210,185,255,0.22)" },
  { id: "ocean",     name: "Ocean",     bg: "linear-gradient(135deg, #cceaf5 0%, #b8dced 25%, #a8d4e0 50%, #9ac4e8 75%, #80ccea 100%)", accent1: "#4090b0", accent2: "#60b8d8", blob1: "rgba(100,200,230,0.35)", blob2: "rgba(100,160,220,0.28)", blob3: "rgba(80,190,210,0.22)" },
  { id: "rose",      name: "Rose",      bg: "linear-gradient(135deg, #faeaec 0%, #f0dade 25%, #eeccd8 50%, #f5dce8 75%, #f0dce4 100%)", accent1: "#c85070", accent2: "#e87090", blob1: "rgba(230,160,180,0.35)", blob2: "rgba(210,140,170,0.28)", blob3: "rgba(240,180,200,0.22)" },
  { id: "mint",      name: "Mint",      bg: "linear-gradient(135deg, #daf5ea 0%, #ccecdc 25%, #c0e8d0 50%, #ccecd8 75%, #d4f0e2 100%)", accent1: "#3a9e6e", accent2: "#58c48e", blob1: "rgba(120,210,170,0.35)", blob2: "rgba(100,195,155,0.28)", blob3: "rgba(130,215,180,0.22)" },
  { id: "peach",     name: "Peach",     bg: "linear-gradient(135deg, #fff4e8 0%, #ffeada 25%, #ffdec8 50%, #ffead4 75%, #fff4e2 100%)", accent1: "#d47840", accent2: "#f09858", blob1: "rgba(255,185,130,0.35)", blob2: "rgba(255,165,105,0.28)", blob3: "rgba(255,175,120,0.22)" },
  { id: "arctic",    name: "Arctic",    bg: "linear-gradient(135deg, #e4f4fc 0%, #d4ecf8 25%, #c8e8f8 50%, #cce8fc 75%, #d8f0fc 100%)", accent1: "#3878b8", accent2: "#58a0dc", blob1: "rgba(100,180,240,0.35)", blob2: "rgba(80,160,220,0.28)", blob3: "rgba(90,170,230,0.22)" },
  { id: "sand",      name: "Sand",      bg: "linear-gradient(135deg, #f8f0dc 0%, #f0e4c8 25%, #eadcbc 50%, #f0e0c4 75%, #f5eacc 100%)", accent1: "#a07828", accent2: "#c09840", blob1: "rgba(200,160,80,0.35)", blob2: "rgba(180,140,60,0.28)", blob3: "rgba(190,150,70,0.22)" },
  { id: "cherry",    name: "Cherry",    bg: "linear-gradient(135deg, #fce8f0 0%, #f8d8e8 25%, #f4cce0 50%, #f8d8ec 75%, #fce4f4 100%)", accent1: "#c03060", accent2: "#e05080", blob1: "rgba(220,100,140,0.35)", blob2: "rgba(200,80,120,0.28)", blob3: "rgba(230,110,150,0.22)" },
  { id: "sage",      name: "Sage",      bg: "linear-gradient(135deg, #e4ede4 0%, #d8e4d8 25%, #ccdccc 50%, #d4e0d4 75%, #dce8dc 100%)", accent1: "#4e7a4e", accent2: "#6a9e6a", blob1: "rgba(120,170,120,0.35)", blob2: "rgba(100,155,100,0.28)", blob3: "rgba(110,162,110,0.22)" },
];
const DARK_THEMES_FREE = [
  // ── 10 FREE DARK THEMES ──
  { id: "ember",     name: "Ember",     bg: "linear-gradient(135deg, #1e1608 0%, #261c0c 25%, #1c2010 50%, #181a20 75%, #1e181e 100%)", accent1: "#d4a050", accent2: "#f0c060", blob1: "rgba(210,160,80,0.2)",  blob2: "rgba(90,120,200,0.14)", blob3: "rgba(90,170,130,0.12)" },
  { id: "violet",    name: "Violet",    bg: "linear-gradient(135deg, #160c28 0%, #180c24 25%, #140e24 50%, #100c24 75%, #12101e 100%)", accent1: "#9a5cd4", accent2: "#bc80f0", blob1: "rgba(155,90,210,0.22)", blob2: "rgba(100,120,210,0.16)", blob3: "rgba(170,125,210,0.14)" },
  { id: "midnight",  name: "Midnight",  bg: "linear-gradient(135deg, #080e1e 0%, #0c1226 25%, #080e1c 50%, #060c18 75%, #080c18 100%)", accent1: "#5880d4", accent2: "#78a0f0", blob1: "rgba(88,128,210,0.2)",  blob2: "rgba(120,140,230,0.16)", blob3: "rgba(80,110,185,0.14)" },
  { id: "crimson",   name: "Crimson",   bg: "linear-gradient(135deg, #200810 0%, #240c14 25%, #1c0810 50%, #220a12 75%, #1e0c12 100%)", accent1: "#d44060", accent2: "#f06080", blob1: "rgba(210,64,96,0.2)",  blob2: "rgba(240,96,128,0.16)", blob3: "rgba(185,55,85,0.14)" },
  { id: "forest",    name: "Forest",    bg: "linear-gradient(135deg, #081408 0%, #0c1a0a 25%, #0a140a 50%, #0a180a 75%, #08140a 100%)", accent1: "#50c850", accent2: "#72e872", blob1: "rgba(80,200,80,0.2)",  blob2: "rgba(115,235,115,0.16)", blob3: "rgba(70,185,70,0.14)" },
  { id: "royal",     name: "Royal",     bg: "linear-gradient(135deg, #080c1e 0%, #0a1028 25%, #080c1c 50%, #0a1020 75%, #080e1c 100%)", accent1: "#40b0d0", accent2: "#60d4f0", blob1: "rgba(64,176,208,0.2)", blob2: "rgba(96,210,240,0.16)", blob3: "rgba(55,165,195,0.14)" },
  { id: "obsidian",  name: "Obsidian",  bg: "linear-gradient(135deg, #101010 0%, #141414 25%, #121212 50%, #0e0e10 75%, #101012 100%)", accent1: "#a0a0c0", accent2: "#c0c0e0", blob1: "rgba(160,160,200,0.18)", blob2: "rgba(140,140,180,0.14)", blob3: "rgba(150,150,190,0.12)" },
  { id: "aurora",    name: "Aurora",    bg: "linear-gradient(135deg, #080e18 0%, #0c1420 25%, #081418 50%, #081018 75%, #0a1018 100%)", accent1: "#40d8a0", accent2: "#60f0c0", blob1: "rgba(64,216,160,0.2)", blob2: "rgba(80,180,200,0.16)", blob3: "rgba(50,200,140,0.14)" },
  { id: "dusk",      name: "Dusk",      bg: "linear-gradient(135deg, #1a100c 0%, #201610 25%, #1c1210 50%, #1e1410 75%, #1a1210 100%)", accent1: "#e08040", accent2: "#f0a060", blob1: "rgba(224,128,64,0.2)", blob2: "rgba(240,160,96,0.16)", blob3: "rgba(210,115,52,0.14)" },
  { id: "neon",      name: "Neon",      bg: "linear-gradient(135deg, #050510 0%, #08080e 25%, #060610 50%, #08060e 75%, #06060e 100%)", accent1: "#e040e0", accent2: "#f060f0", blob1: "rgba(224,64,224,0.22)", blob2: "rgba(64,200,240,0.18)", blob3: "rgba(200,50,200,0.16)" },
];

const LIGHT_THEMES_PRO = [];
const DARK_THEMES_PRO  = [];

const liquidGlass = {
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(20px) saturate(200%) brightness(1.05)",
  WebkitBackdropFilter: "blur(20px) saturate(200%) brightness(1.05)",
  border: "1px solid rgba(255,255,255,0.55)",
  boxShadow: "0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.03)",
};
const liquidGlassDark = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
};
const LabelCapsule = ({ label, isDark, textMuted }) => (
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
const GInput = ({ inputStyle, style, isDark, label, textMuted, ...props }) => (
  <div style={{ width: "100%", boxSizing: "border-box", marginBottom: "10px" }}>
    {label && <LabelCapsule label={label} isDark={isDark} textMuted={textMuted} />}
    <input style={{ ...inputStyle, ...(isDark ? liquidGlassDark : liquidGlass), borderRadius: "12px", padding: "10px 14px", width: "100%", boxSizing: "border-box", ...style }} {...props} />
  </div>
);
const GTextarea = ({ inputStyle, style, isDark, label, textMuted, ...props }) => (
  <div style={{ width: "100%", boxSizing: "border-box", marginBottom: "10px" }}>
    {label && <LabelCapsule label={label} isDark={isDark} textMuted={textMuted} />}
    <textarea style={{ ...inputStyle, ...(isDark ? liquidGlassDark : liquidGlass), borderRadius: "12px", padding: "10px 14px", resize: "none", width: "100%", boxSizing: "border-box", ...style }} {...props} />
  </div>
);
const GSection = ({ glassCard, textMuted, title, children, action }) => (
  <div style={{ ...glassCard, padding: "18px", marginBottom: "14px", overflow: "hidden", boxSizing: "border-box" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
      <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted }}>{title}</span>
      {action}
    </div>
    <div style={{ width: "100%", boxSizing: "border-box" }}>{children}</div>
  </div>
);

const AdBanner = ({ isDark }) => {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }, []);
  return (
    <div style={{
      ...(isDark
        ? { background: "rgba(255,255,255,0.06)", backdropFilter: "blur(28px) saturate(180%)", WebkitBackdropFilter: "blur(28px) saturate(180%)", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)" }
        : { background: "rgba(255,255,255,0.22)", backdropFilter: "blur(30px) saturate(200%)", WebkitBackdropFilter: "blur(30px) saturate(200%)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)" }),
      borderRadius: "20px", padding: "12px 16px", margin: "10px 0", overflow: "hidden",
    }}>
      <p style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.35, color: isDark ? "rgba(240,230,215,0.6)" : "rgba(100,80,60,0.5)", marginBottom: "8px" }}>Sponsored</p>
      <ins className="adsbygoogle"
        style={{ display: "inline-block", width: "300px", height: "250px" }}
        data-ad-client="ca-pub-4908276514558540"
        data-ad-slot="5062281330"
      />
    </div>
  );
};

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
  const [appliedTemplateHtml, setAppliedTemplateHtml] = useState(null); // null = use default preview
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", linkedin: "", summary: "", education: [{ degree: "", school: "", year: "" }], experience: [{ role: "", company: "", duration: "", desc: "" }], skills: "", photo: "" });
  const [aiGenerated, setAiGenerated] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [legalModal, setLegalModal] = useState(null);
  // All themes always visible — dark mode is independent toggle
  const allThemes = [...LIGHT_THEMES_FREE, ...DARK_THEMES_FREE, ...(isPro ? [...LIGHT_THEMES_PRO, ...DARK_THEMES_PRO] : [])];
  const availableThemes = allThemes;

  const theme = allThemes.find(t => t.id === themeId) || allThemes[0];
  const D = isDark;

  // Sync body background only — dark/light button is fully manual
  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.minHeight = "100vh";
    document.body.style.margin = "0";
    document.body.style.overflowX = "hidden";
  }, [theme.bg]);

  // Close theme menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeMenuOpen && !e.target.closest('[data-theme-menu]')) {
        setThemeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [themeMenuOpen]);

  const textPrimary = D ? "rgba(240,230,215,0.95)" : "#1a1612";
  const textSecondary = D ? "rgba(200,180,155,0.65)" : "rgba(100,80,60,0.6)";
  const textMuted = D ? "rgba(180,160,135,0.45)" : "rgba(150,120,100,0.5)";
  const glassBase = D
    ? { background: "rgba(255,255,255,0.06)", backdropFilter: "blur(28px) saturate(180%)", WebkitBackdropFilter: "blur(28px) saturate(180%)", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)" }
    : { background: "rgba(255,255,255,0.22)", backdropFilter: "blur(30px) saturate(200%)", WebkitBackdropFilter: "blur(30px) saturate(200%)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.04)" };
  const glassCard = { ...glassBase, borderRadius: "20px" };
  const glassInput = { ...glassBase, borderRadius: "10px", padding: "9px 14px", fontSize: "13px", color: textPrimary, width: "100%", outline: "none", background: D ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.35)" };
  const glassBtn = { ...glassBase, borderRadius: "14px", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "all 0.2s ease", background: D ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.25)" };

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const updateEdu = (i, f, v) => { const a = [...form.education]; a[i][f] = v; setForm(p => ({ ...p, education: a })); };
  const updateExp = (i, f, v) => { const a = [...form.experience]; a[i][f] = v; setForm(p => ({ ...p, experience: a })); };

  // ── KEYS — edit these directly ──
  const geminiKey = import.meta.env.VITE_GEMINI_KEY || "";
  const groqKey = import.meta.env.VITE_GROQ_KEY || "";
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "";


  // Fix global layout
  useEffect(() => {
    const ds = document.createElement("style"); ds.innerHTML = DESKTOP_STYLE; document.head.appendChild(ds);
    // Force full viewport background
    document.documentElement.style.background = "inherit";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.minHeight = "100vh";
    document.body.style.width = "100vw";
    document.body.style.overflowX = "hidden";
    const style = document.createElement("style");
    style.innerHTML = PRINT_STYLE;
    style.id = "spider-print-style";
    document.head.appendChild(style);
    return () => document.getElementById("spider-print-style")?.remove();
  }, []);

  // Auth listener
  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth not initialized");
      setAuthLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) {
        await loadUserData(u.uid, u.email, u.displayName);
        setScreen("app");
      } else {
        setScreen("landing");
      }
    });
    return unsub;
  }, []);

  // Load or create user doc in Firestore
  const loadUserData = async (uid, email, name) => {
    if (!db) { console.error("Firestore not initialized"); return; }
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    const today = new Date().toDateString();
    if (!snap.exists()) {
      const newUser = { email, name: name || email, isPro: false, usageDate: today, usageCount: 0, createdAt: new Date().toISOString() };
      await setDoc(ref, newUser);
      setUserData(newUser);
      setIsPro(false);
    } else {
      const data = snap.data();
      // Reset daily usage if new day
      if (data.usageDate !== today) {
        await updateDoc(ref, { usageDate: today, usageCount: 0 });
        data.usageDate = today;
        data.usageCount = 0;
      }
      setUserData(data);
      setIsPro(data.isPro || false);
    }
  };

  const incrementUsage = async () => {
    if (!user || isGuest || !db) return;
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, { usageCount: increment(1) });
    setUserData(p => ({ ...p, usageCount: (p?.usageCount || 0) + 1 }));
  };

  const canGenerate = () => isGuest ? false : (isPro || (userData?.usageCount || 0) < 1);

  // AI call via Groq
  // ── Groq: fast text AI (primary for all text calls) ─────────────────────
  const callGroq = async (prompt) => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + groqKey },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", max_tokens: 2048, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content.replace(/```json|```/g, "").trim();
  };

  // ── Gemini: vision AI (for image/PDF resume import) ───────────────────
  const callGemini = async (prompt) => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
        }),
      }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
  };

  // ── callAI: uses Groq with Gemini as fallback ─────────────────────────
  const callAI = async (prompt) => {
    if (groqKey) {
      try { return await callGroq(prompt); }
      catch (e) {
        console.warn("Groq failed, falling back to Gemini:", e.message);
        if (geminiKey) return await callGemini(prompt);
        throw e;
      }
    }
    if (geminiKey) return await callGemini(prompt);
    throw new Error("No AI API key configured. Add VITE_GROQ_KEY or VITE_GEMINI_KEY.");
  };

  // ── callVisionAI: always uses Gemini (vision/image support) ──────────
  const callVisionAI = async (base64, mimeType, prompt) => {
    if (!geminiKey) throw new Error("Gemini key required for image/PDF reading. Add VITE_GEMINI_KEY.");
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType, data: base64 } },
              { text: prompt }
            ]
          }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.2 },
        }),
      }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/```json|```/g, "").trim() || "";
  };

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
    
    setScoreLoading(true);
    setScoreData(null);
    try {
      const raw = await callAI("Analyze this resume. Return ONLY valid JSON: {\"overallScore\":85,\"atsScore\":80,\"contentScore\":85,\"formatScore\":90,\"atsChecks\":[{\"label\":\"Contact info present\",\"pass\":true},{\"label\":\"Work experience included\",\"pass\":true},{\"label\":\"Education section filled\",\"pass\":true},{\"label\":\"Skills keywords present\",\"pass\":true},{\"label\":\"Professional summary written\",\"pass\":true},{\"label\":\"No special characters\",\"pass\":true},{\"label\":\"Dates formatted consistently\",\"pass\":true},{\"label\":\"LinkedIn included\",\"pass\":false}],\"tips\":[\"tip1\",\"tip2\",\"tip3\",\"tip4\"],\"strengths\":[\"s1\",\"s2\"],\"verdict\":\"verdict here\"}. Use real values. Resume: " + JSON.stringify(form));
      const parsed = JSON.parse(raw);
      setScoreData(parsed);
      setPage("score");
    } catch (e) { alert("Failed: " + e.message); }
    setScoreLoading(false);
  };

  // Razorpay payment
  const openRazorpay = (plan) => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      alert("Payment system is loading. Please try again in a moment.");
      console.error("Razorpay SDK not loaded");
      return;
    }
    // Check if user is logged in
    if (!user) {
      alert("Please log in to purchase Pro.");
      setScreen("login");
      return;
    }
    const options = {
      key: RAZORPAY_KEY,
      amount: plan === "monthly" ? 9900 : 49900, // in paise
      currency: "INR",
      name: "Spider Resume AI",
      description: plan === "monthly" ? "Pro Monthly" : "Pro Lifetime",
      image: LOGO_SRC,
      handler: async (response) => {
        // Payment success - update Firestore
        if (user) {
          const ref = doc(db, "users", user.uid);
          await updateDoc(ref, {
            isPro: true,
            plan: plan,
            razorpayPaymentId: response.razorpay_payment_id,
            subscribedAt: new Date().toISOString(),
          });
          setIsPro(true);
          setUserData(p => ({ ...p, isPro: true, plan }));
          setPage("builder");
          alert("🎉 Welcome to Pro! All features unlocked.");
        }
      },
      prefill: { name: userData?.name || "", email: userData?.email || "" },
      theme: { color: "#c9a96e" },
    };
    const rzp = new window.Razorpay(options);

    // Add error handling
    rzp.on('payment.failed', function (response) {
      alert("Payment failed: " + (response.error.description || "Please try again"));
      console.error("Payment failed:", response.error);
    });

    rzp.open();
  };

  // Auth functions
  const loginGoogle = async () => {
    setAuthBusy(true); setAuthError("");
    try { await signInWithPopup(auth, googleProvider); }
    catch (e) { setAuthError(e.message); }
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

  const allTemplates = [...FREE_TEMPLATES, ...PRO_TEMPLATES];

  // File import state
  const [fileImporting, setFileImporting] = useState(false);
  const [fileImportDone, setFileImportDone] = useState(false);
  const [fileImportError, setFileImportError] = useState("");

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileImporting(true);
    setFileImportDone(false);
    setFileImportError("");
    try {
      const isPDF = file.type === "application/pdf";
      const mediaType = file.type || "image/jpeg";

      // Compress images before sending — large images exceed Groq token limits
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (isPDF) {
            // PDFs sent as-is (already base64)
            res(ev.target.result.split(",")[1]);
            return;
          }
          // Compress image using canvas — max 1024px, quality 0.7
          const img = new Image();
          img.onload = () => {
            const MAX = 1600;  // Higher resolution for better OCR
            let { width, height } = img;
            if (width > MAX || height > MAX) {
              if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
              else { width = Math.round(width * MAX / height); height = MAX; }
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.92); // Higher quality
            res(compressed.split(",")[1]);
          };
          img.onerror = rej;
          img.src = ev.target.result;
        };
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      const extractPrompt = `Parse this resume ${isPDF ? "PDF" : "image"} and return ONLY valid JSON, no markdown, no explanation:
{"name":"","email":"","phone":"","location":"","linkedin":"","summary":"write a 2-sentence professional summary","skills":"skill1,skill2,skill3","education":[{"degree":"","school":"","year":""}],"experience":[{"role":"","company":"","duration":"","desc":"2-3 sentence description of responsibilities and achievements"}]}
Extract every visible detail. If a field is missing write empty string. Generate summary from their experience if not present.`;

      // Always use Gemini for vision (image/PDF) — Groq has no vision support
      const mimeType = isPDF ? "application/pdf" : "image/jpeg";
      const rawText = await callVisionAI(base64, mimeType, extractPrompt);

      // Robust JSON extraction — handles various Gemini response formats
      let jsonText = rawText.trim();
      // Strip markdown code fences
      jsonText = jsonText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      // If response contains JSON somewhere, extract it
      const jsonStart = jsonText.indexOf("{");
      const jsonEnd = jsonText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
      }
      if (!jsonText || jsonText.length < 10) throw new Error("AI returned empty response — try a higher quality image.");
      const parsed = JSON.parse(jsonText);

      // Fill form fields — always prefer extracted over empty
      setForm(p => ({
        name:       parsed.name       || p.name,
        email:      parsed.email      || p.email,
        phone:      parsed.phone      || p.phone,
        location:   parsed.location   || p.location,
        linkedin:   parsed.linkedin   || p.linkedin,
        summary:    parsed.summary    || p.summary,
        skills:     parsed.skills     || p.skills,
        education:  Array.isArray(parsed.education)  && parsed.education.length  ? parsed.education  : p.education,
        experience: Array.isArray(parsed.experience) && parsed.experience.length ? parsed.experience : p.experience,
      }));
      setFileImportDone(true);
    } catch (err) {
      console.error("Import error:", err);
      // Show the actual error so user knows what's happening
      const msg = err.message || "";
      if (msg.includes("Gemini key") || msg.includes("VITE_GEMINI")) {
        setFileImportError("❌ Gemini API key missing — add VITE_GEMINI_KEY in Vercel settings.");
      } else if (msg.includes("API key") || msg.includes("401") || msg.includes("403")) {
        setFileImportError("❌ Invalid Gemini API key — check VITE_GEMINI_KEY in Vercel settings.");
      } else if (msg.includes("JSON") || msg.includes("parse") || msg.includes("Unexpected")) {
        setFileImportError("❌ AI couldn't extract resume data — try a clearer image or text-based PDF.");
      } else if (msg.includes("quota") || msg.includes("429") || msg.includes("limit")) {
        setFileImportError("❌ API rate limit hit — wait a minute and try again.");
      } else if (!msg) {
        setFileImportError("❌ Upload failed — check your internet connection and try again.");
      } else {
        setFileImportError(`❌ ${msg}`);
      }
    }
    setFileImporting(false);
    e.target.value = "";
  };

  // Promo codes — add yours here
  const PROMO_CODES = {
    "SPIDER2026": { label: "1 Year Free", months: 12 },
    "LAUNCH50":   { label: "1 Year Free", months: 12 },
    "REXFREE":    { label: "1 Year Free", months: 12 },
  };

  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState(null);
  const [promoMsg, setPromoMsg] = useState("");

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    const promo = PROMO_CODES[code];
    if (!promo) {
      setPromoStatus("error");
      setPromoMsg("Invalid promo code. Try again!");
      return;
    }
    if (!user) {
      setPromoStatus("error");
      setPromoMsg("Please log in first to apply a promo code.");
      return;
    }
    // Check if already used this promo
    if (userData?.usedPromos?.includes(code)) {
      setPromoStatus("error");
      setPromoMsg("You've already used this promo code.");
      return;
    }
    // Apply: set isPro + record promo
    const ref = doc(db, "users", user.uid);
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + promo.months);
    await updateDoc(ref, {
      isPro: true,
      plan: "promo",
      promoCode: code,
      promoExpires: expiresAt.toISOString(),
      usedPromos: [...(userData?.usedPromos || []), code],
    });
    setIsPro(true);
    setUserData(p => ({ ...p, isPro: true, plan: "promo", promoCode: code }));
    setPromoStatus("success");
    setPromoMsg(`🎉 ${promo.label} activated! Enjoy Spider Pro.`);
    setTimeout(() => setPage("builder"), 2000);
  };

  // ─── LOADING SCREEN ───
  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: DARK_THEMES_FREE[0].bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "rgba(240,230,215,0.8)" }}>
        <img src={LOGO_SRC} style={{ height: "80px", mixBlendMode: "screen", marginBottom: "16px" }} alt="Spider" />
        <p style={{ fontSize: "14px", opacity: 0.6 }}>Loading...</p>
      </div>
    </div>
  );

  // ─── LANDING PAGE ───
  const pageProps = { theme, D, glassCard, glassBase, textPrimary, textSecondary, textMuted };

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

  if (screen === "landing") return (
    <div style={{ minHeight: "100vh", width: "100vw", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", background: "linear-gradient(135deg, #0a0a0f 0%, #1a0a0a 50%, #0a0a1a 100%)", color: "white", overflowX: "hidden", boxSizing: "border-box" }}>
      {/* Ambient blobs */}
      {[["top","-100px","left","-100px","400px","rgba(180,30,30,0.15)"],["bottom","-80px","right","-80px","350px","rgba(100,50,200,0.12)"],["top","40%","left","50%","300px","rgba(200,100,50,0.08)"]].map(([v1,v1v,v2,v2v,size,color],i) => (
        <div key={i} style={{ position: "fixed", [v1]: v1v, [v2]: v2v, width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      ))}

      {/* Nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", width: "100%", boxSizing: "border-box" }}>
        <img src={LOGO_SRC} style={{ height: "44px", mixBlendMode: "screen" }} alt="Spider" />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => { setAuthMode("login"); setScreen("login"); }} style={{ padding: "8px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)", color: "rgba(240,230,215,0.9)", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>Log In</button>
          <button onClick={() => { setAuthMode("signup"); setScreen("login"); }} style={{ padding: "8px 20px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #c9a96e, #e8c88a)", color: "#1a1410", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>Get Started Free</button>
          <button onClick={() => { setIsGuest(true); setScreen("app"); }} style={{ padding: "8px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(200,180,155,0.6)", cursor: "pointer", fontSize: "12px" }}>👁 Preview as Guest</button>
        </div>
      </div>

      {/* Spider hero bg */}
      <div style={{ position: "fixed", right: "0", bottom: "0", width: "60vw", height: "60vw", maxWidth: "700px", maxHeight: "700px", backgroundImage: "url(/spider_hero.png)", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "bottom right", opacity: 0.13, pointerEvents: "none", zIndex: 0, mixBlendMode: "screen", filter: "drop-shadow(0 0 60px rgba(180,30,30,0.4))" }} />
      {/* Hero */}
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "80px 24px 60px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 16px", borderRadius: "999px", background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)", marginBottom: "28px" }}>
          <span style={{ fontSize: "12px" }}>✨</span>
          <span style={{ fontSize: "12px", fontStyle: "italic", color: "#e8c88a" }}>Powered by AI — Free to start</span>
        </div>
        <h1 style={{ fontSize: "clamp(36px, 8vw, 64px)", fontWeight: "900", letterSpacing: "-2px", lineHeight: 1.05, marginBottom: "20px" }}>
          Build a resume that<br />
          <span style={{ background: "linear-gradient(135deg, #c9a96e, #e8c88a, #c9a96e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>gets you hired.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "rgba(200,180,155,0.7)", marginBottom: "40px", lineHeight: 1.6 }}>
          Spider AI writes your resume summary, improves your job descriptions, and checks ATS compatibility — in seconds.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => { setAuthMode("signup"); setScreen("login"); }} style={{ padding: "16px 36px", borderRadius: "16px", border: "none", background: "linear-gradient(135deg, #c9a96e, #e8c88a)", color: "#1a1410", cursor: "pointer", fontSize: "16px", fontWeight: "800", boxShadow: "0 8px 32px rgba(201,169,110,0.3)" }}>
            🕷️ Start for Free
          </button>
          <button onClick={() => { setAuthMode("login"); setScreen("login"); }} style={{ padding: "16px 36px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(240,230,215,0.8)", cursor: "pointer", fontSize: "16px", fontWeight: "600" }}>
            Sign In
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px 60px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "60px" }}>
          {[
            ["✨", "AI Resume Writer", "Paste your experience, AI rewrites it professionally"],
            ["🎯", "ATS Checker", "See if your resume passes automated screening"],
            ["📄", "Pro Templates", "Modern, Minimal, Bold designs recruiters love"],
            ["⬇️", "PDF Download", "Clean, print-ready resume in one tap"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px 20px" }}>
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{icon}</div>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "rgba(240,230,215,0.9)", marginBottom: "8px" }}>{title}</div>
              <div style={{ fontSize: "13px", color: "rgba(180,160,135,0.6)", lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Ad — after features */}
        <AdBanner isDark={true} />

        {/* How it works */}
        <h2 style={{ fontSize: "28px", fontWeight: "800", textAlign: "center", marginBottom: "32px", color: "rgba(240,230,215,0.9)" }}>How it works</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "60px" }}>
          {[
            ["1", "Create your free account", "Sign up with Google or Email in 10 seconds"],
            ["2", "Fill in your details", "Add your experience, education and skills"],
            ["3", "Generate with AI", "One click — AI writes your summary and improves descriptions"],
            ["4", "Check ATS score", "See how recruiters' systems rate your resume"],
            ["5", "Download PDF", "Print-ready, clean resume in your hands"],
          ].map(([num, title, desc]) => (
            <div key={num} style={{ display: "flex", alignItems: "flex-start", gap: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "18px 20px" }}>
              <div style={{ minWidth: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #c9a96e, #e8c88a)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", color: "#1a1410" }}>{num}</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "rgba(240,230,215,0.9)", marginBottom: "4px" }}>{title}</div>
                <div style={{ fontSize: "12px", color: "rgba(180,160,135,0.6)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Ad — after how it works */}
        <AdBanner isDark={true} />

        {/* Pricing */}
        <h2 style={{ fontSize: "28px", fontWeight: "800", textAlign: "center", marginBottom: "32px", color: "rgba(240,230,215,0.9)" }}>Simple Pricing</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "60px" }}>
          {[
            { plan: "Free", price: "₹0", period: "forever", features: ["1 AI generate/day", "Classic template", "ATS checker", "PDF download"], cta: "Start Free", pro: false },
            { plan: "Pro", price: "₹99", period: "per month", features: ["Unlimited AI generates", "All 4 templates", "Priority AI", "Remove ads", "Early access"], cta: "Go Pro", pro: true },
          ].map(({ plan, price, period, features, cta, pro }) => (
            <div key={plan} style={{ background: pro ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${pro ? "rgba(201,169,110,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "20px", padding: "24px 20px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: pro ? "#e8c88a" : "rgba(200,180,155,0.6)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{plan}</div>
              <div style={{ fontSize: "32px", fontWeight: "900", color: pro ? "#e8c88a" : "rgba(240,230,215,0.9)", marginBottom: "2px" }}>{price}</div>
              <div style={{ fontSize: "12px", color: "rgba(180,160,135,0.5)", marginBottom: "20px" }}>{period}</div>
              {features.map(f => <div key={f} style={{ fontSize: "12px", color: "rgba(200,180,155,0.7)", marginBottom: "6px" }}>✓ {f}</div>)}
              <button onClick={() => { setAuthMode("signup"); setScreen("login"); }} style={{ width: "100%", marginTop: "20px", padding: "12px", borderRadius: "12px", border: "none", background: pro ? "linear-gradient(135deg, #c9a96e, #e8c88a)" : "rgba(255,255,255,0.08)", color: pro ? "#1a1410" : "rgba(240,230,215,0.8)", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>{cta}</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", color: "rgba(180,160,135,0.4)", fontSize: "12px", paddingBottom: "40px" }}>
          <p>🕷️ Spider Resume AI — Built with Groq & Gemini AI</p>
          <p style={{ marginTop: "6px" }}>© 2026 ·{" "}
            <span onClick={() => setScreen("about")} style={{ cursor: "pointer", textDecoration: "underline", color: "rgba(201,169,110,0.6)" }}>About</span>
            {" · "}
            <span onClick={() => setScreen("privacy")} style={{ cursor: "pointer", textDecoration: "underline", color: "rgba(201,169,110,0.6)" }}>Privacy Policy</span>
            {" · "}
            <span onClick={() => setScreen("terms")} style={{ cursor: "pointer", textDecoration: "underline", color: "rgba(201,169,110,0.6)" }}>Terms of Service</span>
            {" · "}
            <a href="mailto:contact@spiderresume.com" style={{ color: "rgba(201,169,110,0.6)", textDecoration: "underline" }}>Contact</a>
          </p>
        </div>
      </div>

      {/* LEGAL MODALS */}
      {legalModal && (
        <div onClick={() => setLegalModal(null)} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", boxSizing: "border-box" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "600px", maxHeight: "80vh", background: "rgba(20,14,30,0.95)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "24px", padding: "32px 28px", overflowY: "auto", position: "relative" }}>
            <button onClick={() => setLegalModal(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "rgba(240,230,215,0.7)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

            {legalModal === "privacy" && (
              <div style={{ color: "rgba(200,180,155,0.8)", lineHeight: 1.7 }}>
                <h2 style={{ fontSize: "22px", fontWeight: "800", color: "rgba(240,230,215,0.95)", marginBottom: "6px" }}>Privacy Policy</h2>
                <p style={{ fontSize: "11px", color: "rgba(180,160,135,0.5)", marginBottom: "24px" }}>Last updated: March 2026</p>

                {[
                  ["1. Information We Collect", "When you create an account, we collect your name, email address, and profile information provided through Google OAuth or email/password registration. We also collect resume content you enter into the builder, usage data such as number of AI generations per day, subscription status, and payment identifiers from Razorpay (we do not store full card details)."],
                  ["2. How We Use Your Information", "We use your information to provide and improve the Spider Resume AI service, authenticate your identity and manage your account, enforce daily usage limits for free users, process payments and manage Pro subscriptions, and send transactional emails related to your account. We do not sell your personal data to third parties."],
                  ["3. Data Storage", "Your data is stored securely in Google Firestore, a cloud database provided by Google Firebase. Resume content and account information is stored under your unique user ID. We retain your data as long as your account is active. You may request deletion at any time by contacting us."],
                  ["4. AI Processing", "Resume content you submit for AI generation is sent to Groq's API to generate professional summaries and descriptions. This data is processed transiently and is not stored by us beyond your active session. Please refer to Groq's privacy policy for their data handling practices."],
                  ["5. Payments", "Payments are processed by Razorpay. We receive a payment confirmation ID but do not store your card number, CVV, or banking details. Please refer to Razorpay's privacy policy for their practices."],
                  ["6. Cookies & Analytics", "We may use basic analytics to understand site usage patterns. No personally identifiable information is shared with analytics providers. Google AdSense may use cookies to serve relevant advertisements to free-tier users."],
                  ["7. Your Rights", "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at support@spiderresumeai.com. We will respond within 30 days."],
                  ["8. Changes to This Policy", "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the service after changes constitutes acceptance."],
                  ["9. Contact", "For any privacy-related questions, email us at support@spiderresumeai.com."],
                ].map(([heading, body]) => (
                  <div key={heading} style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "rgba(240,230,215,0.9)", marginBottom: "6px" }}>{heading}</h3>
                    <p style={{ fontSize: "13px" }}>{body}</p>
                  </div>
                ))}
              </div>
            )}

            {legalModal === "terms" && (
              <div style={{ color: "rgba(200,180,155,0.8)", lineHeight: 1.7 }}>
                <h2 style={{ fontSize: "22px", fontWeight: "800", color: "rgba(240,230,215,0.95)", marginBottom: "6px" }}>Terms of Service</h2>
                <p style={{ fontSize: "11px", color: "rgba(180,160,135,0.5)", marginBottom: "24px" }}>Last updated: March 2026</p>

                {[
                  ["1. Acceptance of Terms", "By accessing or using Spider Resume AI, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service."],
                  ["2. Description of Service", "Spider Resume AI is an AI-powered resume builder that helps users create professional resumes. The service offers a free tier with 1 AI generation per day, and a Pro tier with unlimited access, premium templates, and no advertisements."],
                  ["3. User Accounts", "You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must be at least 13 years old to use this service. One account per person — creating multiple accounts to circumvent usage limits is prohibited."],
                  ["4. Free & Pro Plans", "Free users receive 1 AI resume generation per day. Pro users receive unlimited generations, all templates, and ad-free experience. Subscriptions are billed monthly (₹99/month) or as a one-time lifetime purchase (₹499). All payments are final and non-refundable unless required by law."],
                  ["5. Acceptable Use", "You agree not to use Spider Resume AI to create false or fraudulent resume content, reverse engineer or copy the application, attempt to bypass usage limits or security measures, use the service for any illegal purpose, or resell or sublicense access to the service."],
                  ["6. AI-Generated Content", "Resume content generated by AI is provided as a starting point. You are responsible for reviewing, verifying, and editing all AI-generated content before submitting it to employers. Spider Resume AI makes no guarantees regarding job placement or interview success."],
                  ["7. Intellectual Property", "Spider Resume AI and its original content, features, and functionality are owned by the developers and are protected by copyright law. Resume content you create remains your own property."],
                  ["8. Advertisements", "Free-tier users may see advertisements served by Google AdSense. Pro users have an ad-free experience. We are not responsible for the content of third-party advertisements."],
                  ["9. Limitation of Liability", "Spider Resume AI is provided on an 'as is' basis. We make no warranties, expressed or implied. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service."],
                  ["10. Termination", "We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time by contacting support@spiderresumeai.com."],
                  ["11. Changes to Terms", "We may update these Terms at any time. Continued use of the service after changes are posted constitutes your acceptance of the revised terms."],
                  ["12. Contact", "For any questions about these Terms, contact us at support@spiderresumeai.com."],
                ].map(([heading, body]) => (
                  <div key={heading} style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "rgba(240,230,215,0.9)", marginBottom: "6px" }}>{heading}</h3>
                    <p style={{ fontSize: "13px" }}>{body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // ─── LOGIN PAGE ───
  if (screen === "login") return (
    <div style={{ minHeight: "100vh", width: "100vw", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", background: "linear-gradient(135deg, #0a0a0f 0%, #1a0a0a 50%, #0a0a1a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img src={LOGO_SRC} style={{ height: "64px", mixBlendMode: "screen", marginBottom: "8px" }} alt="Spider" />
          <p style={{ color: "rgba(200,180,155,0.6)", fontSize: "14px" }}>{authMode === "login" ? "Welcome back" : "Create your free account"}</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "28px 24px" }}>
          {/* Google Login */}
          <button onClick={loginGoogle} disabled={authBusy} style={{ width: "100%", padding: "13px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "rgba(240,230,215,0.9)", cursor: "pointer", fontSize: "14px", fontWeight: "600", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>G</span> Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: "12px", color: "rgba(180,160,135,0.5)" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          </div>

          <input type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
            style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)", color: "rgba(240,230,215,0.9)", fontSize: "13px", outline: "none", marginBottom: "10px", boxSizing: "border-box" }} />
          <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && loginEmail()}
            style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)", color: "rgba(240,230,215,0.9)", fontSize: "13px", outline: "none", marginBottom: "14px", boxSizing: "border-box" }} />

          {authError && <p style={{ fontSize: "12px", color: "#f08080", marginBottom: "12px", textAlign: "center" }}>{authError}</p>}

          <button onClick={loginEmail} disabled={authBusy} style={{ width: "100%", padding: "13px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #c9a96e, #e8c88a)", color: "#1a1410", cursor: "pointer", fontSize: "14px", fontWeight: "700", marginBottom: "16px" }}>
            {authBusy ? "Please wait..." : authMode === "login" ? "Log In" : "Create Account"}
          </button>

          <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(180,160,135,0.6)" }}>
            {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError(""); }} style={{ color: "#e8c88a", cursor: "pointer", fontWeight: "600" }}>
              {authMode === "login" ? "Sign up" : "Log in"}
            </span>
          </p>
        </div>
        <p onClick={() => setScreen("landing")} style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "rgba(180,160,135,0.4)", cursor: "pointer" }}>← Back to home</p>
      </div>
    </div>
  );

  // ─── MAIN APP ───

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", background: theme.bg, position: "relative", overflow: "hidden", paddingBottom: !isPro ? "70px" : "0", display: "flex", flexDirection: "column", minHeight: "100vh", width: "100vw", boxSizing: "border-box" }}>
      <div style={{ position: "fixed", right: "-60px", bottom: "-40px", width: "55vw", height: "55vw", maxWidth: "700px", maxHeight: "700px", backgroundImage: "url(/spider_hero.png)", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "bottom right", opacity: D ? 0.09 : 0.07, pointerEvents: "none", zIndex: 0, mixBlendMode: D ? "screen" : "multiply", filter: D ? "drop-shadow(0 0 40px rgba(180,30,30,0.3))" : "none" }} />
      {[["fixed","top","-80px","left","-80px","320px",theme.blob1],["fixed","bottom","-60px","right","-60px","280px",theme.blob2],["fixed","top","40%","left","60%","200px",theme.blob3]].map(([pos,v1,v1v,v2,v2v,size,color],i) => (
        <div key={i} style={{ position: pos, [v1]: v1v, [v2]: v2v, width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      ))}

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ ...glassBase, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 0, borderLeft: "none", borderRight: "none", borderTop: "none", borderBottom: "none", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <img src={LOGO_SRC} alt="Spider" onError={e => { e.target.style.display = "none"; }} style={{ height: "40px", width: "auto", objectFit: "contain", mixBlendMode: "multiply", filter: D ? "invert(1) drop-shadow(0 0 6px rgba(200,80,80,0.6))" : "drop-shadow(0 1px 4px rgba(80,0,0,0.2))", userSelect: "none" }} />
            {isPro && <span style={{ fontSize: "9px", fontWeight: "800", padding: "2px 6px", borderRadius: "10px", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, color: D ? "#1a1410" : "#fff", flexShrink: 0 }}>PRO</span>}
          </div>
          <div style={{ display: "flex", gap: "3px", alignItems: "center", flexWrap: "nowrap", overflowX: "auto", flexShrink: 1 }}>
            {[
              {key:"builder",icon:"✏️",label:"Build"},
              {key:"chat",icon:"🤖",label:"AI Chat"},
              {key:"templates",icon:"🎨",label:"Templates"},
              {key:"jobs",icon:"🎯",label:"Jobs"},
              {key:"cover",icon:"📝",label:"Cover"},
              {key:"interview",icon:"🎤",label:"Interview"},
              {key:"tracker",icon:"📊",label:"Tracker"},
              {key:"linkedin",icon:"💼",label:"LinkedIn"},
              {key:"preview",icon:"👁",label:"Preview"},
              {key:"score",icon:"🔍",label:"Score"},
              {key:"account",icon:"👤",label:""}
            ].map(({key,icon,label}) => (
              <button key={key} onClick={() => setPage(key)} style={{ ...glassBtn, padding: "5px 8px", fontSize: "11px", color: page === key ? textPrimary : textSecondary, background: page === key ? (D ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.55)") : (D ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)"), whiteSpace: "nowrap", flexShrink: 0 }}>
                {icon}{label ? " " + label : ""}
              </button>
            ))}
            {!isPro && <button onClick={() => setPage("upgrade")} style={{ ...glassBtn, padding: "5px 8px", fontSize: "11px", background: `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`, color: D ? "#1a1410" : "#2d2520", flexShrink: 0 }}>✦</button>}

            <button onClick={() => setIsDark(d => !d)} style={{ ...glassBtn, padding: "5px 8px", fontSize: "14px", color: textSecondary, flexShrink: 0 }}>{D ? "☀️" : "🌙"}</button>
          </div>
        </div>
        <div style={{ ...glassBase, borderRadius: 0, borderLeft: "none", borderRight: "none", borderTop: `1px solid ${D ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`, borderBottom: "none", padding: "5px 12px", display: "flex", alignItems: "center", gap: "8px", background: D ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.14)", overflow: "hidden" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "2px 10px 2px 7px", borderRadius: "999px", background: D ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.45)", border: `1px solid ${D ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.7)"}`, whiteSpace: "nowrap", flexShrink: 0 }}>
            <span style={{ fontSize: "11px" }}>✨</span>
            <span style={{ fontSize: "10px", fontStyle: "italic", fontWeight: "600", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI Resume Builder</span>
          </div>
          <span style={{ fontSize: "11px", color: textMuted, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Powered by <span style={{ fontWeight: "700", fontStyle: "normal", color: textSecondary }}>Groq + Gemini AI</span> — {isGuest ? <span style={{color:"#e8a06e",fontStyle:"normal",fontWeight:"700"}}>Guest Mode — <span style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>setScreen("login")}>Login</span></span> : (isPro ? "Pro Plan ✦" : `${1 - (userData?.usageCount || 0)} free generate left today`)}
          </span>
        </div>
      </div>

      {/* BUILDER */}
      {page === "builder" && (
        <div className="desktop-grid" style={{ maxWidth: "900px", margin: "0 auto", padding: "28px 24px", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,340px)", gap: "24px", alignItems: "start" }}>
        <div>
          {/* FILE IMPORT */}
          <GSection glassCard={glassCard} textMuted={textMuted} title="📎 Import Resume">
            <p style={{ fontSize: "12px", color: textSecondary, marginBottom: "12px" }}>Upload an existing resume (PDF or image) — AI will read it and fill in your details automatically.</p>
            <label style={{ display: "block", cursor: "pointer" }}>
              <div style={{ ...(D ? liquidGlassDark : liquidGlass), borderRadius: "14px", padding: "18px", textAlign: "center", border: `2px dashed ${D ? "rgba(255,255,255,0.18)" : "rgba(180,140,80,0.35)"}`, transition: "all 0.2s", cursor: "pointer" }}>
                {fileImporting ? (
                  <div>
                    <p style={{ fontSize: "20px", marginBottom: "6px" }}>🔍</p>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: textPrimary, marginBottom: "2px" }}>Reading your resume...</p>
                    <p style={{ fontSize: "11px", color: textMuted }}>AI is extracting your details</p>
                  </div>
                ) : fileImportDone ? (
                  <div>
                    <p style={{ fontSize: "20px", marginBottom: "6px" }}>✅</p>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: D ? "#7dcfa0" : "#2e7d52", marginBottom: "2px" }}>Resume imported!</p>
                    <p style={{ fontSize: "11px", color: textMuted }}>Fields filled below — review and edit</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: "28px", marginBottom: "8px" }}>📄</p>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: textPrimary, marginBottom: "4px" }}>Drop PDF or image here</p>
                    <p style={{ fontSize: "11px", color: textMuted }}>Supports PDF, JPG, PNG — tap to browse</p>
                  </div>
                )}
              </div>
              <input type="file" accept=".pdf,image/*" onChange={handleFileImport} style={{ display: "none" }} />
            </label>
            {fileImportError && <p style={{ fontSize: "12px", color: D ? "#f08080" : "#b03030", marginTop: "8px", textAlign: "center" }}>{fileImportError}</p>}
          </GSection>

          <GSection glassCard={glassCard} textMuted={textMuted} title="Template">
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {allTemplates.map(t => {
                const locked = PRO_TEMPLATES.includes(t) && !isPro;
                const active = template === t;
                return (
                  <button key={t} onClick={() => locked ? setPage("upgrade") : setTemplate(t)}
                    style={{ ...glassBtn, padding: "6px 16px", fontSize: "13px", background: active ? `${theme.accent1}55` : locked ? (D ? "rgba(255,255,255,0.04)" : "rgba(200,200,200,0.15)") : (D ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.25)"), color: active ? textPrimary : locked ? textMuted : textSecondary }}>
                    {t}{locked ? " 🔒" : ""}
                  </button>
                );
              })}
            </div>
          </GSection>

          <GSection glassCard={glassCard} textMuted={textMuted} title="Personal Info">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <GInput isDark={D} label="Full Name" textMuted={textMuted} inputStyle={glassInput} placeholder="John Doe" value={form.name} onChange={e => update("name", e.target.value)} />
              <GInput isDark={D} label="Email" textMuted={textMuted} inputStyle={glassInput} placeholder="john@email.com" value={form.email} onChange={e => update("email", e.target.value)} />
              <GInput isDark={D} label="Phone" textMuted={textMuted} inputStyle={glassInput} placeholder="+91 9999 99999" value={form.phone} onChange={e => update("phone", e.target.value)} />
              <GInput isDark={D} label="Location" textMuted={textMuted} inputStyle={glassInput} placeholder="City, Country" value={form.location} onChange={e => update("location", e.target.value)} />
            </div>
            <GInput isDark={D} label="LinkedIn URL" textMuted={textMuted} inputStyle={glassInput} placeholder="linkedin.com/in/yourname" value={form.linkedin} onChange={e => update("linkedin", e.target.value)} />
          </GSection>

          {/* PHOTO UPLOAD */}
          <GSection glassCard={glassCard} textMuted={textMuted} title="📷 Profile Photo (Optional)"
            action={form.photo ? <button onClick={() => update("photo", "")} style={{ fontSize: "11px", color: D ? "#f08080" : "#b03030", background: "none", border: "none", cursor: "pointer", fontWeight: "700" }}>✕ Remove</button> : null}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Preview */}
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", flexShrink: 0, overflow: "hidden", border: `2px solid ${form.photo ? theme.accent1 : (D ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)")}`, background: D ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {form.photo
                  ? <img src={form.photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: "28px", opacity: 0.4 }}>👤</span>}
              </div>
              {/* Upload area */}
              <div style={{ flex: 1 }}>
                <label style={{ cursor: "pointer" }}>
                  <div style={{ ...(D ? liquidGlassDark : liquidGlass), borderRadius: "14px", padding: "12px 16px", border: `2px dashed ${D ? "rgba(255,255,255,0.18)" : "rgba(180,140,80,0.35)"}`, textAlign: "center", transition: "all 0.2s" }}>
                    {form.photo
                      ? <><p style={{ fontSize: "13px", fontWeight: "700", color: D ? "#7dcfa0" : "#2e7d52", margin: "0 0 2px" }}>✅ Photo uploaded</p><p style={{ fontSize: "11px", color: textMuted, margin: 0 }}>Click to change</p></>
                      : <><p style={{ fontSize: "13px", fontWeight: "600", color: textPrimary, margin: "0 0 2px" }}>Upload photo</p><p style={{ fontSize: "11px", color: textMuted, margin: 0 }}>JPG, PNG — shown in templates that support photos</p></>}
                  </div>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 2 * 1024 * 1024) { alert("Image too large — please use an image under 2MB."); return; }
                    const reader = new FileReader();
                    reader.onload = ev => update("photo", ev.target.result);
                    reader.readAsDataURL(file);
                    e.target.value = "";
                  }} />
                </label>
              </div>
            </div>
            <p style={{ fontSize: "11px", color: textMuted, margin: "10px 0 0", lineHeight: 1.5 }}>
              💡 <strong>Tip:</strong> Photo resumes are common in India, Europe & Middle East. Not recommended for US/UK roles. Use a professional headshot.
            </p>
          </GSection>

          <GSection glassCard={glassCard} textMuted={textMuted} title="Education" action={<button onClick={() => setForm(p => ({ ...p, education: [...p.education, { degree: "", school: "", year: "" }] }))} style={{ fontSize: "11px", color: theme.accent1, background: "none", border: "none", cursor: "pointer", fontWeight: "700" }}>+ Add</button>}>
            {form.education.map((e, i) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <GInput isDark={D} label="Degree / Course" textMuted={textMuted} inputStyle={glassInput} placeholder="B.Tech Computer Science" value={e.degree} onChange={ev => updateEdu(i, "degree", ev.target.value)} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: "10px" }}>
                  <GInput isDark={D} label="School / College" textMuted={textMuted} inputStyle={glassInput} placeholder="MIT, Stanford..." value={e.school} onChange={ev => updateEdu(i, "school", ev.target.value)} />
                  <GInput isDark={D} label="Year" textMuted={textMuted} inputStyle={glassInput} placeholder="2024" value={e.year} onChange={ev => updateEdu(i, "year", ev.target.value)} />
                </div>
              </div>
            ))}
          </GSection>

          <GSection glassCard={glassCard} textMuted={textMuted} title="Experience" action={<button onClick={() => setForm(p => ({ ...p, experience: [...p.experience, { role: "", company: "", duration: "", desc: "" }] }))} style={{ fontSize: "11px", color: theme.accent1, background: "none", border: "none", cursor: "pointer", fontWeight: "700" }}>+ Add</button>}>
            {form.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: "14px", width: "100%", boxSizing: "border-box" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <GInput isDark={D} label="Job Title" textMuted={textMuted} inputStyle={glassInput} placeholder="Software Engineer" value={e.role} onChange={ev => updateExp(i, "role", ev.target.value)} />
                  <GInput isDark={D} label="Company" textMuted={textMuted} inputStyle={glassInput} placeholder="Google, Infosys..." value={e.company} onChange={ev => updateExp(i, "company", ev.target.value)} />
                </div>
                <GInput isDark={D} label="Duration" textMuted={textMuted} inputStyle={glassInput} placeholder="Jan 2022 – Present" value={e.duration} onChange={ev => updateExp(i, "duration", ev.target.value)} />
                <GTextarea isDark={D} label="Description" textMuted={textMuted} inputStyle={glassInput} placeholder="Brief description (AI will improve this)" value={e.desc} onChange={ev => updateExp(i, "desc", ev.target.value)} rows={2} />
              </div>
            ))}
          </GSection>

          <GSection glassCard={glassCard} textMuted={textMuted} title="Skills">
            <GInput isDark={D} label="Skills" textMuted={textMuted} inputStyle={glassInput} placeholder="Python, React, Figma, SQL" defaultValue={form.skills} onBlur={e => update("skills", e.target.value)} onChange={e => update("skills", e.target.value)} />
            <p style={{ fontSize: "11px", color: textMuted, marginTop: "-4px" }}>Separate with commas</p>
          </GSection>

          {!canGenerate() && (
            <div style={{ ...glassCard, padding: "16px 20px", marginBottom: "12px", background: D ? "rgba(201,169,110,0.1)" : "rgba(201,169,110,0.1)", border: `1px solid ${theme.accent1}44`, textAlign: "center" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: textPrimary, marginBottom: "4px" }}>🎯 Daily limit reached</p>
              <p style={{ fontSize: "12px", color: textSecondary }}>Upgrade to Pro for unlimited AI generates</p>
            </div>
          )}
          <AIExtras
            page={page}
            setPage={setPage}
            callAI={callAI}
            form={form}
            setForm={setForm}
            glassCard={glassCard}
            glassBase={glassBase}
            glassBtn={glassBtn}
            glassInput={glassInput}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            textMuted={textMuted}
            theme={theme}
            D={D}
          />
          {!isPro && <AdBanner isDark={D} />}

          <button onClick={generateAI} disabled={loading} style={{ ...glassBtn, width: "100%", padding: "14px", fontSize: "15px", marginBottom: "10px", background: loading ? (D ? "rgba(255,255,255,0.05)" : "rgba(200,200,200,0.2)") : `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`, color: loading ? textMuted : (D ? "#1a1410" : "#2d2520"), borderRadius: "16px" }}>
            {loading ? "✨ AI is writing your resume..." : "✨ Generate with AI"}
          </button>

          {aiGenerated && (
            <div style={{ marginBottom: "10px" }}>
              <p style={{ textAlign: "center", color: "#7aab80", fontSize: "12px", marginBottom: "12px" }}>✅ AI has improved your resume!</p>
              {!isPro && (
                <div style={{ ...glassCard, padding: "18px 20px", background: D ? `linear-gradient(135deg, ${theme.accent1}18, ${theme.accent2}12)` : `linear-gradient(135deg, ${theme.accent1}22, ${theme.accent2}18)`, marginBottom: "10px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: textPrimary, marginBottom: "4px" }}>✦ Want a resume that truly stands out?</p>
                  <button onClick={() => setPage("upgrade")} style={{ ...glassBtn, width: "100%", padding: "11px", fontSize: "13px", background: `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`, color: D ? "#1a1410" : "#2d2520", borderRadius: "14px" }}>
                    ✦ Unlock Pro Templates — ₹99/mo
                  </button>
                </div>
              )}
            </div>
          )}

          <button onClick={() => setPage("preview")} style={{ ...glassBtn, width: "100%", padding: "13px", fontSize: "14px", color: textSecondary, borderRadius: "16px", marginBottom: "10px" }}>👁 Preview Resume</button>
          <button onClick={analyzeResume} disabled={scoreLoading} style={{ ...glassBtn, width: "100%", padding: "13px", fontSize: "14px", borderRadius: "16px", background: scoreLoading ? "transparent" : (D ? "rgba(255,80,80,0.15)" : "rgba(180,30,30,0.08)"), color: scoreLoading ? textMuted : (D ? "#ff9999" : "#8b1a1a"), border: `1px solid ${D ? "rgba(255,100,100,0.2)" : "rgba(180,30,30,0.15)"}` }}>
            {scoreLoading ? "🔍 Analyzing..." : "🎯 Check Resume Score & ATS"}
          </button>
          <AIExtras
            page={page}
            setPage={setPage}
            callAI={callAI}
            form={form}
            setForm={setForm}
            glassCard={glassCard}
            glassBase={glassBase}
            glassBtn={glassBtn}
            glassInput={glassInput}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            textMuted={textMuted}
            theme={theme}
            D={D}
          />
          {!isPro && <AdBanner isDark={D} />}
        </div>
        {/* Desktop right panel - live preview */}
        <div style={{ display: "none", position: "sticky", top: "100px" }} className="desktop-preview">
          <div style={{ ...glassCard, padding: "24px 20px", fontSize: "11px" }}>
            <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: "14px" }}>Live Preview</p>
            <div style={{ transform: "scale(0.55)", transformOrigin: "top left", width: "182%", pointerEvents: "none" }}>
              <h1 style={{ fontSize: "20px", fontWeight: "700", color: textPrimary, marginBottom: "4px" }}>{form.name || "Your Name"}</h1>
              <div style={{ fontSize: "10px", color: textSecondary, marginBottom: "10px" }}>{form.email} {form.phone && "· " + form.phone}</div>
              {form.summary && <p style={{ fontSize: "10px", color: textPrimary, lineHeight: 1.6, marginBottom: "10px" }}>{form.summary.substring(0,200)}{form.summary.length > 200 ? "..." : ""}</p>}
              {form.skills && <div style={{ fontSize: "10px", color: textSecondary }}>Skills: {form.skills.substring(0,100)}</div>}
            </div>
          </div>
        </div>
        </div>
      )}

      {/* PREVIEW */}
      {page === "preview" && (
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "28px 16px", position: "relative", zIndex: 1 }}>

          {/* Template indicator + clear */}
          {appliedTemplateHtml && (
            <div style={{ ...glassCard, padding: "10px 18px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", background: D ? "rgba(76,175,125,0.08)" : "rgba(76,175,125,0.06)", border: "1px solid rgba(76,175,125,0.25)" }}>
              <span style={{ fontSize: 13, color: D ? "#7dcfa0" : "#2e7d52", fontWeight: 600 }}>✅ Custom template applied</span>
              <button onClick={() => setAppliedTemplateHtml(null)} style={{ ...glassBtn, padding: "5px 12px", fontSize: 12, color: textMuted, borderRadius: 10, cursor: "pointer" }}>✕ Use default</button>
            </div>
          )}

          {/* Resume output */}
          <div id="resume-printable" style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: D ? "0 8px 40px rgba(0,0,0,0.4)" : "0 8px 40px rgba(0,0,0,0.12)" }}>
            {appliedTemplateHtml ? (
              // Render the chosen template HTML with user's real data
              <div dangerouslySetInnerHTML={{ __html: appliedTemplateHtml }} />
            ) : (
              // Default clean preview
              <div style={{ padding: "40px 36px", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", color: "#1a1612" }}>
                <div style={{ marginBottom: "28px", borderBottom: "2px solid #e8e0d0", paddingBottom: "20px", display: "flex", alignItems: "flex-start", gap: "20px" }}>
                  {form.photo && (
                    <img src={form.photo} alt="Profile" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #e8d8a0" }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a1612", letterSpacing: "-0.5px", marginBottom: "6px" }}>{form.name || "Your Name"}</h1>
                    {form.experience?.[0]?.role && <p style={{ fontSize: "14px", color: "#888", margin: "0 0 8px", fontWeight: 400 }}>{form.experience[0].role}{form.experience[0].company ? ` · ${form.experience[0].company}` : ""}</p>}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "12px", color: "#666" }}>
                      {form.email && <span>✉ {form.email}</span>}
                      {form.phone && <span>📞 {form.phone}</span>}
                      {form.location && <span>📍 {form.location}</span>}
                      {form.linkedin && <span>🔗 {form.linkedin}</span>}
                    </div>
                  </div>
                </div>
                {form.summary && <div style={{ marginBottom: "22px" }}><h2 style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "8px" }}>Summary</h2><p style={{ fontSize: "13px", color: "#333", lineHeight: "1.7", margin: 0 }}>{form.summary}</p></div>}
                {form.experience?.some(e => e.role) && (
                  <div style={{ marginBottom: "22px" }}>
                    <h2 style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "10px" }}>Experience</h2>
                    {form.experience.filter(e => e.role).map((e, i) => (
                      <div key={i} style={{ marginBottom: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <p style={{ fontSize: "13px", fontWeight: "600", color: "#1a1612", margin: 0 }}>{e.role}{e.company && <span style={{ color: "#666", fontWeight: "400" }}> · {e.company}</span>}</p>
                          <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{e.duration}</p>
                        </div>
                        {e.desc && <p style={{ fontSize: "12px", color: "#555", lineHeight: "1.65", marginTop: "4px", marginBottom: 0 }}>{e.desc}</p>}
                      </div>
                    ))}
                  </div>
                )}
                {form.education?.some(e => e.degree) && (
                  <div style={{ marginBottom: "22px" }}>
                    <h2 style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "10px" }}>Education</h2>
                    {form.education.filter(e => e.degree).map((e, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <p style={{ fontSize: "13px", color: "#1a1612", margin: 0 }}>{e.degree}{e.school && <span style={{ color: "#666" }}> — {e.school}</span>}</p>
                        <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{e.year}</p>
                      </div>
                    ))}
                  </div>
                )}
                {form.skills && (
                  <div>
                    <h2 style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "10px" }}>Skills</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {form.skills.split(",").map((s, i) => <span key={i} style={{ background: "#f5f0e8", border: "1px solid #e8d8a0", padding: "4px 14px", borderRadius: "6px", fontSize: "12px", color: "#666" }}>{s.trim()}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DownloadResume form={form} glassCard={glassCard} glassBase={glassBase} glassBtn={glassBtn} textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} theme={theme} D={D} />
          {!isPro && <button onClick={() => setPage("upgrade")} style={{ ...glassBtn, width: "100%", padding: "13px", fontSize: "14px", marginTop: "10px", color: textSecondary, borderRadius: "16px" }}>✦ Remove Ads & Unlock Pro Templates</button>}
        </div>
      )}

      {/* SCORE */}
      {page === "score" && (
        <div style={{ maxWidth: "580px", margin: "0 auto", padding: "28px 16px", position: "relative", zIndex: 1 }}>
          {!scoreData ? (
            <div style={{ ...glassCard, padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
              <p style={{ fontSize: "16px", fontWeight: "700", color: textPrimary, marginBottom: "8px" }}>Resume Score & ATS Checker</p>
              <p style={{ fontSize: "13px", color: textSecondary, marginBottom: "24px" }}>Fill your details in Builder then tap Check Resume Score.</p>
              <button onClick={() => setPage("builder")} style={{ ...glassBtn, padding: "12px 28px", color: textSecondary }}>← Go to Builder</button>
            </div>
          ) : (
            <>
              <div style={{ ...glassCard, padding: "28px 24px", marginBottom: "16px", textAlign: "center" }}>
                <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: textMuted, marginBottom: "20px" }}>Overall Resume Score</p>
                <div style={{ position: "relative", width: "140px", height: "140px", margin: "0 auto 20px" }}>
                  <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="70" cy="70" r="58" fill="none" stroke={D ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"} strokeWidth="10" />
                    <circle cx="70" cy="70" r="58" fill="none" stroke={scoreData.overallScore >= 80 ? "#4caf7d" : scoreData.overallScore >= 60 ? theme.accent1 : "#e05c5c"} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 58}`} strokeDashoffset={`${2 * Math.PI * 58 * (1 - scoreData.overallScore / 100)}`} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "32px", fontWeight: "800", color: scoreData.overallScore >= 80 ? "#4caf7d" : scoreData.overallScore >= 60 ? theme.accent1 : "#e05c5c" }}>{scoreData.overallScore}</span>
                    <span style={{ fontSize: "11px", color: textMuted }}>/ 100</span>
                  </div>
                </div>
                <p style={{ fontSize: "13px", color: textSecondary, fontStyle: "italic", marginBottom: "20px" }}>"{scoreData.verdict}"</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  {[["ATS", scoreData.atsScore, "🤖"], ["Content", scoreData.contentScore, "📝"], ["Format", scoreData.formatScore, "🎨"]].map(([label, score, icon]) => (
                    <div key={label} style={{ ...glassBase, borderRadius: "14px", padding: "14px 10px" }}>
                      <div style={{ fontSize: "18px", marginBottom: "6px" }}>{icon}</div>
                      <div style={{ fontSize: "20px", fontWeight: "800", color: score >= 80 ? "#4caf7d" : score >= 60 ? theme.accent1 : "#e05c5c", marginBottom: "2px" }}>{score}</div>
                      <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...glassCard, padding: "20px 24px", marginBottom: "16px" }}>
                <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: textMuted, marginBottom: "16px" }}>🤖 ATS Checks</p>
                {scoreData.atsChecks.map((check, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "12px", marginBottom: "8px", background: check.pass ? (D ? "rgba(76,175,125,0.1)" : "rgba(76,175,125,0.08)") : (D ? "rgba(224,92,92,0.1)" : "rgba(224,92,92,0.07)"), border: `1px solid ${check.pass ? "rgba(76,175,125,0.25)" : "rgba(224,92,92,0.2)"}` }}>
                    <span>{check.pass ? "✅" : "❌"}</span>
                    <span style={{ fontSize: "13px", color: check.pass ? (D ? "#7dcfa0" : "#2e7d52") : (D ? "#f08080" : "#b03030"), flex: 1 }}>{check.label}</span>
                    <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "8px", background: check.pass ? "rgba(76,175,125,0.2)" : "rgba(224,92,92,0.2)", color: check.pass ? (D ? "#7dcfa0" : "#2e7d52") : (D ? "#f08080" : "#b03030") }}>{check.pass ? "PASS" : "FAIL"}</span>
                  </div>
                ))}
              </div>
              <div style={{ ...glassCard, padding: "20px 24px", marginBottom: "16px" }}>
                <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: textMuted, marginBottom: "14px" }}>🚀 How to Improve</p>
                {scoreData.tips.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", padding: "12px 14px", borderRadius: "12px", marginBottom: "8px", ...glassBase }}>
                    <span style={{ fontSize: "13px", fontWeight: "800", color: theme.accent1 }}>{i + 1}.</span>
                    <span style={{ fontSize: "13px", color: textSecondary, lineHeight: "1.55" }}>{tip}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={analyzeResume} disabled={scoreLoading} style={{ ...glassBtn, flex: 1, padding: "13px", fontSize: "13px", color: textSecondary, borderRadius: "16px" }}>🔄 Re-analyze</button>
                <button onClick={() => setPage("builder")} style={{ ...glassBtn, flex: 1, padding: "13px", fontSize: "13px", background: `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`, color: D ? "#1a1410" : "#2d2520", borderRadius: "16px" }}>✏️ Fix Resume</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ACCOUNT / MANAGE SUBSCRIPTION */}
      {page === "account" && (
        <div style={{ maxWidth: "480px", margin: "0 auto", padding: "28px 16px", position: "relative", zIndex: 1 }}>
          <div style={{ ...glassCard, padding: "24px", marginBottom: "16px" }}>
            <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: textMuted, marginBottom: "16px" }}>👤 Account</p>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "800", color: D ? "#1a1410" : "#fff" }}>
                {(userData?.name || userData?.email || "U")[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: "15px", fontWeight: "700", color: textPrimary }}>{userData?.name || "User"}</p>
                <p style={{ fontSize: "12px", color: textSecondary }}>{userData?.email}</p>
              </div>
            </div>
            <button onClick={logout} style={{ ...glassBtn, width: "100%", padding: "11px", fontSize: "13px", color: textMuted }}>🚪 Sign Out</button>
          </div>

          <div style={{ ...glassCard, padding: "24px", marginBottom: "16px" }}>
            <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: textMuted, marginBottom: "16px" }}>📊 My Plan</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <p style={{ fontSize: "18px", fontWeight: "800", color: textPrimary }}>{isPro ? "✦ Pro" : "Free"}</p>
                <p style={{ fontSize: "12px", color: textSecondary }}>{isPro ? `Plan: ${userData?.plan === "monthly" ? "₹99/month" : "₹499 lifetime"}` : "1 AI generate per day"}</p>
              </div>
              {isPro && <span style={{ padding: "4px 12px", borderRadius: "20px", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, fontSize: "11px", fontWeight: "700", color: D ? "#1a1410" : "#fff" }}>ACTIVE</span>}
            </div>
            <div style={{ ...glassBase, borderRadius: "14px", padding: "14px 16px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: textSecondary }}>Today's usage</span>
                <span style={{ fontSize: "12px", fontWeight: "700", color: textPrimary }}>{userData?.usageCount || 0} / {isPro ? "∞" : "1"}</span>
              </div>
              <div style={{ height: "5px", borderRadius: "99px", background: D ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)" }}>
                <div style={{ height: "100%", borderRadius: "99px", width: isPro ? "10%" : `${Math.min((userData?.usageCount || 0) * 100, 100)}%`, background: `linear-gradient(90deg, ${theme.accent1}, ${theme.accent2})` }} />
              </div>
            </div>
            {!isPro && (
              <button onClick={() => setPage("upgrade")} style={{ ...glassBtn, width: "100%", padding: "12px", fontSize: "13px", background: `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`, color: D ? "#1a1410" : "#2d2520", borderRadius: "14px" }}>
                ✦ Upgrade to Pro
              </button>
            )}
            {isPro && userData?.plan === "monthly" && (
              <p style={{ fontSize: "11px", color: textMuted, textAlign: "center", marginTop: "8px" }}>To cancel, contact support@spiderresumeai.com</p>
            )}
          </div>

          {/* PROMO CODE CAPSULE */}
          {!isPro && (
            <div style={{ ...glassCard, padding: "20px 24px", marginBottom: "16px" }}>
              <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: textMuted, marginBottom: "14px" }}>🎟️ Promo Code</p>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <div style={{ flex: 1, ...(D ? liquidGlassDark : liquidGlass), borderRadius: "999px", padding: "10px 18px", display: "flex", alignItems: "center" }}>
                  <input
                    value={promoInput}
                    onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoStatus(null); setPromoMsg(""); }}
                    onKeyDown={e => e.key === "Enter" && applyPromo()}
                    placeholder="Enter promo code"
                    style={{ background: "none", border: "none", outline: "none", fontSize: "13px", fontWeight: "700", letterSpacing: "0.06em", color: textPrimary, width: "100%", fontFamily: "inherit" }}
                  />
                </div>
                <button
                  onClick={applyPromo}
                  disabled={!promoInput.trim()}
                  style={{ ...(D ? liquidGlassDark : liquidGlass), padding: "10px 20px", borderRadius: "999px", border: `1px solid ${theme.accent1}66`, background: `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`, color: D ? "#1a1410" : "#2d2520", fontSize: "13px", fontWeight: "700", cursor: !promoInput.trim() ? "not-allowed" : "pointer", opacity: !promoInput.trim() ? 0.5 : 1, whiteSpace: "nowrap", transition: "all 0.2s" }}
                >
                  {"Apply ✦"}
                </button>
              </div>
              {promoStatus === "success" && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "12px", background: D ? "rgba(76,175,125,0.12)" : "rgba(76,175,125,0.1)", border: "1px solid rgba(76,175,125,0.3)", marginTop: "4px" }}>
                  <span>✅</span>
                  <span style={{ fontSize: "12px", color: D ? "#7dcfa0" : "#2e7d52", fontWeight: "600" }}>{promoMsg}</span>
                </div>
              )}
              {promoStatus === "error" && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "12px", background: D ? "rgba(224,92,92,0.1)" : "rgba(224,92,92,0.07)", border: "1px solid rgba(224,92,92,0.25)", marginTop: "4px" }}>
                  <span>❌</span>
                  <span style={{ fontSize: "12px", color: D ? "#f08080" : "#b03030" }}>{promoMsg}</span>
                </div>
              )}
            </div>
          )}

          <div style={{ ...glassCard, padding: "24px" }}>
            <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: textMuted, marginBottom: "14px" }}>ℹ️ How to use</p>
            {[["✏️ Builder","Fill in your personal info, education, experience and skills"],["✨ Generate","Click Generate with AI to auto-write your summary and improve descriptions"],["🎯 Score","Check your ATS score to see how recruiters' systems will rate your resume"],["👁 Preview","See your final resume and download it as PDF"],["✦ Pro","Unlock unlimited generates, premium templates and remove ads"]].map(([title, desc]) => (
              <div key={title} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", minWidth: "24px" }}>{title.split(" ")[0]}</span>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: textPrimary, marginBottom: "2px" }}>{title.substring(2)}</p>
                  <p style={{ fontSize: "11px", color: textMuted, lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* AI CHAT */}
      {page === "chat" && (
        <ChatPage callAI={callAI} setForm={setForm} setPage={setPage}
          glassCard={glassCard} glassBase={glassBase} glassBtn={glassBtn} glassInput={glassInput}
          textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} theme={theme} D={D} />
      )}

      {/* TEMPLATES */}
      {page === "templates" && (
        <TemplatesPage callAI={callAI} form={form} setForm={setForm} setTemplate={setTemplate} setPage={setPage}
          setAppliedTemplateHtml={setAppliedTemplateHtml}
          glassCard={glassCard} glassBase={glassBase} glassBtn={glassBtn} glassInput={glassInput}
          textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} theme={theme} D={D} isPro={isPro} />
      )}

      {/* JOBS */}
      {page === "jobs" && (
        <JobsPage callAI={callAI} form={form}
          glassCard={glassCard} glassBase={glassBase} glassBtn={glassBtn} glassInput={glassInput}
          textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} theme={theme} D={D} />
      )}

      {/* COVER LETTER */}
      {page === "cover" && (
        <CoverPage callAI={callAI} form={form}
          glassCard={glassCard} glassBase={glassBase} glassBtn={glassBtn} glassInput={glassInput}
          textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} theme={theme} D={D} />
      )}

      {/* INTERVIEW PREP */}
      {page === "interview" && (
        <InterviewPage callAI={callAI} form={form}
          glassCard={glassCard} glassBase={glassBase} glassBtn={glassBtn} glassInput={glassInput}
          textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} theme={theme} D={D} />
      )}

      {/* JOB TRACKER */}
      {page === "tracker" && (
        <TrackerPage
          glassCard={glassCard} glassBase={glassBase} glassBtn={glassBtn} glassInput={glassInput}
          textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} theme={theme} D={D} />
      )}

      {/* LINKEDIN OPTIMIZER */}
      {page === "linkedin" && (
        <LinkedInPage callAI={callAI} form={form}
          glassCard={glassCard} glassBase={glassBase} glassBtn={glassBtn} glassInput={glassInput}
          textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} theme={theme} D={D} />
      )}

      {/* UPGRADE */}
      {page === "upgrade" && (
        <div style={{ maxWidth: "440px", margin: "0 auto", padding: "48px 16px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 16px", borderRadius: "20px", ...glassBase, marginBottom: "20px" }}>
            <img src={LOGO_SRC} alt="Spider" style={{ height: "28px", width: "auto", objectFit: "contain", mixBlendMode: "multiply", filter: D ? "invert(1)" : "none" }} />
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: textSecondary }}>Spider Pro</span>
          </div>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: textPrimary, letterSpacing: "-1px", marginBottom: "8px", lineHeight: 1.1 }}>Elevate your resume.<br /><span style={{ background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Land the job.</span></h2>
          <p style={{ color: textSecondary, fontSize: "14px", marginBottom: "32px" }}>Everything you need to impress recruiters.</p>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            {[{ price: "₹99", label: "per month", tag: null, plan: "monthly" }, { price: "₹499", label: "one time", tag: "BEST VALUE", plan: "lifetime" }].map(({ price, label, tag, plan }) => (
              <div key={plan} onClick={() => openRazorpay(plan)} style={{ flex: 1, position: "relative", ...glassCard, padding: "20px 14px", cursor: "pointer", border: plan === "lifetime" ? `1.5px solid ${theme.accent1}55` : glassCard.border }}>
                {tag && <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", fontSize: "9px", fontWeight: "800", padding: "3px 10px", borderRadius: "10px", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, color: D ? "#1a1410" : "#fff", whiteSpace: "nowrap" }}>{tag}</div>}
                <p style={{ fontSize: "28px", fontWeight: "800", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "2px" }}>{price}</p>
                <p style={{ fontSize: "11px", color: textMuted }}>{label}</p>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[["🚫","Zero ads"],["🎨","All 4 templates"],["⬇️","Unlimited PDF downloads"],["⚡","Unlimited AI generates"],["🔮","Early access to features"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px", ...glassBase, borderRadius: "14px", padding: "13px 16px", textAlign: "left" }}>
                <span style={{ fontSize: "18px" }}>{icon}</span>
                <span style={{ fontSize: "13px", fontWeight: "500", color: textPrimary }}>{text}</span>
                <span style={{ marginLeft: "auto", color: theme.accent1 }}>✓</span>
              </div>
            ))}
          </div>
          <button onClick={() => openRazorpay("monthly")} style={{ width: "100%", padding: "16px", fontSize: "16px", fontWeight: "700", cursor: "pointer", borderRadius: "18px", border: `1px solid ${theme.accent2}99`, background: `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`, color: D ? "#1a1410" : "#1a1612", marginBottom: "10px" }}>
            ✦ Activate Pro — ₹99/month
          </button>
          <button onClick={() => openRazorpay("lifetime")} style={{ ...glassBtn, width: "100%", padding: "13px", fontSize: "14px", color: textSecondary, borderRadius: "16px", marginBottom: "6px" }}>Get Lifetime — ₹499 once</button>
          <p style={{ fontSize: "11px", color: textMuted, marginBottom: "20px" }}>Payments secured by Razorpay</p>

          <button onClick={() => setPage("builder")} style={{ background: "none", border: "none", cursor: "pointer", color: textMuted, fontSize: "13px" }}>← Back to builder</button>
        </div>
      )} 
      {!isPro && <AdBanner isDark={D} />}
    </div>
  );
}