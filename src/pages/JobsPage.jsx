// src/pages/JobsPage.jsx — Job Platform Recommender with AI Matching
import { useState } from "react";

const ALL_PLATFORMS = [
  { name: "LinkedIn", icon: "💼", url: "https://linkedin.com/jobs", color: "#0A66C2", tag: "Global #1", bestFor: ["tech", "management", "marketing", "finance", "design", "all"], pros: ["World's largest professional network", "Recruiter InMail & direct outreach", "Easy Apply with saved resume", "Company insights, salary data", "Alumni & network connections", "Job alerts by keyword"], cons: ["Very high applicant competition", "Premium plan is expensive (₹2,500+/mo)", "Recruiter spam messages", "Algorithm can bury your profile"], verdict: "Essential for everyone. First platform to activate.", rating: 5 },
  { name: "Indeed", icon: "🔍", url: "https://in.indeed.com", color: "#003A9B", tag: "Highest Volume", bestFor: ["all"], pros: ["Millions of job listings across all sectors", "Free resume hosting & visibility", "Strong job alerts system", "Salary estimator built-in", "No account needed for many applications"], cons: ["Many outdated or ghost listings", "Lower recruiter engagement than LinkedIn", "Harder to stand out in volume", "Some listings redirect to dead links"], verdict: "Best for volume applying. Use alongside LinkedIn.", rating: 4 },
  { name: "Naukri", icon: "🇮🇳", url: "https://naukri.com", color: "#FF7555", tag: "India #1", bestFor: ["tech", "finance", "management", "all"], pros: ["India's largest job board (70M+ users)", "Resume database visible to Indian recruiters", "Strong for IT, BFSI, finance roles", "AI-powered job match recommendations", "Campus hiring section"], cons: ["India-focused — not for global jobs", "Resume spam from low-quality recruiters", "UI can feel cluttered", "Recruiter quality varies widely"], verdict: "Must-use for India-based job seekers.", rating: 4 },
  { name: "Wellfound", icon: "🚀", url: "https://wellfound.com", color: "#F65C1C", tag: "Startups", bestFor: ["tech", "design", "product", "startup"], pros: ["Startup-exclusive platform (ex-AngelList Talent)", "Salary + equity shown upfront", "Direct founder/CTO connections", "Great for engineers, PMs, designers", "Transparent company info"], cons: ["Limited to startup ecosystem", "Fewer enterprise / govt roles", "Smaller listing volume", "Competitive for top startups"], verdict: "Best if you want startup equity and early-stage roles.", rating: 4 },
  { name: "Internshala", icon: "🎓", url: "https://internshala.com", color: "#008BCA", tag: "Freshers & Students", bestFor: ["fresher", "student", "intern"], pros: ["India's top internship platform", "Thousands of paid + unpaid internships", "Courses & certifications to boost profile", "Ideal for college students and freshers", "Active company postings"], cons: ["Not suited for experienced professionals", "Many very low or zero stipend roles", "Limited senior-level postings", "Heavy competition from students"], verdict: "Perfect starting point for students and recent graduates.", rating: 4 },
  { name: "Glassdoor", icon: "🪟", url: "https://glassdoor.co.in", color: "#0CAA41", tag: "Research + Apply", bestFor: ["all"], pros: ["Real employee reviews & salary reports", "Interview question insights", "Helps negotiate confidently", "Company culture transparency", "CEO approval ratings"], cons: ["Fewer listings than Indeed/LinkedIn", "Reviews can be biased", "Paywall for full salary data", "India-specific data is limited"], verdict: "Use before every interview. Research, then apply.", rating: 3 },
  { name: "Unstop", icon: "🏆", url: "https://unstop.com", color: "#7C3AED", tag: "Competitions + Hiring", bestFor: ["student", "fresher", "tech"], pros: ["Combines job listings with competitions", "Build profile via hackathons & case challenges", "Campus hiring & company challenges", "Strong student community", "Recognised by top recruiters"], cons: ["Mostly targeted at students", "Smaller job listing base", "Less suitable for experienced professionals", "Competition results don't always lead to jobs"], verdict: "Unique platform — great for standing out through competitions.", rating: 3 },
  { name: "Remotive", icon: "🌍", url: "https://remotive.com", color: "#14B8A6", tag: "Remote Only", bestFor: ["tech", "design", "marketing", "remote"], pros: ["100% remote job listings", "Global companies hiring remotely", "Tech, design, marketing, customer roles", "No geographic limits", "Growing rapidly post-pandemic"], cons: ["Smaller listing volume", "Global talent pool = stiff competition", "Fewer India-specific opportunities", "USD salary roles can be hard to access"], verdict: "Go-to if you want remote roles with international companies.", rating: 3 },
  { name: "HackerEarth", icon: "💻", url: "https://hackerearth.com/jobs", color: "#323754", tag: "Tech Hiring", bestFor: ["tech", "developer", "engineer"], pros: ["Code-first hiring — proves your skills", "Hackathons lead directly to interviews", "Trusted by top tech companies", "Good for competitive programmers", "Bypass resume screening with code scores"], cons: ["Only for technical roles", "Time-intensive (coding challenges)", "Not suitable for non-tech profiles", "Smaller listing count"], verdict: "Best for developers who want to be judged on code, not just resume.", rating: 3 },
  { name: "iimjobs", icon: "🎩", url: "https://iimjobs.com", color: "#C41E3A", tag: "MBA & Management", bestFor: ["management", "finance", "mba", "executive"], pros: ["Premium platform for MBA & management roles", "High-quality vetted listings", "Good for ₹10L+ salary jobs", "Trusted by top companies in India", "Recruiter database is premium"], cons: ["Not suited for freshers or junior roles", "Some features need premium account", "Smaller platform than Naukri/LinkedIn", "Limited tech listings"], verdict: "Essential if you're an MBA grad or mid-senior management professional.", rating: 4 },
  { name: "AngelList India", icon: "👼", url: "https://angel.co/jobs", color: "#E74C3C", tag: "Angel-backed Startups", bestFor: ["startup", "tech", "design", "product"], pros: ["Connects directly with angel-funded startups", "Equity details shown upfront", "Early-stage and Series A opportunities", "Global + India listings", "Founder-direct conversations"], cons: ["Startup risks (instability)", "Many early-stage = lower salary", "Less regulated than corporate listings", "Slow response from some startups"], verdict: "Great for startup equity hunters beyond Wellfound.", rating: 3 },
];

