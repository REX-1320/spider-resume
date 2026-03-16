const ScorePage = ({
  scoreData, scoreLoading, analyzeResume, setPage,
  glassCard, glassBase, glassBtn, textPrimary, textSecondary, textMuted, theme, D,
}) => (
  <div className="animate-fade-in" style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
    
    <div className="animate-fade-in-down" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
      <div>
        <h2 style={{ fontSize: "24px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "4px" }}>Resume Analysis</h2>
        <p style={{ fontSize: "13px", color: textSecondary }}>See how you rank against ATS systems.</p>
      </div>
      <button onClick={() => setPage("builder")} className="btn-glass" style={{ padding: "10px 16px", fontSize: "13px", borderRadius: "14px", color: textSecondary }}>
        ✏️ Edit Resume
      </button>
    </div>

    {!scoreData ? (
      <div className="card-hover-lift" style={{ ...glassCard, padding: "56px 32px", textAlign: "center", border: `1px solid ${D ? "rgba(201,169,110,0.15)" : "rgba(201,169,110,0.2)"}` }}>
        <div className="animate-float" style={{ fontSize: "56px", marginBottom: "20px", filter: "drop-shadow(0 8px 16px rgba(201,169,110,0.2))" }}>🎯</div>
        <p style={{ fontSize: "18px", fontWeight: "800", color: textPrimary, marginBottom: "12px", fontFamily: "var(--font-display)" }}>Your Score Awaits</p>
        <p style={{ fontSize: "14px", color: textSecondary, marginBottom: "32px", maxWidth: "340px", margin: "0 auto 32px", lineHeight: 1.6 }}>Fill your details in the Builder, then tap below to run a deep AI analysis on your resume.</p>
        <button onClick={analyzeResume} disabled={scoreLoading} className={scoreLoading ? "btn-glass" : "btn-premium animate-pulse-glow"} style={{ padding: "16px 32px", fontSize: "15px", color: scoreLoading ? textMuted : (D ? "#0c0a08" : "#fff"), background: scoreLoading ? "transparent" : `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, borderRadius: "16px", border: "none", boxShadow: scoreLoading ? "none" : `0 8px 24px ${theme.accent1}44` }}>
          {scoreLoading ? "🔍 Scanning..." : "🎯 Run AI Analysis"}
        </button>
      </div>
    ) : (
      <>
        <div className="animate-fade-in-up delay-1 card-hover-lift" style={{ ...glassCard, padding: "32px 24px", marginBottom: "20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          {/* Animated background glow based on score */}
          <div className="animate-pulse" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "100%", background: `radial-gradient(circle, ${scoreData.overallScore >= 80 ? "#7dcfa0" : scoreData.overallScore >= 60 ? theme.accent1 : "#f08080"}15 0%, transparent 60%)`, pointerEvents: "none", zIndex: 0 }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: textMuted, marginBottom: "24px" }}>Overall ATS Score</p>
            <div style={{ position: "relative", width: "160px", height: "160px", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="160" height="160" style={{ position: "absolute", transform: "rotate(-90deg)", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}>
                <circle cx="80" cy="80" r="70" fill="none" stroke={D ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"} strokeWidth="12" />
                <circle className="animate-progress" cx="80" cy="80" r="70" fill="none" 
                  stroke={scoreData.overallScore >= 80 ? (D ? "#7dcfa0" : "#4caf7d") : scoreData.overallScore >= 60 ? `url(#gold-gradient)` : (D ? "#f08080" : "#e05c5c")} 
                  strokeWidth="12" strokeLinecap="round" 
                  strokeDasharray={`${2 * Math.PI * 70}`} 
                  strokeDashoffset={0} 
                  style={{ "--progress-offset": `${2 * Math.PI * 70 * (1 - scoreData.overallScore / 100)}` }}
                />
                <defs>
                  <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={theme.accent1} />
                    <stop offset="100%" stopColor={theme.accent2} />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "48px", fontWeight: "900", fontFamily: "var(--font-display)", color: scoreData.overallScore >= 80 ? (D ? "#7dcfa0" : "#2e7d52") : scoreData.overallScore >= 60 ? theme.accent1 : (D ? "#f08080" : "#b03030"), lineHeight: 1, letterSpacing: "-1px" }}>{scoreData.overallScore}</span>
                <span style={{ fontSize: "14px", color: textMuted, fontWeight: "600" }}>/ 100</span>
              </div>
            </div>
            <p style={{ fontSize: "15px", color: textPrimary, fontStyle: "italic", marginBottom: "24px", fontWeight: "500", fontFamily: "var(--font-body)" }}>"{scoreData.verdict}"</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {[
                ["ATS Match", scoreData.atsScore, "🤖"], 
                ["Content Impact", scoreData.contentScore, "📝"], 
                ["Format & Design", scoreData.formatScore, "✨"]
              ].map(([label, score, icon], i) => (
                <div key={label} className="animate-fade-in-up" style={{ ...glassBase, borderRadius: "16px", padding: "16px 10px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", animationDelay: `${0.2 + i * 0.1}s` }}>
                  <div style={{ fontSize: "20px", marginBottom: "8px" }}>{icon}</div>
                  <div style={{ fontSize: "24px", fontWeight: "900", fontFamily: "var(--font-display)", color: score >= 80 ? (D ? "#7dcfa0" : "#2e7d52") : score >= 60 ? theme.accent1 : (D ? "#f08080" : "#b03030"), marginBottom: "4px" }}>{score}</div>
                  <div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up delay-4" style={{ ...glassCard, padding: "28px", marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: textMuted, marginBottom: "20px" }}>🤖 Deep ATS Checks</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {scoreData.atsChecks.map((check, i) => (
              <div key={i} className="animate-fade-in-left" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", borderRadius: "14px", background: check.pass ? (D ? "rgba(125,207,160,0.08)" : "rgba(46,125,82,0.05)") : (D ? "rgba(240,128,128,0.08)" : "rgba(176,48,48,0.05)"), border: `1px solid ${check.pass ? (D ? "rgba(125,207,160,0.2)" : "rgba(46,125,82,0.15)") : (D ? "rgba(240,128,128,0.2)" : "rgba(176,48,48,0.15)")}`, animationDelay: `${0.4 + i * 0.1}s` }}>
                <span style={{ fontSize: "16px" }}>{check.pass ? "✅" : "❌"}</span>
                <span style={{ fontSize: "14px", color: check.pass ? (D ? "#a0e2bc" : "#1b5e20") : (D ? "#ffb3b3" : "#8e0000"), flex: 1, fontWeight: "500" }}>{check.label}</span>
                <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.06em", padding: "4px 10px", borderRadius: "8px", background: check.pass ? (D ? "rgba(125,207,160,0.2)" : "rgba(46,125,82,0.15)") : (D ? "rgba(240,128,128,0.2)" : "rgba(176,48,48,0.15)"), color: check.pass ? (D ? "#7dcfa0" : "#2e7d52") : (D ? "#f08080" : "#b03030") }}>{check.pass ? "PASS" : "FAIL"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in-up delay-6" style={{ ...glassCard, padding: "28px", marginBottom: "24px", background: D ? `linear-gradient(135deg, rgba(255,255,255,0.02), rgba(201,169,110,0.05))` : `linear-gradient(135deg, rgba(255,255,255,0.4), rgba(201,169,110,0.1))` }}>
          <p style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: textMuted, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>🚀 Actionable Tips <span style={{ fontSize: "14px" }}>✨</span></p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {scoreData.tips.map((tip, i) => (
              <div key={i} className="card-hover-lift" style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "16px", borderRadius: "14px", ...glassBase, background: D ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.4)" }}>
                <div style={{ minWidth: "24px", height: "24px", borderRadius: "50%", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: D ? "#0c0a08" : "#fff", flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: "14px", color: textSecondary, lineHeight: "1.6", paddingTop: "2px" }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in delay-8" style={{ display: "flex", gap: "12px" }}>
          <button onClick={analyzeResume} disabled={scoreLoading} className="btn-glass" style={{ flex: 1, padding: "16px", fontSize: "14px", color: textSecondary, borderRadius: "18px" }}>
            🔄 {scoreLoading ? "Scanning..." : "Re-analyze"}
          </button>
          <button onClick={() => setPage("builder")} className="btn-premium animate-pulse-glow" style={{ flex: 1, padding: "16px", fontSize: "14px", fontWeight: "700", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, color: D ? "#0c0a08" : "#fff", borderRadius: "18px", border: "none", boxShadow: `0 4px 16px ${theme.accent1}44` }}>
            ✏️ Improve Resume
          </button>
        </div>
      </>
    )}
  </div>
);

export default ScorePage;
