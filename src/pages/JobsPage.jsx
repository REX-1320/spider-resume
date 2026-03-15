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
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 40px", zIndex: 1, position: "relative" }}>
      {/* Header */}
      <div style={{ ...glassCard, padding: "18px 22px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 17, fontWeight: 800, color: textPrimary, margin: "0 0 4px" }}>🎯 Job Platforms</p>
            <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>Curated job boards with AI-matched recommendations for your profile</p>
          </div>
          {!aiMatches && (
            <button onClick={getAIMatches} disabled={loading} style={{ ...glassBtn, padding: "10px 18px", fontSize: 13, fontWeight: 700, background: loading ? "transparent" : accent, color: loading ? textMuted : (D ? "#1a1410" : "#2d2520"), borderRadius: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", flexShrink: 0 }}>
              {loading ? "🤖 Matching..." : "🤖 AI Match for Me"}
            </button>
          )}
          {aiMatches && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, padding: "4px 10px", borderRadius: 10, background: "rgba(76,175,125,0.15)", color: D ? "#7dcfa0" : "#2e7d52", fontWeight: 700, border: "1px solid rgba(76,175,125,0.3)" }}>✅ AI Ranked</span>
              <button onClick={() => setAiMatches(null)} style={{ ...glassBtn, padding: "5px 10px", fontSize: 11, color: textMuted, borderRadius: 10 }}>Reset</button>
            </div>
          )}
        </div>
        {form.name && (
          <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 12, background: D ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: textMuted }}>Matching for:</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: textPrimary }}>{form.name}</span>
            {form.experience?.[0]?.role && <><span style={{ fontSize: 11, color: textMuted }}>·</span><span style={{ fontSize: 11, color: textSecondary }}>{form.experience[0].role}</span></>}
            {form.skills && <><span style={{ fontSize: 11, color: textMuted }}>·</span><span style={{ fontSize: 11, color: textSecondary }}>{form.skills.split(",").slice(0, 3).join(", ")}</span></>}
          </div>
        )}
      </div>

      {/* Platform cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {displayed.map((p, idx) => {
          const match = aiMatches?.[p.name];
          const isOpen = expanded === p.name;
          const rank = aiMatches ? idx + 1 : null;
          return (
            <div key={p.name} style={{ ...glassCard, overflow: "hidden", position: "relative" }}>
              {/* Left accent */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: p.color, borderRadius: "20px 0 0 20px" }} />

              <div style={{ padding: "16px 18px 16px 22px" }}>
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{p.icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: textPrimary }}>{p.name}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 7, background: p.color + "22", color: p.color, border: `1px solid ${p.color}40`, flexShrink: 0 }}>{p.tag}</span>
                        {rank && rank <= 3 && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 7, background: `${theme.accent1}22`, color: theme.accent1, border: `1px solid ${theme.accent1}44` }}>#{rank} for you</span>}
                      </div>
                      {match?.reason && <p style={{ fontSize: 11, color: theme.accent1, margin: "3px 0 0", fontStyle: "italic" }}>🤖 {match.reason}</p>}
                      {!match && <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0" }}>Best for: {p.bestFor.join(", ")}</p>}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    {/* Score badge */}
                    {match && (
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: match.score >= 80 ? "rgba(76,175,125,0.15)" : match.score >= 60 ? `${theme.accent1}20` : "rgba(180,180,180,0.1)", border: `2px solid ${match.score >= 80 ? "rgba(76,175,125,0.5)" : match.score >= 60 ? theme.accent1 + "80" : "rgba(180,180,180,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: match.score >= 80 ? (D ? "#7dcfa0" : "#2e7d52") : match.score >= 60 ? theme.accent1 : textMuted, lineHeight: 1 }}>{match.score}</span>
                      </div>
                    )}
                    {/* Rating dots */}
                    {!match && (
                      <div style={{ display: "flex", gap: 2 }}>
                        {[1,2,3,4,5].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= p.rating ? p.color : (D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)") }} />)}
                      </div>
                    )}
                    <button onClick={() => setExpanded(isOpen ? null : p.name)} style={{ ...glassBtn, padding: "6px 10px", fontSize: 12, color: textSecondary, borderRadius: 10, cursor: "pointer" }}>
                      {isOpen ? "▲" : "▼"}
                    </button>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ ...glassBtn, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: p.color, border: `1px solid ${p.color}44`, background: `${p.color}11`, borderRadius: 12, textDecoration: "none", display: "inline-block", cursor: "pointer" }}>Apply →</a>
                  </div>
                </div>

                {/* Expanded pros/cons */}
                {isOpen && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                      <div style={{ padding: "10px 12px", borderRadius: 12, background: D ? "rgba(76,175,125,0.08)" : "rgba(76,175,125,0.06)", border: "1px solid rgba(76,175,125,0.2)" }}>
                        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: D ? "#7dcfa0" : "#2e7d52", marginBottom: 7 }}>✓ Pros</p>
                        {p.pros.map((pro, i) => <p key={i} style={{ fontSize: 11, color: textSecondary, margin: "0 0 4px", lineHeight: 1.5 }}>• {pro}</p>)}
                      </div>
                      <div style={{ padding: "10px 12px", borderRadius: 12, background: D ? "rgba(224,92,92,0.08)" : "rgba(224,92,92,0.05)", border: "1px solid rgba(224,92,92,0.18)" }}>
                        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: D ? "#f08080" : "#b03030", marginBottom: 7 }}>✗ Cons</p>
                        {p.cons.map((con, i) => <p key={i} style={{ fontSize: 11, color: textSecondary, margin: "0 0 4px", lineHeight: 1.5 }}>• {con}</p>)}
                      </div>
                    </div>
                    <div style={{ padding: "10px 14px", borderRadius: 12, background: D ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.4)", border: `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)"}` }}>
                      <span style={{ fontSize: 12, color: textSecondary, fontStyle: "italic" }}>💬 {p.verdict}</span>
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
        <button onClick={() => setShowAll(s => !s)} style={{ ...glassBtn, width: "100%", padding: 13, fontSize: 13, color: textSecondary, borderRadius: 14, marginTop: 14, cursor: "pointer" }}>
          {showAll ? `▲ Show less` : `▼ Show all ${sorted.length} platforms`}
        </button>
      )}

      {/* Tip */}
      <div style={{ ...glassCard, padding: "16px 20px", marginTop: 18, textAlign: "center" }}>
        <p style={{ fontSize: 12, color: textSecondary, margin: 0, lineHeight: 1.7 }}>
          💡 <strong style={{ color: textPrimary }}>Power move:</strong> Apply on LinkedIn + Naukri for India coverage, Wellfound for startup equity, and Remotive for remote global roles. Research every company on Glassdoor before your interview.
        </p>
      </div>
    </div>
  );
}