export default function JobsPage({ callAI, form, glassCard, glassBase, glassBtn, glassInput, textPrimary, textSecondary, textMuted, theme, D }) {
  const [aiMatches, setAiMatches] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const getAIMatches = async () => {
    setLoading(true);
    try {
      const raw = await callAI(`Based on this resume profile, rank the following job platforms from most to least suitable. Return ONLY a valid JSON array of platform names in order of recommendation, with a one-line reason for each.

Resume: Name: ${form.name || "N/A"}, Role: ${form.experience?.[0]?.role || "N/A"}, Skills: ${form.skills || "N/A"}, Education: ${form.education?.[0]?.degree || "N/A"}, Location: ${form.location || "India"}

Platforms to rank: ${ALL_PLATFORMS.map(p => p.name).join(", ")}

Return ONLY this JSON (no markdown):
[{"name":"LinkedIn","reason":"One sentence why this suits them","score":95},...]
Include all ${ALL_PLATFORMS.length} platforms with a score 0-100.`);

      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      const matchMap = {};
      parsed.forEach(p => { matchMap[p.name] = { reason: p.reason, score: p.score }; });
      setAiMatches(matchMap);
    } catch (e) {
      // silently fail — show all platforms without AI ranking
    }
    setLoading(false);
  };

  const accent = `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`;

  const sorted = aiMatches
    ? [...ALL_PLATFORMS].sort((a, b) => (aiMatches[b.name]?.score || 0) - (aiMatches[a.name]?.score || 0))
    : ALL_PLATFORMS;

  const displayed = showAll ? sorted : sorted.slice(0, 6);

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", zIndex: 1, position: "relative" }}>
      {/* Header */}
      <div className="animate-fade-in-down" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "6px", letterSpacing: "-0.5px" }}>Job Platforms</h2>
          <p style={{ fontSize: "14px", color: textSecondary, margin: 0 }}>Curated job boards with AI-matched recommendations for your profile</p>
        </div>
        
        {!aiMatches ? (
          <button onClick={getAIMatches} disabled={loading} className={loading ? "btn-glass" : "btn-premium animate-pulse-glow"} style={{ padding: "12px 24px", fontSize: "14px", fontWeight: "700", background: loading ? "transparent" : accent, color: loading ? textMuted : (D ? "#0c0a08" : "#fff"), borderRadius: "100px", border: "none", cursor: loading ? "not-allowed" : "pointer", flexShrink: 0, display: "flex", alignItems: "center", gap: "8px", boxShadow: loading ? "none" : `0 8px 16px ${theme.accent1}40` }}>
            {loading ? (
              <><span className="spinner" style={{ display: "inline-block", width: "16px", height: "16px", border: `2px solid ${textMuted}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Analyzing Profile...</>
            ) : "🤖 Generate AI Match"}
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "100px", background: "rgba(76,175,125,0.15)", border: "1px solid rgba(76,175,125,0.3)" }}>
              <span style={{ fontSize: "14px" }}>✨</span>
              <span style={{ fontSize: "12px", color: D ? "#7dcfa0" : "#2e7d52", fontWeight: "800", letterSpacing: "0.05em", textTransform: "uppercase" }}>AI Ranked</span>
            </div>
            <button onClick={() => setAiMatches(null)} className="btn-glass" style={{ padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: textMuted, borderRadius: "100px" }}>Reset</button>
          </div>
        )}
      </div>

      {form.name && (
        <div className="animate-fade-in-up delay-1" style={{ padding: "16px 20px", borderRadius: "16px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "14px" }}>
            {form.name[0]?.toUpperCase()}
          </div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: textMuted }}>Targeting profile:</span>
            <span style={{ fontSize: "14px", fontWeight: "700", color: textPrimary }}>{form.name}</span>
            {form.experience?.[0]?.role && <><span style={{ fontSize: "14px", color: textMuted }}>·</span><span style={{ fontSize: "13px", color: textSecondary, fontWeight: "500" }}>{form.experience[0].role}</span></>}
            {form.skills && <><span style={{ fontSize: "14px", color: textMuted }}>·</span><span style={{ fontSize: "13px", color: textSecondary }}>{form.skills.split(",").slice(0, 3).join(", ")}</span></>}
          </div>
        </div>
      )}

      {/* Platform cards */}
      <div className="animate-fade-in-up delay-2" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {displayed.map((p, idx) => {
          const match = aiMatches?.[p.name];
          const isOpen = expanded === p.name;
          const rank = aiMatches ? idx + 1 : null;
          
          return (
            <div key={p.name} className="card-hover-lift glass-panel" style={{ overflow: "hidden", position: "relative", padding: 0, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", border: `1px solid ${isOpen ? (D ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)") : (D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")}`, boxShadow: isOpen ? "0 12px 40px rgba(0,0,0,0.15)" : undefined }}>
              {/* Left accent */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: p.color }} />

              <div style={{ padding: "20px 24px 20px 28px" }}>
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: "200px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0, border: `1px solid ${p.color}30` }}>
                      {p.icon}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <span style={{ fontSize: "18px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, letterSpacing: "-0.3px" }}>{p.name}</span>
                        <span style={{ fontSize: "10px", fontWeight: "800", padding: "4px 8px", borderRadius: "100px", background: p.color + "15", color: p.color, border: `1px solid ${p.color}40`, letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.tag}</span>
                        
                        {rank && rank <= 3 && (
                          <div className="animate-pulse-glow" style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "100px", background: `linear-gradient(135deg, ${theme.accent1}20, ${theme.accent2}20)`, border: `1px solid ${theme.accent1}40` }}>
                            <span style={{ fontSize: "12px" }}>🏆</span>
                            <span style={{ fontSize: "10px", fontWeight: "800", color: theme.accent1, letterSpacing: "0.05em", textTransform: "uppercase" }}>Top Pick</span>
                          </div>
                        )}
                      </div>
                      
                      {match?.reason ? (
                        <p style={{ fontSize: "13px", color: textSecondary, margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ color: theme.accent1 }}>🤖</span> {match.reason}
                        </p>
                      ) : (
                        <p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>
                          Best for: <span style={{ color: textSecondary }}>{p.bestFor.join(", ")}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                    {/* Score/Rating */}
                    {match ? (
                      <div className="animate-fade-in-scale" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "52px", height: "52px", borderRadius: "50%", background: match.score >= 80 ? "rgba(76,175,125,0.1)" : match.score >= 60 ? `${theme.accent1}10` : "rgba(180,180,180,0.05)", border: `2px solid ${match.score >= 80 ? "rgba(76,175,125,0.4)" : match.score >= 60 ? theme.accent1 + "60" : "rgba(180,180,180,0.2)"}` }}>
                        <span style={{ fontSize: "16px", fontWeight: "800", fontFamily: "var(--font-display)", color: match.score >= 80 ? (D ? "#7dcfa0" : "#2e7d52") : match.score >= 60 ? theme.accent1 : textMuted, lineHeight: 1 }}>{match.score}</span>
                        <span style={{ fontSize: "8px", fontWeight: "700", color: textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "2px" }}>Match</span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "4px", padding: "8px 12px", borderRadius: "100px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                        {[1,2,3,4,5].map(i => <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i <= p.rating ? p.color : (D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"), transition: "all 0.2s" }} />)}
                      </div>
                    )}
                    
                    <button onClick={() => setExpanded(isOpen ? null : p.name)} className="btn-glass" style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontSize: "12px", color: textSecondary, borderRadius: "12px" }}>
                      {isOpen ? "▲" : "▼"}
                    </button>
                    
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn-premium" style={{ padding: "10px 20px", fontSize: "13px", fontWeight: "700", color: "#fff", background: p.color, borderRadius: "12px", textDecoration: "none", display: "inline-block", cursor: "pointer", border: "none" }}>
                      Apply ↗
                    </a>
                  </div>
                </div>

                {/* Expanded Sections */}
                {isOpen && (
                  <div className="animate-fade-in-down" style={{ marginTop: "20px", paddingTop: "20px", borderTop: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                      <div style={{ padding: "16px", borderRadius: "16px", background: D ? "rgba(76,175,125,0.05)" : "rgba(76,175,125,0.03)", border: "1px solid rgba(76,175,125,0.15)" }}>
                        <p style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: D ? "#7dcfa0" : "#2e7d52", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "14px" }}>✓</span> Why it's great
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {p.pros.map((pro, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                              <span style={{ color: D ? "#7dcfa0" : "#2e7d52", fontSize: "10px", marginTop: "4px" }}>●</span>
                              <p style={{ fontSize: "13px", color: textSecondary, margin: 0, lineHeight: 1.5 }}>{pro}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div style={{ padding: "16px", borderRadius: "16px", background: D ? "rgba(224,92,92,0.05)" : "rgba(224,92,92,0.03)", border: "1px solid rgba(224,92,92,0.15)" }}>
                        <p style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: D ? "#f08080" : "#b03030", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "14px" }}>✕</span> Things to note
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {p.cons.map((con, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                              <span style={{ color: D ? "#f08080" : "#b03030", fontSize: "10px", marginTop: "4px" }}>●</span>
                              <p style={{ fontSize: "13px", color: textSecondary, margin: 0, lineHeight: 1.5 }}>{con}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ padding: "16px", borderRadius: "16px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <span style={{ fontSize: "20px" }}>💡</span>
                      <div>
                        <p style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, margin: "0 0 4px" }}>The Verdict</p>
                        <p style={{ fontSize: "14px", color: textPrimary, margin: 0, lineHeight: 1.5 }}>{p.verdict}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more/less */}
      {sorted.length > 6 && (
        <button onClick={() => setShowAll(s => !s)} className="btn-glass animate-fade-in-up delay-3" style={{ width: "100%", padding: "16px", fontSize: "14px", fontWeight: "600", color: textSecondary, borderRadius: "16px", marginTop: "24px", cursor: "pointer", border: `1px solid ${D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}>
          {showAll ? "▲ Show less platforms" : `▼ Show all ${sorted.length} platforms`}
        </button>
      )}

      {/* Strategic Tip */}
      <div className="card-hover-lift animate-fade-in-up delay-3 glass-panel" style={{ padding: "24px", marginTop: "32px", border: `1px solid ${theme.accent1}40`, background: `linear-gradient(135deg, ${theme.accent1}05, ${theme.accent2}05)` }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${theme.accent1}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
            ⚡
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, margin: "0 0 6px" }}>The Power Strategy</h3>
            <p style={{ fontSize: "14px", color: textSecondary, margin: 0, lineHeight: 1.6 }}>
              Apply on <strong style={{ color: textPrimary }}>LinkedIn + Naukri</strong> for broad India coverage, <strong style={{ color: textPrimary }}>Wellfound</strong> for high-growth startup equity, and <strong style={{ color: textPrimary }}>Remotive</strong> for remote global roles. Always research the company on Glassdoor before your first interview.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
