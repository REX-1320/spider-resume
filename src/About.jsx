// src/About.jsx
const LOGO_SRC = "/logo.png";

const features = [
  { icon: "✏️", title: "Resume Builder", desc: "Intuitive form-based builder with live preview as you type." },
  { icon: "🤖", title: "AI Generation", desc: "Groq-powered AI writes your professional summary and job descriptions instantly." },
  { icon: "👁", title: "Live Preview", desc: "See your resume update in real-time before downloading." },
  { icon: "🎨", title: "20 Themes", desc: "10 light and 10 dark color themes — a new one on every visit." },
  { icon: "📄", title: "Multiple Templates", desc: "Classic, Modern, Minimal, and Bold resume layouts." },
  { icon: "📎", title: "Import from File", desc: "Upload an existing resume PDF or image — AI reads and fills your details." },
  { icon: "🎯", title: "ATS Score Checker", desc: "Get an ATS compatibility score and actionable tips to beat resume filters." },
  { icon: "⚡", title: "Fast & Free", desc: "Start building immediately — no credit card required." },
];

export default function About({ onBack, theme, D, glassCard, glassBase, textPrimary, textSecondary, textMuted }) {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: textMuted, fontSize: "13px", marginBottom: "28px", padding: 0 }}>← Back</button>

      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <img src={LOGO_SRC} alt="Spider Resume" onError={e => { e.target.style.display = "none"; }} style={{ height: "64px", marginBottom: "16px", filter: D ? "invert(1) drop-shadow(0 0 8px rgba(200,80,80,0.5))" : "drop-shadow(0 2px 8px rgba(80,0,0,0.2))" }} />
        <h1 style={{ fontSize: "36px", fontWeight: "800", color: textPrimary, margin: "0 0 12px" }}>About Spider Resume</h1>
        <p style={{ fontSize: "16px", color: textSecondary, lineHeight: 1.6, maxWidth: "520px", margin: "0 auto" }}>
          A modern AI-powered resume builder built for students and job seekers who want professional results — fast.
        </p>
      </div>

      {/* About */}
      <div style={{ ...glassCard, padding: "28px", marginBottom: "16px" }}>
        <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: "12px" }}>About</p>
        <p style={{ fontSize: "14px", color: textSecondary, lineHeight: 1.8, margin: 0 }}>
          Spider Resume is a modern web application that helps users quickly create professional, ATS-friendly resumes. Built with React, powered by Groq AI, and designed with a clean glassmorphism aesthetic — it combines speed, intelligence, and style to make resume creation effortless.
        </p>
      </div>

      {/* Mission */}
      <div style={{ ...glassCard, padding: "28px", marginBottom: "24px" }}>
        <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: "12px" }}>Our Mission</p>
        <p style={{ fontSize: "14px", color: textSecondary, lineHeight: 1.8, margin: 0 }}>
          We believe everyone deserves a great resume regardless of their budget or technical skills. Spider Resume aims to democratise professional resume creation — giving students and job seekers the same quality output that was previously only possible with expensive career coaches or design tools.
        </p>
      </div>

      {/* Features */}
      <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: "14px" }}>Features</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px", marginBottom: "32px" }}>
        {features.map(({ icon, title, desc }) => (
          <div key={title} style={{ ...glassCard, padding: "20px" }}>
            <p style={{ fontSize: "22px", margin: "0 0 8px" }}>{icon}</p>
            <p style={{ fontSize: "13px", fontWeight: "700", color: textPrimary, margin: "0 0 6px" }}>{title}</p>
            <p style={{ fontSize: "12px", color: textSecondary, lineHeight: 1.6, margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={{ ...glassCard, padding: "28px", textAlign: "center" }}>
        <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: "12px" }}>Contact</p>
        <p style={{ fontSize: "14px", color: textSecondary, marginBottom: "10px" }}>Have a question or feedback? Reach out:</p>
        <a href="mailto:contact@spiderresume.com" style={{ fontSize: "15px", fontWeight: "700", color: theme.accent1, textDecoration: "none" }}>
          contact@spiderresume.com
        </a>
      </div>
    </div>
  );
}
