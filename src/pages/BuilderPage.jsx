import { useState } from "react";
import { GInput, GTextarea, GSection, liquidGlass, liquidGlassDark } from "../components/GlassUI";
import AdBanner from "../components/AdBanner";
import AIExtras from "../components/AIExtras";
import { PRO_TEMPLATES } from "../constants/themes";

const BuilderPage = ({
  form, setForm, template, setTemplate, allTemplates,
  glassCard, glassBtn, glassInput, textPrimary, textSecondary, textMuted,
  theme, D, isPro, page, setPage,
  loading, generateAI, aiGenerated,
  scoreLoading, analyzeResume,
  canGenerate, callAI,
  fileImporting, fileImportDone, fileImportError, handleFileImport,
}) => {
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const updateEdu = (i, f, v) => { const a = [...form.education]; a[i][f] = v; setForm(p => ({ ...p, education: a })); };
  const updateExp = (i, f, v) => { const a = [...form.experience]; a[i][f] = v; setForm(p => ({ ...p, experience: a })); };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 380px)", gap: "40px", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* FILE IMPORT */}
        <div className="animate-fade-in-up delay-1">
          <GSection glassCard={{ ...glassCard, padding: "32px", border: `1px solid ${theme.accent1}30` }} textMuted={textMuted} title={<span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800", color: textPrimary }}><span>📎</span> Import Resume</span>}>
            <p style={{ fontSize: "14px", color: textSecondary, marginBottom: "20px", lineHeight: 1.6 }}>Upload an existing resume (PDF or image). Our AI will extract your details instantly.</p>
            <label style={{ display: "block", cursor: "pointer" }} className="card-hover-lift">
              <div style={{ ...glassCard, borderRadius: "24px", padding: "40px 24px", textAlign: "center", border: `2px dashed ${D ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`, background: D ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)", transition: "all 0.3s" }}>
                {fileImporting ? (
                  <div className="animate-pulse">
                    <p className="animate-float" style={{ fontSize: "36px", marginBottom: "16px" }}>🔍</p>
                    <p style={{ fontSize: "16px", fontWeight: "800", color: textPrimary, marginBottom: "8px" }}>Scanning your document...</p>
                    <p style={{ fontSize: "14px", color: textMuted }}>Extracting your career history and skills.</p>
                  </div>
                ) : fileImportDone ? (
                  <div className="animate-fade-in-scale">
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(76,175,125,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "1px solid rgba(76,175,125,0.3)" }}>
                      <p className="animate-float" style={{ fontSize: "32px", margin: 0 }}>✅</p>
                    </div>
                    <p style={{ fontSize: "18px", fontWeight: "800", color: D ? "#7dcfa0" : "#2e7d52", marginBottom: "8px" }}>Successfully Imported!</p>
                    <p style={{ fontSize: "14px", color: textMuted }}>Review and modify the extracted details below.</p>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <div style={{ width: "72px", height: "72px", borderRadius: "24px", background: `linear-gradient(135deg, ${theme.accent1}15, ${theme.accent2}10)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: `1px solid ${theme.accent1}30` }}>
                       <p className="animate-float" style={{ fontSize: "32px", margin: 0 }}>📄</p>
                    </div>
                    <p style={{ fontSize: "18px", fontWeight: "800", color: textPrimary, marginBottom: "8px" }}>Drop PDF or Image here</p>
                    <p style={{ fontSize: "14px", color: textMuted }}>Click to browse your files (Max 5MB)</p>
                  </div>
                )}
              </div>
              <input type="file" accept=".pdf,image/*" onChange={handleFileImport} style={{ display: "none" }} />
            </label>
            {fileImportError && <p className="animate-fade-in-down" style={{ fontSize: "14px", color: D ? "#f08080" : "#b03030", marginTop: "16px", textAlign: "center", fontWeight: "600", padding: "12px", background: "rgba(240,128,128,0.1)", borderRadius: "12px", border: "1px solid rgba(240,128,128,0.2)" }}>{fileImportError}</p>}
          </GSection>
        </div>

        <div className="animate-fade-in-up delay-2">
          <GSection glassCard={{ ...glassCard, padding: "32px" }} textMuted={textMuted} title={<span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800", color: textPrimary }}><span>🎨</span> Choose Template</span>}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
              {allTemplates.map(t => {
                const locked = PRO_TEMPLATES.includes(t) && !isPro;
                const active = template === t;
                return (
                  <button key={t} onClick={() => locked ? setPage("upgrade") : setTemplate(t)}
                    className={active ? "btn-premium" : "btn-glass"}
                    style={{
                      padding: "10px 24px", fontSize: "14px", fontWeight: active ? "800" : "600", borderRadius: "100px",
                      background: active ? `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})` : locked ? (D ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)") : (D ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"),
                      color: active ? (D ? "#0c0a08" : "#fff") : locked ? textMuted : textSecondary,
                      border: active ? "none" : `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                      boxShadow: active ? `0 8px 16px ${theme.accent1}40` : "none",
                      transition: "all 0.2s"
                    }}>
                    {t}{locked ? " 🔒" : ""}
                  </button>
                );
              })}
            </div>
          </GSection>
        </div>

        <div className="animate-fade-in-up delay-3">
          <GSection glassCard={{ ...glassCard, padding: "32px" }} textMuted={textMuted} title={<span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800", color: textPrimary }}><span>👤</span> Personal Info</span>}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "16px" }}>
              <GInput isDark={D} label="Full Name" textMuted={textMuted} inputStyle={{...glassInput, padding: "14px 16px", borderRadius: "12px"}} placeholder="E.g. Jane Doe" value={form.name} onChange={e => update("name", e.target.value)} />
              <GInput isDark={D} label="Email Address" textMuted={textMuted} inputStyle={{...glassInput, padding: "14px 16px", borderRadius: "12px"}} placeholder="jane@example.com" value={form.email} onChange={e => update("email", e.target.value)} />
              <GInput isDark={D} label="Phone Number" textMuted={textMuted} inputStyle={{...glassInput, padding: "14px 16px", borderRadius: "12px"}} placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => update("phone", e.target.value)} />
              <GInput isDark={D} label="Location" textMuted={textMuted} inputStyle={{...glassInput, padding: "14px 16px", borderRadius: "12px"}} placeholder="San Francisco, CA" value={form.location} onChange={e => update("location", e.target.value)} />
            </div>
            <div style={{ marginTop: "20px" }}>
              <GInput isDark={D} label="LinkedIn Profile" textMuted={textMuted} inputStyle={{...glassInput, padding: "14px 16px", borderRadius: "12px"}} placeholder="linkedin.com/in/janedoe" value={form.linkedin} onChange={e => update("linkedin", e.target.value)} />
            </div>
          </GSection>
        </div>

        {/* PHOTO UPLOAD */}
        <div className="animate-fade-in-up delay-4">
          <GSection glassCard={{ ...glassCard, padding: "32px" }} textMuted={textMuted} title={<span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800", color: textPrimary }}><span>📷</span> Profile Photo <span style={{ fontSize: "12px", fontWeight: "normal", color: textMuted }}>(Optional)</span></span>}
            action={form.photo ? <button onClick={() => update("photo", "")} className="btn-glass" style={{ fontSize: "13px", color: D ? "#f08080" : "#b03030", background: "rgba(240,128,128,0.1)", padding: "8px 16px", borderRadius: "100px", border: "1px solid rgba(240,128,128,0.2)", cursor: "pointer", fontWeight: "700", transition: "all 0.2s" }}>✕ Remove</button> : null}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "16px" }}>
              {/* Preview */}
              <div className="card-hover-lift" style={{ width: "96px", height: "96px", borderRadius: "50%", flexShrink: 0, overflow: "hidden", border: `4px solid ${form.photo ? theme.accent1 : (D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")}`, background: D ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: form.photo ? `0 8px 32px ${theme.accent1}40` : "none", transition: "all 0.3s" }}>
                {form.photo
                  ? <img src={form.photo} alt="Profile" className="animate-fade-in-scale" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: "40px", opacity: 0.2 }}>👤</span>}
              </div>
              {/* Upload area */}
              <div style={{ flex: 1 }}>
                <label style={{ cursor: "pointer", display: "block" }}>
                  <div className="btn-glass" style={{ borderRadius: "20px", padding: "20px", border: `2px dashed ${D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, textAlign: "center", background: D ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}>
                    {form.photo
                      ? <><p style={{ fontSize: "15px", fontWeight: "800", color: D ? "#7dcfa0" : "#2e7d52", margin: "0 0 4px" }}>✅ Photo uploaded</p><p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>Click to replace</p></>
                      : <><p style={{ fontSize: "15px", fontWeight: "700", color: textPrimary, margin: "0 0 4px" }}>Upload professional photo</p><p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>Max 2MB (JPG, PNG)</p></>}
                  </div>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 2 * 1024 * 1024) { alert("Please use an image under 2MB."); return; }
                    const reader = new FileReader();
                    reader.onload = ev => update("photo", ev.target.result);
                    reader.readAsDataURL(file);
                    e.target.value = "";
                  }} />
                </label>
              </div>
            </div>
            <p style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "13px", color: textSecondary, marginTop: "20px", padding: "12px 16px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", borderRadius: "12px", border: `1px solid ${D ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
              <span style={{ fontSize: "16px" }}>💡</span> <span>Photos are common in the EU & Asia, but <strong>not recommended</strong> for US/UK roles to avoid bias.</span>
            </p>
          </GSection>
        </div>

        <div className="animate-fade-in-up delay-5">
          <GSection glassCard={{ ...glassCard, padding: "32px" }} textMuted={textMuted} title={<span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800", color: textPrimary }}><span>🎓</span> Education</span>} action={<button onClick={() => setForm(p => ({ ...p, education: [...p.education, { degree: "", school: "", year: "" }] }))} className="btn-premium" style={{ fontSize: "13px", color: D ? "#0c0a08" : "#fff", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, padding: "8px 16px", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "800", boxShadow: `0 4px 16px ${theme.accent1}40` }}>+ Add Degree</button>}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
              {form.education.map((e, i) => (
                <div key={i} className="animate-fade-in" style={{ padding: "24px", background: D ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px solid ${D ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, borderRadius: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => { const edus = [...form.education]; edus.splice(i, 1); setForm(p => ({ ...p, education: edus })) }} style={{ background: "transparent", border: "none", color: D ? "#f08080" : "#b03030", cursor: "pointer", fontSize: "16px" }}>✕</button>
                  </div>
                  <GInput isDark={D} label="Degree / Field of Study" textMuted={textMuted} inputStyle={{...glassInput, padding: "14px 16px", borderRadius: "12px"}} placeholder="E.g. B.S. in Computer Science" value={e.degree} onChange={ev => updateEdu(i, "degree", ev.target.value)} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "16px", marginTop: "16px" }}>
                    <GInput isDark={D} label="University / School" textMuted={textMuted} inputStyle={{...glassInput, padding: "14px 16px", borderRadius: "12px"}} placeholder="Stanford University" value={e.school} onChange={ev => updateEdu(i, "school", ev.target.value)} />
                    <GInput isDark={D} label="Grad Year" textMuted={textMuted} inputStyle={{...glassInput, padding: "14px 16px", borderRadius: "12px"}} placeholder="2024" value={e.year} onChange={ev => updateEdu(i, "year", ev.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </GSection>
        </div>

        <div className="animate-fade-in-up delay-6">
          <GSection glassCard={{ ...glassCard, padding: "32px" }} textMuted={textMuted} title={<span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800", color: textPrimary }}><span>💼</span> Work Experience</span>} action={<button onClick={() => setForm(p => ({ ...p, experience: [...p.experience, { role: "", company: "", duration: "", desc: "" }] }))} className="btn-premium" style={{ fontSize: "13px", color: D ? "#0c0a08" : "#fff", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, padding: "8px 16px", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "800", boxShadow: `0 4px 16px ${theme.accent1}40` }}>+ Add Role</button>}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
              {form.experience.map((e, i) => (
                <div key={i} className="animate-fade-in" style={{ padding: "24px", background: D ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px solid ${D ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, borderRadius: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                    <button onClick={() => { const exps = [...form.experience]; exps.splice(i, 1); setForm(p => ({ ...p, experience: exps })) }} style={{ background: "transparent", border: "none", color: D ? "#f08080" : "#b03030", cursor: "pointer", fontSize: "16px" }}>✕</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <GInput isDark={D} label="Job Title" textMuted={textMuted} inputStyle={{...glassInput, padding: "14px 16px", borderRadius: "12px"}} placeholder="Senior Software Engineer" value={e.role} onChange={ev => updateExp(i, "role", ev.target.value)} />
                    <GInput isDark={D} label="Company Name" textMuted={textMuted} inputStyle={{...glassInput, padding: "14px 16px", borderRadius: "12px"}} placeholder="Google" value={e.company} onChange={ev => updateExp(i, "company", ev.target.value)} />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <GInput isDark={D} label="Duration" textMuted={textMuted} inputStyle={{...glassInput, padding: "14px 16px", borderRadius: "12px"}} placeholder="Jan 2022 – Present" value={e.duration} onChange={ev => updateExp(i, "duration", ev.target.value)} />
                  </div>
                  <GTextarea isDark={D} label="Responsibilities / Achievements" textMuted={textMuted} inputStyle={{...glassInput, padding: "16px", borderRadius: "12px", minHeight: "100px"}} placeholder="Summarize your impact. AI will improve and formulate bullet points." value={e.desc} onChange={ev => updateExp(i, "desc", ev.target.value)} rows={4} />
                </div>
              ))}
            </div>
          </GSection>
        </div>

        <div className="animate-fade-in-up delay-7">
          <GSection glassCard={{ ...glassCard, padding: "32px" }} textMuted={textMuted} title={<span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800", color: textPrimary }}><span>⚡</span> Skills</span>}>
            <div style={{ marginTop: "16px" }}>
              <GInput isDark={D} label="Core Skills & Technologies" textMuted={textMuted} inputStyle={{...glassInput, padding: "14px 16px", borderRadius: "12px"}} placeholder="E.g. Python, React, JavaScript, AWS" defaultValue={form.skills} onBlur={e => update("skills", e.target.value)} onChange={e => update("skills", e.target.value)} />
              <p style={{ fontSize: "12px", color: textMuted, marginTop: "8px", fontWeight: "600" }}>Separate multiple skills with commas.</p>
            </div>
          </GSection>
        </div>

      </div>

      {/* Right Sidebar - Sticky Actions & Preview */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "sticky", top: "100px" }}>
        
        <div className="animate-fade-in-up delay-8">
          {!canGenerate() && (
            <div className="animate-pulse-glow" style={{ ...glassCard, padding: "24px", marginBottom: "24px", background: D ? "rgba(224,92,92,0.1)" : "rgba(224,92,92,0.05)", border: `1px solid rgba(224,92,92,0.2)`, textAlign: "center" }}>
              <p style={{ fontSize: "16px", fontWeight: "800", color: D ? "#ff8a8a" : "#d32f2f", marginBottom: "8px" }}>🎯 Daily Limit Reached</p>
              <p style={{ fontSize: "13px", color: textSecondary, lineHeight: 1.5 }}>Upgrade to Pro for unlimited AI generation and premium features.</p>
            </div>
          )}

          <div className="card-hover-lift" style={{ ...glassCard, padding: "24px", background: `linear-gradient(135deg, ${theme.accent1}10, transparent)`, border: `1px solid ${theme.accent1}30`, marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: textPrimary, margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>✨ AI Optimization</h3>
            <p style={{ fontSize: "14px", color: textSecondary, marginBottom: "20px", lineHeight: 1.6 }}>Let our AI rewrite your experience and summary into powerful, ATS-friendly statements.</p>
            
            <button 
              onClick={generateAI} 
              disabled={loading} 
              className={loading ? "btn-glass" : "btn-premium animate-pulse-glow"} 
              style={{ 
                width: "100%", 
                padding: "18px", 
                fontSize: "16px", 
                fontWeight: "800",
                background: loading ? "transparent" : `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, 
                color: loading ? textMuted : (D ? "#0c0a08" : "#fff"), 
                borderRadius: "16px", 
                border: loading ? `1px solid ${D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: loading ? "none" : `0 8px 24px ${theme.accent1}40`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}>
              {loading ? (
                 <><span className="spinner" style={{ display: "inline-block", width: "18px", height: "18px", border: `2px solid ${textMuted}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Optimizing...</>
              ) : "Enhance with AI ✨"}
            </button>

            {aiGenerated && (
              <div className="animate-fade-in-down" style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(76,175,125,0.1)", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(76,175,125,0.2)" }}>
                  <span style={{ fontSize: "16px" }}>✅</span>
                  <span style={{ color: D ? "#7dcfa0" : "#2e7d52", fontSize: "13px", fontWeight: "700" }}>Successfully enhanced!</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button onClick={() => setPage("preview")} className="btn-glass flex-1" style={{ padding: "16px", fontSize: "15px", fontWeight: "700", color: textPrimary, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flex: 1 }}>
              <span>👁</span> Preview
            </button>
            <button onClick={analyzeResume} disabled={scoreLoading} className="btn-glass flex-1" style={{ padding: "16px", fontSize: "15px", fontWeight: "700", borderRadius: "16px", background: scoreLoading ? "transparent" : (D ? "rgba(224,92,92,0.1)" : "rgba(224,92,92,0.05)"), color: scoreLoading ? textMuted : (D ? "#ff8a8a" : "#d32f2f"), border: `1px solid ${D ? "rgba(224,92,92,0.2)" : "rgba(224,92,92,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flex: 1 }}>
              {scoreLoading ? <><span className="spinner" style={{ display: "inline-block", width: "14px", height: "14px", border: `2px solid ${textMuted}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Scanning</> : <><span>🎯</span> ATS Scan</>}
            </button>
          </div>
          
          <AIExtras
            page={page} setPage={setPage} callAI={callAI} form={form} setForm={setForm}
            glassCard={{ ...glassCard, padding: "24px" }} glassBase={glassCard} glassBtn={glassBtn} glassInput={glassInput}
            textPrimary={textPrimary} textSecondary={textSecondary} textMuted={textMuted} theme={theme} D={D}
          />

          {!isPro && <div style={{ marginTop: "24px" }}><AdBanner isDark={D} /></div>}
        </div>

        {/* Live Mini-Preview */}
        <div className="desktop-preview animate-fade-in delay-6">
          <div style={{ ...glassCard, padding: "24px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: `linear-gradient(90deg, ${theme.accent1}, ${theme.accent2})` }} />
            <p style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", color: textMuted, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: theme.accent1, animation: "pulseGlowing 2s infinite" }} /> Live Preview
            </p>
            <div className="animate-fade-in" style={{ transform: "scale(0.65)", transformOrigin: "top left", width: "153%", pointerEvents: "none", background: "#fff", padding: "40px", borderRadius: "16px", boxShadow: "0 12px 32px rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.05)" }}>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111", margin: "0 0 8px", fontFamily: "var(--font-display)" }}>{form.name || "Your Name"}</h1>
              <div style={{ fontSize: "13px", color: "#666", marginBottom: "24px", fontWeight: "500" }}>
                <span>{form.email || "email@example.com"}</span>
                {form.phone && <span> • {form.phone}</span>}
                {form.location && <span> • {form.location}</span>}
              </div>
              
              {form.summary && (
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: theme.accent1, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", borderBottom: "1px solid #eee", paddingBottom: "4px" }}>Professional Summary</div>
                  <p style={{ fontSize: "13px", color: "#444", lineHeight: 1.6, margin: 0 }}>{form.summary.substring(0,300)}{form.summary.length > 300 ? "..." : ""}</p>
                </div>
              )}
              
              {form.experience[0]?.role && (
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: theme.accent1, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", borderBottom: "1px solid #eee", paddingBottom: "4px" }}>Experience</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                    <p style={{ fontSize: "15px", fontWeight: "800", color: "#111", margin: 0 }}>{form.experience[0].role}</p>
                    <span style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>{form.experience[0].duration}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: theme.accent2, fontWeight: "600", margin: "0 0 8px" }}>{form.experience[0].company}</p>
                  <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.5, margin: 0 }}>{form.experience[0].desc?.substring(0,200)}{form.experience[0].desc?.length > 200 ? "..." : ""}</p>
                </div>
              )}
              
              {form.skills && (
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: theme.accent1, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", borderBottom: "1px solid #eee", paddingBottom: "4px" }}>Skills</div>
                  <div style={{ fontSize: "13px", color: "#444", lineHeight: 1.6 }}>{form.skills.split(',').map(s=>s.trim()).filter(Boolean).slice(0, 15).join(" • ")}</div>
                </div>
              )}
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100px", background: "linear-gradient(transparent, rgba(255,255,255,0.9))", pointerEvents: "none", borderRadius: "0 0 24px 24px" }} />
          </div>
        </div>

      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .flex-1 { flex: 1; }
      `}</style>
    </div>
  );
};

export default BuilderPage;
