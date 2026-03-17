// src/components/DownloadResume.jsx
// Handles PDF (html2pdf), PNG (canvas), DOCX (manual XML), TXT (plain)
import { useState, useRef } from "react";

// Dynamically load html2pdf.js from CDN
function loadHtml2Pdf() {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) { resolve(window.html2pdf); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    s.onload = () => resolve(window.html2pdf);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// Build plain text resume
function buildTxt(form) {
  const line = (n = 60) => "─".repeat(n);
  const lines = [];
  lines.push(form.name || "Your Name");
  const contact = [form.email, form.phone, form.location, form.linkedin].filter(Boolean).join("  |  ");
  if (contact) lines.push(contact);
  lines.push(line());
  if (form.summary) {
    lines.push("\nSUMMARY");
    lines.push(form.summary);
  }
  if (form.experience?.some(e => e.role)) {
    lines.push("\nEXPERIENCE");
    form.experience.filter(e => e.role).forEach(e => {
      lines.push(`\n${e.role}${e.company ? ` | ${e.company}` : ""}${e.duration ? ` | ${e.duration}` : ""}`);
      if (e.desc) lines.push(e.desc);
    });
  }
  if (form.education?.some(e => e.degree)) {
    lines.push("\nEDUCATION");
    form.education.filter(e => e.degree).forEach(e => {
      lines.push(`${e.degree}${e.school ? ` — ${e.school}` : ""}${e.year ? ` (${e.year})` : ""}`);
    });
  }
  if (form.skills) {
    lines.push("\nSKILLS");
    lines.push(form.skills);
  }
  return lines.join("\n");
}

// Build DOCX XML (minimal but valid)
function buildDocx(form) {
  const esc = (s = "") => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const para = (text, opts = {}) => {
    const { bold, size = 22, color = "000000", spacing = 120, caps } = opts;
    return `<w:p><w:pPr><w:spacing w:after="${spacing}"/>${caps?`<w:jc w:val="left"/>`:""}${opts.center?`<w:jc w:val="center"/>`:""}${opts.borderBottom?`<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="888888"/></w:pBdr>`:""}</w:pPr><w:r><w:rPr>${bold?`<w:b/><w:bCs/>`:""}${caps?`<w:caps/>`:""}${size?`<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>`:""}<w:color w:val="${color}"/></w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;
  };
  const blank = () => `<w:p><w:pPr><w:spacing w:after="80"/></w:pPr></w:p>`;
  const sectionHead = (t) => para(t, { bold: true, size: 18, color: "555555", caps: true, borderBottom: true, spacing: 80 });

  let body = "";
  // Name
  body += para(form.name || "Your Name", { bold: true, size: 32, spacing: 60 });
  // Contact
  const contact = [form.email, form.phone, form.location, form.linkedin].filter(Boolean).join("   |   ");
  if (contact) body += para(contact, { size: 18, color: "666666", spacing: 160 });
  // Summary
  if (form.summary) {
    body += sectionHead("SUMMARY");
    body += para(form.summary, { size: 20, color: "333333", spacing: 200 });
    body += blank();
  }
  // Experience
  if (form.experience?.some(e => e.role)) {
    body += sectionHead("EXPERIENCE");
    form.experience.filter(e => e.role).forEach(e => {
      body += para(`${e.role}${e.company ? "  ·  " + e.company : ""}${e.duration ? "  ·  " + e.duration : ""}`, { bold: true, size: 22, spacing: 60 });
      if (e.desc) body += para(e.desc, { size: 20, color: "444444", spacing: 120 });
      body += blank();
    });
  }
  // Education
  if (form.education?.some(e => e.degree)) {
    body += sectionHead("EDUCATION");
    form.education.filter(e => e.degree).forEach(e => {
      body += para(`${e.degree}${e.school ? " — " + e.school : ""}${e.year ? " (" + e.year + ")" : ""}`, { size: 21, spacing: 100 });
    });
    body += blank();
  }
  // Skills
  if (form.skills) {
    body += sectionHead("SKILLS");
    body += para(form.skills, { size: 20, color: "444444", spacing: 100 });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>
<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080"/></w:sectPr>
${body}
</w:body></w:document>`;

  // Build a minimal .docx zip manually using JSZip-style base64
  // We'll use a pre-built minimal docx structure
  return xml;
}

// Simple ZIP builder for DOCX (no external lib needed)
async function downloadDocx(form, filename) {
  // Use docx-like approach: create a Blob with the XML wrapped in a minimal zip
  // We'll use the jszip CDN
  await new Promise((res, rej) => {
    if (window.JSZip) { res(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });

  const zip = new window.JSZip();
  const xml = buildDocx(form);

  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  zip.file("word/document.xml", xml);
  zip.file("word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`);

  const blob = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const FORMATS = [
  { id: "pdf",  icon: "📄", label: "PDF",  desc: "Best for most jobs",       color: "#E53935" },
  { id: "docx", icon: "📝", label: "Word", desc: "Required by many portals",  color: "#1565C0" },
  { id: "png",  icon: "🖼️", label: "PNG",  desc: "Share as image",            color: "#6A1B9A" },
  { id: "txt",  icon: "📃", label: "TXT",  desc: "Max ATS compatibility",     color: "#2E7D32" },
];

export default function DownloadResume({ form, glassCard, glassBase, glassBtn, textPrimary, textSecondary, textMuted, theme, D }) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [toast, setToast] = useState("");

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const accent = `linear-gradient(135deg, ${theme.accent1}cc, ${theme.accent2}bb)`;
  const fname = (ext) => `${(form.name || "resume").replace(/\s+/g, "_")}_resume.${ext}`;

  const download = async (fmt) => {
    setDownloading(fmt);
    try {
      if (fmt === "pdf") {
        const el = document.getElementById("resume-printable");
        if (!el) { notify("❌ Resume preview not found — go to Preview tab first."); setDownloading(null); return; }
        const h2p = await loadHtml2Pdf();
        await h2p().set({
          margin: [10, 10, 10, 10],
          filename: fname("pdf"),
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        }).from(el).save();
        notify("✅ PDF downloaded!");

      } else if (fmt === "docx") {
        await downloadDocx(form, fname("docx"));
        notify("✅ Word document downloaded!");

      } else if (fmt === "png") {
        const el = document.getElementById("resume-printable");
        if (!el) { notify("❌ Resume preview not found — go to Preview tab first."); setDownloading(null); return; }
        // Load html2canvas
        await new Promise((res, rej) => {
          if (window.html2canvas) { res(); return; }
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
        const canvas = await window.html2canvas(el, { scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff" });
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url; a.download = fname("png");
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        notify("✅ PNG image downloaded!");

      } else if (fmt === "txt") {
        const txt = buildTxt(form);
        const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = fname("txt");
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        notify("✅ TXT file downloaded!");
      }
    } catch (e) {
      console.error(e);
      notify(`❌ Download failed — ${e.message || "try again"}`);
    }
    setDownloading(null);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", width: "100%", zIndex: 10 }}>
      {/* Toast */}
      {toast && (
        <div className="animate-fade-in-down" style={{ position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: D ? "rgba(20,20,30,0.96)" : "rgba(255,255,255,0.96)", border: `1px solid ${theme.accent1}40`, borderRadius: "100px", padding: "12px 24px", fontSize: "14px", fontWeight: "700", color: textPrimary, boxShadow: `0 12px 32px ${theme.accent1}20`, backdropFilter: "blur(20px)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "10px" }}>
          {toast}
        </div>
      )}

      {/* Main download row */}
      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        {/* Primary PDF button */}
        <button
          onClick={() => download("pdf")}
          disabled={downloading === "pdf"}
          className={downloading === "pdf" ? "btn-glass" : "btn-premium animate-pulse-glow"}
          style={{ 
            flex: 1, 
            padding: "16px 24px", 
            fontSize: "15px", 
            fontWeight: "800", 
            background: downloading === "pdf" ? (D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)") : `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, 
            color: downloading === "pdf" ? textMuted : (D ? "#0c0a08" : "#fff"), 
            borderRadius: "16px", 
            border: downloading === "pdf" ? `1px solid ${D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` : "none", 
            cursor: downloading === "pdf" ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: downloading === "pdf" ? "none" : `0 8px 24px ${theme.accent1}40`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          {downloading === "pdf" ? (
            <><span className="spinner" style={{ display: "inline-block", width: "16px", height: "16px", border: `2px solid ${textMuted}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Generating PDF...</>
          ) : (
            <>⬇ Download High-Res PDF</>
          )}
        </button>

        {/* Format picker button */}
        <button
          onClick={() => setOpen(o => !o)}
          className="btn-glass"
          style={{ 
            padding: "0 20px", 
            fontSize: "15px", 
            fontWeight: "700", 
            borderRadius: "16px", 
            color: textSecondary, 
            cursor: "pointer", 
            position: "relative", 
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: open ? (D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)") : undefined
          }}
        >
          📂 More Formats {open ? "▲" : "▼"}
        </button>
      </div>

      {/* Format dropdown */}
      {open && (
        <div className="animate-fade-in-up glass-panel" style={{ padding: "24px", marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", border: `1px solid ${theme.accent1}30`, boxShadow: `0 16px 40px rgba(0,0,0,0.2)` }}>
          <p style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", color: textMuted, margin: "0 0 8px", gridColumn: "1/-1", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ flex: 1, height: "1px", background: D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />
            Choose Format
            <span style={{ flex: 1, height: "1px", background: D ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />
          </p>
          
          {FORMATS.map(f => (
            <button
              key={f.id}
              onClick={() => download(f.id)}
              disabled={!!downloading}
              className="card-hover-lift"
              style={{ 
                borderRadius: "16px", 
                padding: "16px", 
                cursor: downloading ? "not-allowed" : "pointer", 
                border: `1px solid ${f.color}40`, 
                background: downloading === f.id ? `${f.color}20` : `linear-gradient(135deg, ${f.color}10, transparent)`, 
                display: "flex", 
                alignItems: "center", 
                gap: "16px", 
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)", 
                opacity: downloading && downloading !== f.id ? 0.4 : 1,
                textAlign: "left"
              }}
            >
              <span style={{ fontSize: "28px", flexShrink: 0, filter: `drop-shadow(0 4px 8px ${f.color}40)` }}>{downloading === f.id ? "⏳" : f.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "15px", fontWeight: "800", color: f.color, margin: "0 0 4px", textShadow: `0 2px 4px ${f.color}20` }}>{f.label}</p>
                <p style={{ fontSize: "12px", color: textMuted, margin: 0, lineHeight: 1.4 }}>{f.desc}</p>
              </div>
            </button>
          ))}

          {/* Format guide */}
          <div style={{ gridColumn: "1/-1", marginTop: "12px", padding: "16px", borderRadius: "16px", background: D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "20px" }}>💡</span>
              <div>
                <strong style={{ display: "block", fontSize: "13px", color: textPrimary, marginBottom: "4px" }}>Which format to use?</strong>
                <p style={{ fontSize: "12px", color: textSecondary, margin: 0, lineHeight: 1.6 }}>
                  Use <strong>PDF</strong> for direct emails and modern applications. Use <strong>Word</strong> (DOCX) or <strong>TXT</strong> if specifically requested by older ATS portals (like Naukri/Indeed). Use <strong>PNG</strong> to share on WhatsApp or LinkedIn posts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
