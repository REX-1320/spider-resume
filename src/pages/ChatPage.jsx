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
      const response = await callAI(`You are Spider AI, a friendly resume-building assistant. Extract resume info from this conversation and either ask ONE follow-up question OR output the resume JSON.

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
      const raw = typeof response === 'string' ? response : response.content;
      console.log(`AI Model Used: ${response.provider} - ${response.model}`);

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
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", zIndex: 1, position: "relative", display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
      {/* Header */}
      <div className="animate-fade-in-down" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="ambient-blob animate-float" style={{ width: "56px", height: "56px", borderRadius: "16px", background: `linear-gradient(135deg, ${theme.accent1}20, ${theme.accent2}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
            🤖
          </div>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "4px", letterSpacing: "-0.5px" }}>AI Resume Assistant</h2>
            <p style={{ fontSize: "14px", color: textSecondary, margin: 0 }}>Describe your career, and AI will build your resume automatically.</p>
          </div>
        </div>
        
        {done && (
          <div className="animate-fade-in-scale" style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => setPage("builder")} className="btn-premium animate-pulse-glow" style={{ padding: "10px 20px", fontSize: "14px", fontWeight: "700", color: D ? "#0c0a08" : "#fff", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, borderRadius: "100px", border: "none" }}>
              Go to Builder →
            </button>
            <button onClick={() => setPage("templates")} className="btn-glass" style={{ padding: "10px 20px", fontSize: "14px", fontWeight: "700", color: textSecondary, borderRadius: "100px" }}>
              View Templates →
            </button>
          </div>
        )}
      </div>

      {/* Filled fields badge */}
      {filledFields.length > 0 && (
        <div className="animate-fade-in-up delay-1 scroll-hide" style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", paddingBottom: "16px", marginBottom: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: D ? "#7dcfa0" : "#2e7d52", marginRight: "4px", flexShrink: 0 }}>✅ Extracted:</span>
          {filledFields.map(f => (
            <span key={f} style={{ fontSize: "12px", fontWeight: "700", padding: "6px 14px", borderRadius: "100px", background: D ? "rgba(76,175,125,0.1)" : "rgba(76,175,125,0.1)", color: D ? "#7dcfa0" : "#2e7d52", border: `1px solid rgba(76,175,125,0.2)`, whiteSpace: "nowrap" }}>
              {f}
            </span>
          ))}
        </div>
      )}

      {/* Main Chat Area */}
      <div className="card-hover-lift animate-fade-in-up delay-2 glass-panel" style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px", overflow: "hidden", position: "relative", marginBottom: "24px" }}>
        
        {/* Background Decoration */}
        <div style={{ position: "absolute", top: "20%", right: "-10%", width: "400px", height: "400px", background: `radial-gradient(circle, ${theme.accent1}10 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "300px", height: "300px", background: `radial-gradient(circle, ${theme.accent2}10 0%, transparent 60%)`, pointerEvents: "none" }} />

        {/* Messages Scroll Area */}
        <div className="scroll-hide" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px", paddingRight: "8px" }}>
          {messages.map((msg, i) => (
            <div key={i} className="animate-fade-in-up" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: "12px", animationDelay: `${i * 0.05}s` }}>
              
              {msg.role === "assistant" && (
                 <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: `linear-gradient(135deg, ${theme.accent1}30, ${theme.accent2}30)`, border: `1px solid ${theme.accent1}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0, alignSelf: "flex-start" }}>
                   🤖
                 </div>
              )}
              
              <div style={{
                maxWidth: "75%", 
                padding: "16px 20px", 
                fontSize: "15px", 
                lineHeight: 1.6, 
                whiteSpace: "pre-wrap",
                borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                color: msg.role === "user" ? (D ? "#0c0a08" : "#fff") : textPrimary,
                background: msg.role === "user" ? `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})` : (D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"),
                border: msg.role === "user" ? "none" : `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                boxShadow: msg.role === "user" ? `0 8px 16px ${theme.accent1}30` : "none",
                fontWeight: msg.role === "user" ? "500" : "normal"
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: `linear-gradient(135deg, ${theme.accent1}30, ${theme.accent2}30)`, border: `1px solid ${theme.accent1}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                 🤖
              </div>
              <div style={{ padding: "16px 20px", borderRadius: "20px 20px 20px 4px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, display: "flex", gap: "6px", alignItems: "center", height: "56px" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: theme.accent1, animation: `bounce 1.4s infinite ease-in-out both`, animationDelay: `${i * 0.16}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div style={{ display: "flex", gap: "12px", background: D ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", padding: "8px", borderRadius: "24px", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, position: "relative", zIndex: 2 }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={done ? "Need anything else?" : "Type your history here... (e.g. I worked at Google for 3 years)"}
            rows={1}
            style={{ 
              flex: 1, 
              background: "transparent", 
              border: "none", 
              resize: "none", 
              padding: "16px", 
              fontSize: "15px", 
              lineHeight: 1.5, 
              fontFamily: "inherit", 
              color: textPrimary, 
              outline: "none",
              minHeight: "56px",
              maxHeight: "150px"
            }}
            onInput={(e) => {
               e.target.style.height = 'auto';
               e.target.style.height = (e.target.scrollHeight) + 'px';
            }}
          />
          <button 
            onClick={send} 
            disabled={loading || !input.trim()} 
            className={(loading || !input.trim()) ? "" : "btn-premium animate-pulse-glow"}
            style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "20px", 
              background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, 
              color: D ? "#0c0a08" : "#fff", 
              border: "none", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontSize: "20px", 
              opacity: (!input.trim() || loading) ? 0.3 : 1, 
              cursor: (!input.trim() || loading) ? "not-allowed" : "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              alignSelf: "flex-end"
            }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <line x1="12" y1="19" x2="12" y2="5"></line>
               <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </div>

      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        /* Custom scrollbar for textarea */
        textarea::-webkit-scrollbar { width: 6px; }
        textarea::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}
