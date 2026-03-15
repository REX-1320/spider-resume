// src/pages/ChatPage.jsx — AI Resume Chat
import { useState, useRef, useEffect } from "react";

export default function ChatPage({ callAI, setForm, setPage, glassCard, glassBase, glassBtn, glassInput, textPrimary, textSecondary, textMuted, theme, D }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "👋 Hi! I'm your Spider AI resume assistant.\n\nTell me about yourself — your name, what you do, years of experience, education, and skills. The more you share, the better I'll fill your resume!\n\n💡 Example: \"I'm Arjun, a React developer with 2 years at Infosys. I studied B.Tech at VIT Vellore. Skills: JavaScript, React, Node.js, MongoDB.\""
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [filledFields, setFilledFields] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMsgs = [...messages, { role: "user", text }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const history = newMsgs.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`).join("\n");
      const raw = await callAI(`You are Spider AI, a friendly resume-building assistant. Extract resume info from this conversation and either ask ONE follow-up question OR output the resume JSON.

CONVERSATION:
${history}

Rules:
- If you have name + at least some experience OR education, output the resume JSON
- If missing critical info, ask exactly ONE short friendly question
- Never ask multiple questions at once
- When ready, prefix your response with exactly: RESUME_JSON:
Then output valid JSON (no markdown):
{"name":"","email":"","phone":"","location":"","linkedin":"","summary":"write a strong 2-sentence professional summary","skills":"comma,separated,skills","education":[{"degree":"","school":"","year":""}],"experience":[{"role":"","company":"","duration":"","desc":"write 2-3 sentence impactful description of their work"}]}

Make summaries and descriptions professional and impactful. Fill empty strings with empty string, not null.`);

      if (raw.includes("RESUME_JSON:")) {
        const jsonStr = raw.split("RESUME_JSON:")[1].trim().replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(jsonStr);
        const filled = [];
        if (parsed.name) filled.push("Name");
        if (parsed.email) filled.push("Email");
        if (parsed.summary) filled.push("Summary");
        if (parsed.skills) filled.push("Skills");
        if (parsed.experience?.some(e => e.role)) filled.push("Experience");
        if (parsed.education?.some(e => e.degree)) filled.push("Education");
        setFilledFields(filled);
        setForm(p => ({
          name: parsed.name || p.name,
          email: parsed.email || p.email,
          phone: parsed.phone || p.phone,
          location: parsed.location || p.location,
          linkedin: parsed.linkedin || p.linkedin,
          summary: parsed.summary || p.summary,
          skills: parsed.skills || p.skills,
          education: Array.isArray(parsed.education) && parsed.education.length ? parsed.education : p.education,
          experience: Array.isArray(parsed.experience) && parsed.experience.length ? parsed.experience : p.experience,
        }));
        setMessages(prev => [...prev, { role: "assistant", text: "✅ I've filled your resume with the details you shared! Head to Builder to review everything, or go to Templates to pick a style." }]);
        setDone(true);
      } else {
        setMessages(prev => [...prev, { role: "assistant", text: raw.trim() }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", text: "❌ Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const accent = `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 16px 32px", zIndex: 1, position: "relative", display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div style={{ ...glassCard, padding: "14px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🤖</div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 800, color: textPrimary, margin: 0 }}>AI Resume Chat</p>
          <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>Describe your career → AI fills your resume automatically</p>
        </div>
        {done && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={() => setPage("builder")} style={{ ...glassBtn, padding: "7px 14px", fontSize: 12, color: D ? "#1a1410" : "#2d2520", background: accent, borderRadius: 12 }}>Builder →</button>
            <button onClick={() => setPage("templates")} style={{ ...glassBtn, padding: "7px 14px", fontSize: 12, color: textSecondary, borderRadius: 12 }}>Templates →</button>
          </div>
        )}
      </div>

      {/* Filled fields badge */}
      {filledFields.length > 0 && (
        <div style={{ ...glassCard, padding: "10px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", background: D ? "rgba(76,175,125,0.1)" : "rgba(76,175,125,0.08)", border: "1px solid rgba(76,175,125,0.25)" }}>
          <span style={{ fontSize: 11, color: D ? "#7dcfa0" : "#2e7d52", fontWeight: 700 }}>✅ Filled:</span>
          {filledFields.map(f => <span key={f} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "rgba(76,175,125,0.2)", color: D ? "#7dcfa0" : "#2e7d52", fontWeight: 600 }}>{f}</span>)}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: "4px 2px", marginBottom: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>🤖</div>
            )}
            <div style={{
              maxWidth: "78%", padding: "11px 15px", fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              color: msg.role === "user" ? (D ? "#1a1410" : "#fff") : textPrimary,
              background: msg.role === "user" ? accent : (D ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.5)"),
              backdropFilter: "blur(20px)",
              border: msg.role === "user" ? "none" : `1px solid ${D ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.65)"}`,
            }}>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🤖</div>
            <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: D ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.5)", backdropFilter: "blur(20px)", border: `1px solid ${D ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.65)"}`, display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: theme.accent1, animation: `chatdot 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={done ? "Ask me anything else about your resume..." : "Tell me about yourself... (Enter to send)"}
          rows={3}
          style={{ ...glassInput, flex: 1, resize: "none", borderRadius: 16, padding: "12px 16px", fontSize: 13, lineHeight: 1.5, fontFamily: "inherit", color: textPrimary, boxSizing: "border-box" }}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{ ...glassBtn, padding: "0 18px", fontSize: 18, background: accent, color: D ? "#1a1410" : "#fff", borderRadius: 16, alignSelf: "stretch", opacity: (!input.trim() || loading) ? 0.4 : 1, cursor: (!input.trim() || loading) ? "not-allowed" : "pointer", border: "none" }}>↑</button>
      </div>
      <style>{`@keyframes chatdot{0%,100%{transform:scale(.7);opacity:.4}50%{transform:scale(1.2);opacity:1}}`}</style>
    </div>
  );
}
