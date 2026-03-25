// src/pages/TemplatesPage.jsx
// Real HTML resume templates — Firestore, hourly AI, user custom, modify
import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection, doc, getDocs, setDoc, addDoc, query,
  orderBy, getDoc, serverTimestamp,
} from "firebase/firestore";

// ── 10 HARDCODED STARTER TEMPLATES (render functions) ──────────────────────
const STARTERS = [
  {
    id:"classic-clean", name:"Classic Clean", style:"Classic", tags:["professional","ats-friendly"],
    render:(d)=>`<div style="font-family:'Georgia',serif;max-width:720px;margin:0 auto;padding:40px;color:#222;background:#fff;line-height:1.6"><div style="border-bottom:2px solid #222;padding-bottom:16px;margin-bottom:24px;display:flex;align-items:center;gap:20px">${d.photo?`<img src="${d.photo}" alt="Profile" style="width:80px;height:80px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid #ddd" />`:`<div style="width:80px;height:80px;border-radius:50%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#999;flex-shrink:0">${(d.name||"?")[0].toUpperCase()}</div>`}<div><h1 style="font-size:28px;margin:0 0 6px">${d.name||"Your Name"}</h1><div style="font-size:13px;color:#555;display:flex;flex-wrap:wrap;gap:16px">${d.email?`<span>✉ ${d.email}</span>`:""}${d.phone?`<span>📞 ${d.phone}</span>`:""}${d.location?`<span>📍 ${d.location}</span>`:""}</div></div></div>${d.summary?`<div style="margin-bottom:20px"><h2 style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#666;margin:0 0 8px;border-bottom:1px solid #ddd;padding-bottom:4px">SUMMARY</h2><p style="font-size:14px;color:#333;margin:0">${d.summary}</p></div>`:""}${d.experience?.some(e=>e.role)?`<div style="margin-bottom:20px"><h2 style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#666;margin:0 0 12px;border-bottom:1px solid #ddd;padding-bottom:4px">EXPERIENCE</h2>${d.experience.filter(e=>e.role).map(e=>`<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between"><strong>${e.role}</strong><span style="font-size:12px;color:#888">${e.duration||""}</span></div><div style="font-size:13px;color:#666">${e.company||""}</div>${e.desc?`<p style="font-size:13px;color:#444;margin:4px 0 0">${e.desc}</p>`:""}</div>`).join("")}</div>`:""}${d.education?.some(e=>e.degree)?`<div style="margin-bottom:20px"><h2 style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#666;margin:0 0 10px;border-bottom:1px solid #ddd;padding-bottom:4px">EDUCATION</h2>${d.education.filter(e=>e.degree).map(e=>`<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span><strong>${e.degree}</strong>${e.school?` — ${e.school}`:""}</span><span style="font-size:12px;color:#888">${e.year||""}</span></div>`).join("")}</div>`:""}${d.skills?`<div><h2 style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#666;margin:0 0 10px;border-bottom:1px solid #ddd;padding-bottom:4px">SKILLS</h2><div style="display:flex;flex-wrap:wrap;gap:8px">${d.skills.split(",").map(s=>`<span style="background:#f0f0f0;padding:4px 12px;border-radius:4px;font-size:12px">${s.trim()}</span>`).join("")}</div></div>`:""}</div>`
  },
  {
    id:"modern-sidebar", name:"Modern Sidebar", style:"Modern", tags:["two-column","tech"],
    render:(d)=>`<div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;display:grid;grid-template-columns:210px 1fr;min-height:580px;background:#fff"><div style="background:#1a237e;color:#fff;padding:30px 18px"><div style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;margin:0 auto 14px">${(d.name||"?")[0].toUpperCase()}</div><h1 style="font-size:16px;font-weight:800;text-align:center;margin:0 0 4px">${d.name||"Your Name"}</h1><p style="font-size:11px;text-align:center;opacity:.7;margin:0 0 20px">${d.experience?.[0]?.role||""}</p><div style="font-size:11px;opacity:.85;margin-bottom:20px;display:flex;flex-direction:column;gap:5px">${d.email?`<span>✉ ${d.email}</span>`:""}${d.phone?`<span>📞 ${d.phone}</span>`:""}${d.location?`<span>📍 ${d.location}</span>`:""}</div>${d.skills?`<p style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;opacity:.6;margin:0 0 8px">SKILLS</p>${d.skills.split(",").map(s=>`<div style="margin-bottom:5px;font-size:11px">${s.trim()}</div>`).join("")}`:""}</div><div style="padding:28px 24px;color:#222">${d.summary?`<div style="margin-bottom:20px"><h2 style="font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#1a237e;margin:0 0 8px">ABOUT</h2><p style="font-size:13px;color:#555;line-height:1.7;margin:0">${d.summary}</p></div>`:""}${d.experience?.some(e=>e.role)?`<div style="margin-bottom:20px"><h2 style="font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#1a237e;margin:0 0 10px">EXPERIENCE</h2>${d.experience.filter(e=>e.role).map(e=>`<div style="margin-bottom:12px;padding-left:10px;border-left:2px solid #e0e0e0"><div style="display:flex;justify-content:space-between"><strong style="font-size:13px">${e.role}</strong><span style="font-size:11px;color:#888">${e.duration||""}</span></div><div style="font-size:12px;color:#1a237e">${e.company||""}</div>${e.desc?`<p style="font-size:12px;color:#555;margin:4px 0 0">${e.desc}</p>`:""}</div>`).join("")}</div>`:""}${d.education?.some(e=>e.degree)?`<h2 style="font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#1a237e;margin:0 0 10px">EDUCATION</h2>${d.education.filter(e=>e.degree).map(e=>`<div style="margin-bottom:8px"><strong style="font-size:13px">${e.degree}</strong>${e.school?`<span style="font-size:12px;color:#888"> — ${e.school}</span>`:""}<span style="font-size:11px;color:#aaa;display:block">${e.year||""}</span></div>`).join("")}`:""}</div></div>`
  },
  {
    id:"minimal-white", name:"Minimal White", style:"Minimal", tags:["minimal","clean"],
    render:(d)=>`<div style="font-family:'Helvetica Neue',sans-serif;max-width:680px;margin:0 auto;padding:52px 48px;background:#fff;color:#111"><h1 style="font-size:36px;font-weight:300;letter-spacing:-1px;margin:0 0 8px">${d.name||"Your Name"}</h1><p style="font-size:14px;color:#888;margin:0 0 12px">${d.experience?.[0]?.role||""}</p><div style="font-size:12px;color:#aaa;display:flex;flex-wrap:wrap;gap:20px;margin-bottom:40px">${d.email?`<span>${d.email}</span>`:""}${d.phone?`<span>${d.phone}</span>`:""}${d.location?`<span>${d.location}</span>`:""}</div>${d.summary?`<p style="font-size:14px;color:#444;line-height:1.8;margin:0 0 32px;font-weight:300">${d.summary}</p>`:""}${d.experience?.some(e=>e.role)?`<div style="margin-bottom:32px">${d.experience.filter(e=>e.role).map(e=>`<div style="margin-bottom:20px;display:grid;grid-template-columns:130px 1fr;gap:16px"><div><span style="font-size:11px;color:#bbb">${e.duration||""}</span><br/><span style="font-size:11px;color:#888">${e.company||""}</span></div><div><strong style="font-size:14px;font-weight:500">${e.role}</strong>${e.desc?`<p style="font-size:12px;color:#666;margin:6px 0 0;line-height:1.6">${e.desc}</p>`:""}</div></div>`).join("")}</div>`:""}${d.skills?`<div style="display:flex;flex-wrap:wrap;gap:6px">${d.skills.split(",").map(s=>`<span style="border:1px solid #ddd;padding:3px 12px;border-radius:2px;font-size:11px;color:#666">${s.trim()}</span>`).join("")}</div>`:""}</div>`
  },
  {
    id:"bold-impact", name:"Bold Impact", style:"Bold", tags:["bold","standout"],
    render:(d)=>`<div style="font-family:'Arial Black',sans-serif;max-width:720px;margin:0 auto;background:#fff"><div style="background:#e53935;padding:32px 40px;color:#fff"><h1 style="font-size:36px;font-weight:900;margin:0 0 6px;text-transform:uppercase;letter-spacing:-1px">${d.name||"YOUR NAME"}</h1><p style="font-size:15px;margin:0 0 14px;opacity:.9">${d.experience?.[0]?.role||"PROFESSIONAL"}</p><div style="font-size:12px;opacity:.85;display:flex;flex-wrap:wrap;gap:16px">${d.email?`<span>${d.email}</span>`:""}${d.phone?`<span>${d.phone}</span>`:""}${d.location?`<span>${d.location}</span>`:""}</div></div><div style="padding:32px 40px">${d.summary?`<div style="margin-bottom:24px;padding:16px;background:#fff8f8;border-left:4px solid #e53935"><p style="font-size:14px;color:#333;line-height:1.7;margin:0">${d.summary}</p></div>`:""}${d.experience?.some(e=>e.role)?`<h2 style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#e53935;margin:0 0 14px;font-weight:900">EXPERIENCE</h2>${d.experience.filter(e=>e.role).map(e=>`<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between"><strong style="font-size:15px;text-transform:uppercase">${e.role}</strong><span style="font-size:11px;color:#888;font-family:Arial">${e.duration||""}</span></div><p style="font-size:12px;color:#e53935;font-weight:700;margin:2px 0 5px;font-family:Arial">${e.company||""}</p>${e.desc?`<p style="font-size:13px;color:#555;margin:0;font-family:Arial">${e.desc}</p>`:""}</div>`).join("")}`:""}${d.skills?`<h2 style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#e53935;margin:20px 0 10px;font-weight:900">SKILLS</h2><div style="display:flex;flex-wrap:wrap;gap:8px">${d.skills.split(",").map(s=>`<span style="background:#e53935;color:#fff;padding:5px 14px;font-size:12px;font-weight:700;text-transform:uppercase">${s.trim()}</span>`).join("")}</div>`:""}</div></div>`
  },
  {
    id:"executive-gold", name:"Executive Gold", style:"Executive", tags:["luxury","premium"],
    render:(d)=>`<div style="font-family:'Times New Roman',serif;max-width:720px;margin:0 auto;padding:48px;background:#fafaf8;border:1px solid #e8d8a0"><div style="text-align:center;margin-bottom:32px;border-bottom:2px solid #c9a96e;padding-bottom:22px"><h1 style="font-size:30px;font-weight:700;margin:0 0 6px;letter-spacing:2px;text-transform:uppercase">${d.name||"Your Name"}</h1><p style="font-size:12px;color:#c9a96e;letter-spacing:.2em;text-transform:uppercase;margin:0 0 12px">${d.experience?.[0]?.role||""}</p><div style="font-size:12px;color:#888;display:flex;justify-content:center;flex-wrap:wrap;gap:18px">${d.email?`<span>${d.email}</span>`:""}${d.phone?`<span>${d.phone}</span>`:""}${d.location?`<span>${d.location}</span>`:""}</div></div>${d.summary?`<p style="font-size:14px;color:#555;line-height:1.8;margin:0 0 28px;text-align:center;font-style:italic">"${d.summary}"</p>`:""}${d.experience?.some(e=>e.role)?`<h2 style="font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#c9a96e;text-align:center;margin:0 0 14px">— EXPERIENCE —</h2>${d.experience.filter(e=>e.role).map(e=>`<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;border-bottom:1px dotted #d4c090;padding-bottom:4px;margin-bottom:5px"><strong>${e.role}${e.company?` · <em style="font-weight:400;color:#888">${e.company}</em>`:""}</strong><span style="font-size:12px;color:#aaa">${e.duration||""}</span></div>${e.desc?`<p style="font-size:13px;color:#555;margin:0;line-height:1.7">${e.desc}</p>`:""}</div>`).join("")}`:""}${d.skills?`<h2 style="font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#c9a96e;text-align:center;margin:20px 0 12px">— EXPERTISE —</h2><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${d.skills.split(",").map(s=>`<span style="border:1px solid #c9a96e;color:#c9a96e;padding:4px 14px;font-size:12px">${s.trim()}</span>`).join("")}</div>`:""}</div>`
  },
  {
    id:"tech-dark", name:"Tech Dark", style:"Tech", tags:["dark","developer"],
    render:(d)=>`<div style="font-family:'Courier New',monospace;max-width:720px;margin:0 auto;background:#0d1117;color:#e6edf3;padding:40px"><div style="border-bottom:1px solid #30363d;padding-bottom:18px;margin-bottom:22px"><div style="color:#58a6ff;font-size:12px;margin-bottom:6px">// resume.json</div><h1 style="font-size:26px;font-weight:700;margin:0 0 5px;color:#f0f6fc">${d.name||"Your Name"}</h1><p style="font-size:13px;color:#58a6ff;margin:0 0 10px">${d.experience?.[0]?.role||"Developer"}</p><div style="font-size:12px;color:#8b949e;display:flex;flex-wrap:wrap;gap:14px">${d.email?`<span>// ${d.email}</span>`:""}${d.phone?`<span>// ${d.phone}</span>`:""}${d.location?`<span>// ${d.location}</span>`:""}</div></div>${d.summary?`<div style="margin-bottom:22px"><div style="color:#7ee787;font-size:11px;margin-bottom:6px">/* about */</div><p style="font-size:13px;color:#adbac7;line-height:1.7;margin:0;border-left:2px solid #238636;padding-left:12px">${d.summary}</p></div>`:""}${d.experience?.some(e=>e.role)?`<div style="margin-bottom:22px"><div style="color:#7ee787;font-size:11px;margin-bottom:10px">/* experience */</div>${d.experience.filter(e=>e.role).map(e=>`<div style="margin-bottom:14px;padding:12px;background:#161b22;border:1px solid #30363d;border-radius:6px"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span style="color:#f0f6fc;font-weight:700;font-size:13px">${e.role}</span><span style="color:#8b949e;font-size:11px">${e.duration||""}</span></div><span style="color:#58a6ff;font-size:12px">${e.company||""}</span>${e.desc?`<p style="font-size:12px;color:#adbac7;margin:7px 0 0;line-height:1.6">${e.desc}</p>`:""}</div>`).join("")}</div>`:""}${d.skills?`<div style="margin-bottom:20px"><div style="color:#7ee787;font-size:11px;margin-bottom:8px">/* skills */</div><div style="display:flex;flex-wrap:wrap;gap:6px">${d.skills.split(",").map(s=>`<span style="background:#21262d;border:1px solid #30363d;color:#79c0ff;padding:4px 12px;font-size:11px;border-radius:4px">${s.trim()}</span>`).join("")}</div></div>`:""}${d.education?.some(e=>e.degree)?`<div><div style="color:#7ee787;font-size:11px;margin-bottom:8px">/* education */</div>${d.education.filter(e=>e.degree).map(e=>`<div style="font-size:12px;color:#adbac7;margin-bottom:5px"><span style="color:#f0f6fc">${e.degree}</span>${e.school?` @ <span style="color:#58a6ff">${e.school}</span>`:""} <span style="color:#8b949e">${e.year?`[${e.year}]`:""}</span></div>`).join("")}</div>`:""}</div>`
  },
  {
    id:"creative-gradient", name:"Creative Gradient", style:"Creative", tags:["creative","colorful"],
    render:(d)=>`<div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;background:#fff"><div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:36px 40px;color:#fff"><h1 style="font-size:30px;font-weight:800;margin:0 0 5px">${d.name||"Your Name"}</h1><p style="font-size:14px;opacity:.9;margin:0 0 14px">${d.experience?.[0]?.role||""}</p><div style="font-size:12px;opacity:.8;display:flex;flex-wrap:wrap;gap:14px">${d.email?`<span>✉ ${d.email}</span>`:""}${d.phone?`<span>📞 ${d.phone}</span>`:""}${d.location?`<span>📍 ${d.location}</span>`:""}</div></div><div style="padding:32px 40px">${d.summary?`<div style="margin-bottom:22px;padding:14px 18px;background:#f8f7ff;border-radius:10px;border-left:4px solid #667eea"><p style="font-size:13px;color:#444;line-height:1.7;margin:0">${d.summary}</p></div>`:""}${d.experience?.some(e=>e.role)?`<h2 style="font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#667eea;margin:0 0 12px">Experience</h2>${d.experience.filter(e=>e.role).map(e=>`<div style="margin-bottom:12px"><strong style="font-size:13px">${e.role}</strong><p style="font-size:11px;color:#667eea;margin:2px 0 4px">${e.company||""} · ${e.duration||""}</p>${e.desc?`<p style="font-size:12px;color:#666;margin:0;line-height:1.5">${e.desc}</p>`:""}</div>`).join("")}`:""}${d.skills?`<h2 style="font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#764ba2;margin:18px 0 10px">Skills</h2><div style="display:flex;flex-wrap:wrap;gap:6px">${d.skills.split(",").map(s=>`<span style="background:linear-gradient(135deg,#667eea22,#764ba222);border:1px solid #667eea44;color:#667eea;padding:3px 10px;border-radius:20px;font-size:11px">${s.trim()}</span>`).join("")}</div>`:""}</div></div>`
  },
  {
    id:"premium-teal", name:"Premium Teal", style:"Premium", tags:["premium","modern"],
    render:(d)=>`<div style="font-family:'Segoe UI',sans-serif;max-width:720px;margin:0 auto;background:#fff"><div style="background:#00695c;padding:32px 40px;color:#fff;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:14px"><div><h1 style="font-size:28px;font-weight:700;margin:0 0 5px">${d.name||"Your Name"}</h1><p style="font-size:13px;opacity:.85;margin:0">${d.experience?.[0]?.role||""}</p></div><div style="font-size:12px;opacity:.8;text-align:right;display:flex;flex-direction:column;gap:3px">${d.email?`<span>${d.email}</span>`:""}${d.phone?`<span>${d.phone}</span>`:""}${d.location?`<span>${d.location}</span>`:""}</div></div><div style="padding:28px 40px">${d.summary?`<p style="font-size:14px;color:#444;line-height:1.75;margin:0 0 22px;padding-bottom:18px;border-bottom:1px solid #e0f2f1">${d.summary}</p>`:""}${d.experience?.some(e=>e.role)?`<h2 style="font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#00695c;margin:0 0 12px">Work Experience</h2>${d.experience.filter(e=>e.role).map(e=>`<div style="margin-bottom:14px;padding-left:14px;border-left:3px solid #00695c"><div style="display:flex;justify-content:space-between"><strong style="font-size:14px">${e.role}</strong><span style="font-size:12px;color:#aaa">${e.duration||""}</span></div><p style="font-size:12px;color:#00695c;font-weight:600;margin:3px 0 5px">${e.company||""}</p>${e.desc?`<p style="font-size:13px;color:#555;margin:0;line-height:1.65">${e.desc}</p>`:""}</div>`).join("")}`:""}${d.skills?`<h2 style="font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#00695c;margin:18px 0 10px">Skills</h2><div style="display:flex;flex-wrap:wrap;gap:6px">${d.skills.split(",").map(s=>`<span style="background:#e0f2f1;color:#00695c;padding:4px 12px;border-radius:4px;font-size:11px">${s.trim()}</span>`).join("")}</div>`:""}</div></div>`
  },
  {
    id:"startup-fresh", name:"Startup Fresh", style:"Startup", tags:["startup","modern"],
    render:(d)=>`<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:720px;margin:0 auto;background:#f8f9fa"><div style="background:#fff;padding:32px 40px 20px;border-bottom:1px solid #eee"><div style="display:flex;align-items:center;gap:18px"><div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#0066ff,#0044cc);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff;flex-shrink:0">${(d.name||"?")[0].toUpperCase()}</div><div><h1 style="font-size:22px;font-weight:700;margin:0 0 3px">${d.name||"Your Name"}</h1><p style="font-size:13px;color:#0066ff;margin:0 0 6px;font-weight:500">${d.experience?.[0]?.role||""}</p><div style="font-size:11px;color:#888;display:flex;flex-wrap:wrap;gap:10px">${d.email?`<span>${d.email}</span>`:""}${d.phone?`<span>${d.phone}</span>`:""}${d.location?`<span>${d.location}</span>`:""}</div></div></div></div><div style="padding:22px 40px">${d.summary?`<div style="background:#fff;border-radius:10px;padding:16px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,.06)"><p style="font-size:13px;color:#444;line-height:1.7;margin:0">${d.summary}</p></div>`:""}${d.experience?.some(e=>e.role)?`<h2 style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#888;margin:0 0 8px">Experience</h2>${d.experience.filter(e=>e.role).map(e=>`<div style="background:#fff;border-radius:10px;padding:14px 18px;margin-bottom:8px;box-shadow:0 1px 3px rgba(0,0,0,.06)"><div style="display:flex;justify-content:space-between;align-items:baseline"><strong style="font-size:13px">${e.role}</strong><span style="font-size:11px;color:#aaa">${e.duration||""}</span></div><p style="font-size:12px;color:#0066ff;font-weight:500;margin:2px 0 5px">${e.company||""}</p>${e.desc?`<p style="font-size:12px;color:#666;margin:0;line-height:1.6">${e.desc}</p>`:""}</div>`).join("")}`:""}${d.skills?`<div style="background:#fff;border-radius:10px;padding:14px 16px;margin-top:10px;box-shadow:0 1px 3px rgba(0,0,0,.06);display:flex;flex-wrap:wrap;gap:6px">${d.skills.split(",").map(s=>`<span style="background:#eff6ff;color:#0066ff;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:500">${s.trim()}</span>`).join("")}</div>`:""}</div></div>`
  },
  {
    id:"academic", name:"Academic", style:"Academic", tags:["academic","research"],
    render:(d)=>`<div style="font-family:'Garamond','Georgia',serif;max-width:700px;margin:0 auto;padding:48px;background:#fff;color:#1a1a1a"><div style="text-align:center;margin-bottom:28px"><h1 style="font-size:24px;font-weight:700;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">${d.name||"Your Name"}</h1><div style="font-size:12px;color:#555;display:flex;justify-content:center;flex-wrap:wrap;gap:14px;margin-top:6px">${d.email?`<span>${d.email}</span>`:""}${d.phone?`<span>${d.phone}</span>`:""}${d.location?`<span>${d.location}</span>`:""}</div><div style="width:50px;height:2px;background:#1a1a1a;margin:14px auto 0"></div></div>${d.summary?`<div style="margin-bottom:22px"><h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin:0 0 7px">Profile</h2><p style="font-size:13px;color:#333;line-height:1.8;margin:0">${d.summary}</p></div>`:""}${d.experience?.some(e=>e.role)?`<h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin:0 0 10px">Experience</h2>${d.experience.filter(e=>e.role).map(e=>`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between"><strong style="font-size:13px">${e.role}${e.company?`, <em>${e.company}</em>`:""}</strong><span style="font-size:12px;color:#888">${e.duration||""}</span></div>${e.desc?`<p style="font-size:12px;color:#444;margin:4px 0 0;line-height:1.7">${e.desc}</p>`:""}</div>`).join("")}`:""}${d.education?.some(e=>e.degree)?`<h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin:18px 0 10px">Education</h2>${d.education.filter(e=>e.degree).map(e=>`<div style="margin-bottom:8px"><strong style="font-size:13px">${e.degree}</strong>${e.school?`<span style="color:#666">, ${e.school}</span>`:""}<span style="float:right;font-size:12px;color:#888">${e.year||""}</span></div>`).join("")}`:""}${d.skills?`<h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin:18px 0 8px">Skills</h2><p style="font-size:13px;color:#444;line-height:1.8;margin:0">${d.skills}</p>`:""}</div>`
  },
];

const TEMPLATES_COL = "resume_templates";
const META_COL = "templates_meta";

async function fsLoad() {
  try {
    const q = query(collection(db, TEMPLATES_COL), orderBy("createdAt","desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
  } catch { return []; }
}
async function fsAdd(data) {
  try { return await addDoc(collection(db, TEMPLATES_COL), { ...data, createdAt: serverTimestamp() }); }
  catch { return null; }
}
async function getLastGen() {
  try {
    const snap = await getDoc(doc(db, META_COL, "hourly"));
    return snap.exists() ? snap.data().lastGenAt?.toMillis() || 0 : 0;
  } catch { return 0; }
}
async function setLastGen() {
  try { await setDoc(doc(db, META_COL, "hourly"), { lastGenAt: serverTimestamp() }); } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
export default function TemplatesPage({ callAI, form, setPage, setAppliedTemplateHtml, glassCard, glassBase, glassBtn, glassInput, textPrimary, textSecondary, textMuted, theme, D, isPro }) {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customPrompt, setCustomPrompt] = useState("");
  const [customLoading, setCustomLoading] = useState(false);
  const [modifyPrompt, setModifyPrompt] = useState("");
  const [modifyLoading, setModifyLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [toast, setToast] = useState("");
  const hourlyDone = useRef(false);
  const accent = `linear-gradient(135deg,${theme.accent1}cc,${theme.accent2}bb)`;

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  useEffect(() => { init(); }, []);

  const reload = async () => {
    const t = await fsLoad();
    setTemplates(t);
    return t;
  };

  const init = async () => {
    setLoading(true);
    let list = await fsLoad();
    // Seed starters if empty
    if (!list.some(t => t.type === "starter")) {
      for (const s of STARTERS) {
        await fsAdd({ templateId: s.id, name: s.name, style: s.style, tags: s.tags, type: "starter" });
      }
      list = await fsLoad();
    }
    setTemplates(list);
    setLoading(false);
    if (!hourlyDone.current) { hourlyDone.current = true; checkHourly(); }
  };

  const checkHourly = async () => {
    const last = await getLastGen();
    const ONE_HR = 3600000;
    if (Date.now() - last > ONE_HR) {
      genHourly();
    } else {
      setTimeout(checkHourly, ONE_HR - (Date.now() - last));
    }
  };

  const genHourly = async () => {
    const STYLES = ["Minimalist","Corporate","Creative","Tech","Luxury","Elegant","Startup","Bold","Academic","Neon","Pastel","Retro"];
    const style = STYLES[new Date().getHours() % STYLES.length];
    try {
      const response = await callAI(`Create a unique ${style} style resume template as complete self-contained HTML with inline CSS only.
Use these placeholders exactly: {{NAME}} {{ROLE}} {{EMAIL}} {{PHONE}} {{LOCATION}} {{SUMMARY}} {{SKILLS}} {{EXP_ITEMS}} {{EDU_ITEMS}}
The template must look like a real professional resume in ${style} style.
Return ONLY:
TEMPLATE_META:{"name":"${style} ${new Date().getHours()}","style":"${style}","tags":["${style.toLowerCase()}","auto"]}
TEMPLATE_HTML:
<div ...complete HTML...>`);
      const raw = typeof response === 'string' ? response : response.content;
      console.log(`AI Model Used: ${response.provider} - ${response.model}`);
      if (raw.includes("TEMPLATE_META:") && raw.includes("TEMPLATE_HTML:")) {
        const meta = JSON.parse(raw.split("TEMPLATE_META:")[1].split("TEMPLATE_HTML:")[0].trim());
        const html = raw.split("TEMPLATE_HTML:")[1].trim();
        await fsAdd({ ...meta, htmlTemplate: html, type: "ai-hourly" });
        await reload();
        notify("✨ New AI template added!");
      }
    } catch {}
    await setLastGen();
    setTimeout(checkHourly, 3600000);
  };

  // ── Random sample data for card previews so templates look filled ──────
  const SAMPLES = [
    { name:"Priya Sharma", email:"priya.sharma@gmail.com", phone:"+91 98765 43210", location:"Bangalore, India", linkedin:"linkedin.com/in/priyasharma", summary:"Full-stack developer with 4 years of experience building scalable web applications. Passionate about clean code and user-centric design. Led cross-functional teams at two high-growth startups.", skills:"React, Node.js, TypeScript, MongoDB, AWS, Docker, Figma, PostgreSQL", photo:"", education:[{degree:"B.Tech Computer Science",school:"IIT Delhi",year:"2020"}], experience:[{role:"Senior Frontend Engineer",company:"Razorpay",duration:"2022 – Present",desc:"Led development of the merchant dashboard serving 5M+ transactions monthly. Reduced load time by 40% through code splitting and lazy loading."},{role:"Software Engineer",company:"Freshworks",duration:"2020 – 2022",desc:"Built real-time customer support features using WebSockets. Collaborated with design to ship 12 product features in 18 months."}]},
    { name:"Arjun Mehta", email:"arjun.mehta@outlook.com", phone:"+91 91234 56789", location:"Mumbai, India", linkedin:"linkedin.com/in/arjunmehta", summary:"Product Manager with 5+ years driving growth at B2B SaaS companies. Expert in agile methodologies, user research, and data-driven decision making. Previously grew ARR from ₹2Cr to ₹18Cr.", skills:"Product Strategy, Roadmapping, SQL, Mixpanel, Jira, User Research, A/B Testing, Go-to-Market", photo:"", education:[{degree:"MBA Marketing",school:"IIM Ahmedabad",year:"2019"}], experience:[{role:"Senior Product Manager",company:"Zoho Corporation",duration:"2021 – Present",desc:"Owns the CRM mobile product with 2M+ active users. Launched 3 major feature releases that increased user retention by 28%."},{role:"Product Manager",company:"CleverTap",duration:"2019 – 2021",desc:"Defined product vision for push notification analytics. Coordinated with engineering and design to deliver quarterly OKRs."}]},
    { name:"Sneha Reddy", email:"sneha.reddy@yahoo.com", phone:"+91 87654 32109", location:"Hyderabad, India", linkedin:"linkedin.com/in/snehareddy", summary:"UI/UX Designer specialising in mobile-first design systems. 3 years of experience creating intuitive digital experiences for fintech and healthtech products. Design thinking advocate.", skills:"Figma, Adobe XD, Sketch, Prototyping, User Testing, CSS, Motion Design, Design Systems", photo:"", education:[{degree:"B.Des Visual Communication",school:"NID Ahmedabad",year:"2021"}], experience:[{role:"Product Designer",company:"PhonePe",duration:"2022 – Present",desc:"Redesigned the payments onboarding flow reducing drop-off by 35%. Built and maintains the company's design system with 200+ components."},{role:"UX Designer",company:"Practo",duration:"2021 – 2022",desc:"Conducted 40+ user interviews to improve doctor consultation booking flow. Shipped redesigned appointment screen to 8M users."}]},
    { name:"Rohan Kapoor", email:"rohan.kapoor@gmail.com", phone:"+91 99887 76655", location:"Delhi, India", linkedin:"linkedin.com/in/rohankapoor", summary:"Data Scientist with expertise in ML and NLP. 3 years building predictive models that directly impact business outcomes. Published researcher with 2 papers in IEEE.", skills:"Python, TensorFlow, PyTorch, SQL, Spark, Scikit-learn, NLP, Computer Vision, Tableau", photo:"", education:[{degree:"M.Tech Data Science",school:"IIT Bombay",year:"2021"}], experience:[{role:"Data Scientist",company:"Flipkart",duration:"2021 – Present",desc:"Built recommendation engine that increased average order value by 22%. Deployed real-time fraud detection model saving ₹4Cr annually."},{role:"ML Intern",company:"Microsoft Research",duration:"2020",desc:"Developed NLP pipeline for multilingual sentiment analysis across 8 Indian languages with 91% accuracy."}]},
  ];

  const getSampleData = (idx) => SAMPLES[idx % SAMPLES.length];

  const renderTpl = (tpl, data = null) => {
    const d = data || form;
    const starter = STARTERS.find(s => s.id === tpl.templateId);
    if (starter) return starter.render(d);
    if (tpl.htmlTemplate) {
      const photoHtml = d.photo ? `<img src="${d.photo}" alt="Profile" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid #ccc" />` : "";
      return tpl.htmlTemplate
        .replace(/\{\{NAME\}\}/g, d.name || "Your Name")
        .replace(/\{\{ROLE\}\}/g, d.experience?.[0]?.role || "Professional")
        .replace(/\{\{EMAIL\}\}/g, d.email || "")
        .replace(/\{\{PHONE\}\}/g, d.phone || "")
        .replace(/\{\{LOCATION\}\}/g, d.location || "")
        .replace(/\{\{SUMMARY\}\}/g, d.summary || "")
        .replace(/\{\{SKILLS\}\}/g, d.skills || "")
        .replace(/\{\{PHOTO\}\}/g, photoHtml)
        .replace(/\{\{EXP_ITEMS\}\}/g, d.experience?.filter(e=>e.role).map(e=>`<div style="margin-bottom:10px"><strong>${e.role}</strong> at ${e.company||""} (${e.duration||""})<p style="margin:4px 0 0;font-size:12px">${e.desc||""}</p></div>`).join("") || "")
        .replace(/\{\{EDU_ITEMS\}\}/g, d.education?.filter(e=>e.degree).map(e=>`<div><strong>${e.degree}</strong> — ${e.school||""} ${e.year?`(${e.year})`:""}</div>`).join("") || "");
    }
    return `<div style="padding:40px;text-align:center;color:#888">Preview not available</div>`;
  };

  // Card preview uses random sample data; full modal uses real user data
  const renderCard = (tpl, idx) => renderTpl(tpl, getSampleData(idx));
  const openPreview = (tpl) => { setSelected(tpl); setPreviewHtml(renderTpl(tpl)); setShowPreview(true); };

  const genCustom = async () => {
    if (!customPrompt.trim()) return;
    if (!isPro) { setPage("upgrade"); return; }
    setCustomLoading(true);
    try {
      const response = await callAI(`Create a custom resume template based on: "${customPrompt}"
${form.name ? `For: ${form.name}, ${form.experience?.[0]?.role||""}` : ""}
Requirements: Complete HTML with inline CSS. Use placeholders: {{NAME}} {{ROLE}} {{EMAIL}} {{PHONE}} {{LOCATION}} {{SUMMARY}} {{SKILLS}} {{EXP_ITEMS}} {{EDU_ITEMS}}
Return ONLY:
TEMPLATE_META:{"name":"[name]","style":"[style]","tags":["custom"]}
TEMPLATE_HTML:
<div ...>`);
      const raw = typeof response === 'string' ? response : response.content;
      console.log(`AI Model Used: ${response.provider} - ${response.model}`);
      if (raw.includes("TEMPLATE_META:") && raw.includes("TEMPLATE_HTML:")) {
        const meta = JSON.parse(raw.split("TEMPLATE_META:")[1].split("TEMPLATE_HTML:")[0].trim());
        const html = raw.split("TEMPLATE_HTML:")[1].trim();
        await fsAdd({ ...meta, htmlTemplate: html, type: "custom", userRequest: customPrompt });
        setCustomPrompt("");
        await reload();
        setActiveTab("custom");
        notify("✅ Custom template saved to your collection!");
      } else { notify("❌ Failed — try a more specific description."); }
    } catch { notify("❌ Generation failed. Try again."); }
    setCustomLoading(false);
  };

  const modifyTpl = async () => {
    if (!selected || !modifyPrompt.trim()) return;
    if (!isPro) { setPage("upgrade"); return; }
    setModifyLoading(true);
    try {
      const currentHtml = selected.htmlTemplate || renderTpl(selected);
      const response = await callAI(`Modify this resume template HTML: "${modifyPrompt}"
Current HTML (first 3000 chars): ${currentHtml.substring(0,3000)}
Return ONLY the complete modified HTML starting with <div. Keep all {{PLACEHOLDER}} variables. Apply changes faithfully.`);
      const raw = typeof response === 'string' ? response : response.content;
      console.log(`AI Model Used: ${response.provider} - ${response.model}`);
      if (raw.trim().startsWith("<")) {
        await fsAdd({ name: `${selected.name} (Modified)`, style: selected.style, tags: ["custom","modified"], htmlTemplate: raw.trim(), type: "custom", basedOn: selected.firestoreId });
        const newPreview = renderTpl({ htmlTemplate: raw.trim() });
        setPreviewHtml(newPreview);
        await reload();
        setModifyPrompt("");
        notify("✅ Modified version saved!");
      } else { notify("❌ Modification failed — try again."); }
    } catch { notify("❌ Failed. Try again."); }
    setModifyLoading(false);
  };

  const TABS = [["all","All",templates.length],["starter","Built-in",templates.filter(t=>t.type==="starter").length],["ai","AI Generated",templates.filter(t=>t.type==="ai-hourly").length],["custom","Custom",templates.filter(t=>t.type==="custom").length]];
  const TYPE_COLOR = { starter: theme.accent1, "ai-hourly": "#8B5CF6", custom: "#10B981" };
  const TYPE_LABEL = { starter: "Built-in", "ai-hourly": "AI Auto", custom: "Custom" };
  const filtered = activeTab === "all" ? templates : templates.filter(t => activeTab === "ai" ? t.type === "ai-hourly" : t.type === activeTab);

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px", zIndex: 1, position: "relative" }}>
      {toast && <div className="animate-fade-in-down" style={{ position:"fixed", top: 80, left:"50%", transform:"translateX(-50%)", zIndex:999, background: D?"rgba(20,20,30,0.8)":"rgba(255,255,255,0.8)", border:`1px solid ${theme.accent1}44`, borderRadius: "100px", padding:"12px 24px", fontSize: "14px", fontWeight: "700", color:textPrimary, boxShadow:`0 12px 40px ${theme.accent1}30`, backdropFilter:"blur(24px) saturate(200%)", WebkitBackdropFilter:"blur(24px) saturate(200%)", whiteSpace:"nowrap", display: "flex", alignItems: "center", gap: "8px" }}>{toast}</div>}

      <div className="animate-fade-in-down" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "6px", letterSpacing: "-0.5px" }}>Resume Templates</h2>
          <p style={{ fontSize: "14px", color: textSecondary, margin: 0 }}>{templates.length} templates · Auto-updated hourly · Stored in Firestore</p>
        </div>
        <div className="animate-pulse-glow" style={{ padding: "8px 16px", borderRadius: "100px", background: `linear-gradient(135deg, ${theme.accent1}15, ${theme.accent2}10)`, color: theme.accent1, fontWeight: "700", fontSize: "12px", border: `1px solid ${theme.accent1}40`, display: "flex", alignItems: "center", gap: "6px" }}>
          <span>✨</span> Live Updates
        </div>
      </div>

      {/* Custom Generator */}
      <div className="card-hover-lift animate-fade-in-up delay-1 glass-panel" style={{ padding:"32px", marginBottom: "32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "300px", height: "300px", background: `radial-gradient(circle, ${theme.accent1}20 0%, transparent 60%)`, pointerEvents: "none" }} />
        
        <p style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "0.16em", textTransform: "uppercase", color: textMuted, marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
          🎨 Generate Custom Template 
          {!isPro && <span style={{ padding: "3px 8px", background: D ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", borderRadius: "100px", fontSize: "9px", color: theme.accent1 }}>PRO</span>}
        </p>
        
        <div style={{ display:"flex", gap: "12px", flexWrap: "wrap" }}>
          <input value={customPrompt} onChange={e=>setCustomPrompt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&genCustom()} placeholder='e.g. "dark navy with gold accents, two-column layout, finance executive styling"' style={{ flex: 1, minWidth: "250px", background: D ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)", border: `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius:"14px", padding:"16px 20px", fontSize: "14px", color:textPrimary, outline: "none", transition: "all 0.2s" }} />
          <button onClick={genCustom} disabled={customLoading||!customPrompt.trim()} className={!customLoading && customPrompt.trim() ? "btn-premium animate-pulse-glow" : "btn-glass"} style={{ padding:"0 28px", height: "54px", fontSize: "14px", fontWeight: "700", background: customLoading ? "transparent" : (!customPrompt.trim() ? "transparent" : accent), color: customLoading ? textMuted : (!customPrompt.trim() ? textSecondary : (D?"#0c0a08":"#fff")), borderRadius:"14px", border: !customLoading && customPrompt.trim() ? "none" : undefined, cursor:customLoading?"not-allowed":"pointer", flexShrink:0, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            {customLoading ? "⏳ Generating..." : "Generate AI Template →"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="animate-fade-in-up delay-2" style={{ display:"flex", gap: "8px", marginBottom: "24px", flexWrap:"wrap" }}>
        {TABS.map(([id,label,count])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{ padding:"10px 20px", fontSize: "13px", fontWeight: "600", borderRadius:"100px", border: activeTab === id ? `1px solid ${theme.accent1}` : `1px solid transparent`, color: activeTab === id ? theme.accent1 : textSecondary, background: activeTab === id ? `linear-gradient(135deg, ${theme.accent1}15, ${theme.accent2}08)` : (D ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"), cursor:"pointer", transition: "all 0.2s" }}>
            {label} <span style={{ opacity:0.6, fontSize: "11px", marginLeft: "4px" }}>{count}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="animate-fade-in" style={{ padding:"80px 24px", textAlign:"center" }}>
          <div className="ambient-blob animate-pulse" style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto 24px" }} />
          <p style={{ fontSize: "16px", fontWeight: "700", color: textPrimary, fontFamily: "var(--font-display)" }}>Loading your templates...</p>
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="animate-fade-in-up delay-3" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap: "24px" }}>
          {filtered.map((tpl, idx) => {
            const color = TYPE_COLOR[tpl.type] || theme.accent1;
            return (
              <div key={tpl.firestoreId||idx} className="card-hover-lift glass-panel" style={{ overflow:"hidden", display:"flex", flexDirection:"column", border: `1px solid ${D ? "rgba(201,169,110,0.15)" : "rgba(201,169,110,0.3)"}` }}>
                {/* Mini preview */}
                <div style={{ height: "220px", overflow:"hidden", cursor:"pointer", background:"#fff", position:"relative", borderBottom: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }} onClick={()=>openPreview(tpl)}>
                  <div style={{ transform:"scale(0.35)", transformOrigin:"top left", width:"285%", pointerEvents:"none" }}>
                    <div dangerouslySetInnerHTML={{ __html: renderCard(tpl, idx) }} />
                  </div>
                  <div className="glass-reveal" style={{ position:"absolute", inset:0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)", opacity: 0, transition: "opacity 0.3s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ padding: "8px 20px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", color: "#fff", fontWeight: "700", borderRadius: "100px", fontSize: "13px" }}>👁️ View Template</span>
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding:"20px", flex:1, display:"flex", flexDirection:"column", gap: "12px", background: D ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.4)" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap: "8px" }}>
                    <p style={{ fontSize: "16px", fontWeight: "800", color: textPrimary, margin:0, fontFamily: "var(--font-display)", lineHeight: 1.2 }}>{tpl.name}</p>
                    <span style={{ fontSize: "10px", padding:"4px 8px", borderRadius:"6px", background: `${color}15`, color, fontWeight: "800", border:`1px solid ${color}30`, flexShrink:0, letterSpacing: "0.05em", textTransform: "uppercase" }}>{TYPE_LABEL[tpl.type]||tpl.type}</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap: "6px" }}>
                    {(tpl.tags||[]).slice(0,3).map(tag=><span key={tag} style={{ fontSize: "10px", padding:"4px 10px", borderRadius:"100px", background:D?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)", color:textSecondary, fontWeight: "500" }}>{tag}</span>)}
                  </div>
                  <div style={{ display:"flex", gap: "10px", marginTop:"auto", paddingTop: "8px" }}>
                    <button onClick={()=>openPreview(tpl)} className="btn-glass" style={{ flex:1, padding:"10px", fontSize: "13px", fontWeight: "600", color:textSecondary, borderRadius:"12px" }}>Preview</button>
                    <button onClick={()=>{ if(!isPro){setPage("upgrade");return;} const realHtml = renderTpl(tpl, form); if(setAppliedTemplateHtml) setAppliedTemplateHtml(realHtml); setPage("preview"); notify("✅ Premium template applied!"); }} className={isPro ? "btn-premium" : "btn-glass"} style={{ flex:1, padding:"10px", fontSize: "13px", fontWeight: "700", background:isPro?accent:undefined, color:isPro?(D?"#0c0a08":"#fff"):textMuted, borderRadius:"12px", border:"none", cursor:"pointer", boxShadow: isPro ? `0 4px 12px ${theme.accent1}44` : "none" }}>
                      {isPro ? "Use Template" : "🔒 Pro Only"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="card-hover-lift animate-fade-in-up glass-panel" style={{ padding:"80px 24px", textAlign:"center", border: `1px dashed ${theme.accent1}66` }}>
          <p className="animate-float" style={{ fontSize: "48px", marginBottom: "16px" }}>📭</p>
          <p style={{ fontSize: "18px", fontWeight: "800", fontFamily: "var(--font-display)", color: textPrimary, marginBottom: "8px" }}>No templates found</p>
          <p style={{ fontSize: "14px", color: textSecondary }}>Use the AI generator above to create your perfect custom template.</p>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {showPreview && selected && (
        <div className="animate-fade-in" onClick={()=>setShowPreview(false)} style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", padding: "24px" }}>
          <div className="animate-fade-in-scale" onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth: "840px", height: "90vh", display:"flex", flexDirection:"column", borderRadius: "24px", overflow:"hidden", background:D?"#111":"#f8f9fa", border: `1px solid ${D ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
            
            {/* Modal top bar */}
            <div style={{ padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", background:D?"rgba(26,26,26,0.9)":"rgba(255,255,255,0.9)", backdropFilter:"blur(20px)", borderBottom: `1px solid ${D ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, flexShrink:0, gap:8, flexWrap:"wrap" }}>
              <div>
                <p style={{ fontSize: "18px", fontWeight: "800", fontFamily: "var(--font-display)", color:textPrimary, margin: "0 0 4px" }}>{selected.name}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color:textSecondary, fontWeight: "500" }}>{selected.style}</span>
                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: textMuted }} />
                  <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.05em", color: TYPE_COLOR[selected.type] || theme.accent1, textTransform: "uppercase" }}>{TYPE_LABEL[selected.type]||selected.type}</span>
                </div>
              </div>
              <div style={{ display:"flex", gap: "10px" }}>
                {isPro && (
                  <button onClick={async () => {
                    notify("⏳ Preparing ultra-high-res PDF...");
                    await new Promise((res,rej)=>{
                      if(window.html2pdf){res();return;}
                      const s=document.createElement("script");
                      s.src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
                      s.onload=res;s.onerror=rej;document.head.appendChild(s);
                    });
                    const el = document.getElementById("tpl-preview-content");
                    if(!el) return;
                    await window.html2pdf().set({
                      margin:[0,0,0,0],
                      filename:`${form.name||"spider"}_premium_resume.pdf`,
                      image:{type:"jpeg",quality:1},
                      html2canvas:{scale:3,useCORS:true},
                      jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}
                    }).from(el).save();
                    notify("✨ Premium PDF downloaded successfully!");
                  }} className="btn-premium animate-pulse-glow" style={{ padding:"8px 16px", fontSize: "13px", fontWeight: "700", background:accent, color:D?"#0c0a08":"#fff", borderRadius:"12px", border:"none", cursor:"pointer" }}>
                    ⬇ Download PDF
                  </button>
                )}
                <button onClick={()=>setShowPreview(false)} className="btn-glass" style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", padding:0, fontSize: "16px", color:textSecondary, borderRadius:"12px" }}>✕</button>
              </div>
            </div>

            {/* Modify bar — Pro only */}
            {isPro && (
              <div style={{ padding:"12px 24px", background:D?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.5)", borderBottom:`1px solid ${D?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)"}`, display:"flex", gap: "12px", flexShrink:0 }}>
                <input value={modifyPrompt} onChange={e=>setModifyPrompt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&modifyTpl()} placeholder='✨ Tell AI to modify: "change headers to blue", "add a photo", "change to two-column"' style={{ background: D ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)", border: `1px solid ${theme.accent1}44`, flex:1, borderRadius:"12px", padding:"12px 16px", fontSize: "14px", color:textPrimary, outline: "none", transition: "all 0.2s" }} />
                <button onClick={modifyTpl} disabled={modifyLoading||!modifyPrompt.trim()} className={!modifyLoading && modifyPrompt.trim() ? "btn-premium" : "btn-glass"} style={{ padding:"0 20px", fontSize: "14px", fontWeight: "700", background:modifyLoading?"transparent":accent, color:modifyLoading?textMuted:(D?"#0c0a08":"#fff"), borderRadius:"12px", border:"none", cursor:modifyLoading?"not-allowed":"pointer", flexShrink:0, display: "flex", alignItems: "center", gap: "8px" }}>
                  {modifyLoading ? "⏳ Updating..." : "Apply Changes"}
                </button>
              </div>
            )}

            {/* Preview Area */}
            <div style={{ flex:1, overflowY:"auto", padding: "24px", background: D ? "#0a0a0c" : "#e4e5e7", display: "flex", flexDirection: "column", alignItems: "center" }}>
              
              {/* Actions */}
              <div style={{ display:"flex", gap: "12px", marginBottom: "24px", flexWrap:"wrap", width: "100%", maxWidth: "800px" }}>
                <button onClick={() => {
                  const realHtml = renderTpl(selected, form);
                  if (setAppliedTemplateHtml) setAppliedTemplateHtml(realHtml);
                  setShowPreview(false);
                  setPage("preview");
                  notify("✨ Premium template applied!");
                }} className="btn-premium animate-pulse-glow" style={{ flex:1, padding:"16px", borderRadius:"16px", background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, color: D ? "#0c0a08" : "#fff", fontSize: "15px", fontWeight: "800", border: "none" }}>
                  ✓ Set as Active Resume
                </button>
                
                {[
                  { label:"⬇ PDF", fmt:"pdf", icon: "📄" },
                  { label:"⬇ Word", fmt:"docx", icon: "📝" },
                  { label:"⬇ Image", fmt:"png", icon: "🖼️" },
                ].map(({label, fmt, icon}) => (
                  <button key={fmt} onClick={async () => {
                    if (!isPro) { setPage("upgrade"); return; }
                    notify(`⏳ Preparing high-res ${fmt.toUpperCase()}...`);
                    try {
                      const el = document.getElementById("tpl-preview-content");
                      if (fmt === "pdf") {
                        await new Promise((res,rej)=>{ if(window.html2pdf){res();return;} const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
                        await window.html2pdf().set({ margin:[0,0,0,0], filename:`${form.name||"spider"}_resume.pdf`, image:{type:"jpeg",quality:1}, html2canvas:{scale:3,useCORS:true}, jsPDF:{unit:"mm",format:"a4",orientation:"portrait"} }).from(el).save();
                        notify("✨ Superior PDF downloaded!");
                      } else if (fmt === "png") {
                        await new Promise((res,rej)=>{ if(window.html2canvas){res();return;} const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
                        const canvas = await window.html2canvas(el, {scale:3, useCORS:true, backgroundColor:"#fff"});
                        const a = document.createElement("a"); a.href=canvas.toDataURL("image/png"); a.download=`${form.name||"spider"}_resume.png`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
                        notify("✨ HD Canvas PNG downloaded!");
                      } else if (fmt === "docx") {
                        await new Promise((res,rej)=>{ if(window.JSZip){res();return;} const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
                        const esc=(s="")=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
                        const p=(t,b)=>`<w:p><w:r><w:rPr>${b?"<w:b/>":""}<w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">${esc(t)}</w:t></w:r></w:p>`;
                        let body=p(form.name||"",true)+p([form.email,form.phone,form.location].filter(Boolean).join(" | "),false)+p("",false);
                        if(form.summary) body+=p("SUMMARY",true)+p(form.summary,false)+p("",false);
                        if(form.experience?.some(e=>e.role)){body+=p("EXPERIENCE",true);form.experience.filter(e=>e.role).forEach(e=>{body+=p(`${e.role} · ${e.company||""} · ${e.duration||""}`,true);if(e.desc)body+=p(e.desc,false);body+=p("",false);});}
                        if(form.education?.some(e=>e.degree)){body+=p("EDUCATION",true);form.education.filter(e=>e.degree).forEach(e=>{body+=p(`${e.degree} — ${e.school||""} ${e.year?`(${e.year})`:""}`);});}
                        if(form.skills) body+=p("",false)+p("SKILLS",true)+p(form.skills,false);
                        const docXml=`<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}</w:body></w:document>`;
                        const zip=new window.JSZip();
                        zip.file("[Content_Types].xml",`<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
                        zip.file("_rels/.rels",`<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
                        zip.file("word/document.xml",docXml);
                        zip.file("word/_rels/document.xml.rels",`<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`);
                        const blob=await zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
                        const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`${form.name||"spider"}_resume.docx`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
                        notify("✨ MS Word doc downloaded!");
                      }
                    } catch(e) { notify("❌ Export failed — try again."); }
                  }} className="btn-glass card-hover-lift" style={{ padding:"0 16px", borderRadius:"16px", background: D?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.8)", color:textSecondary, fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", boxShadow: D ? "none" : "0 4px 12px rgba(0,0,0,0.05)" }}>
                    {icon} {label}
                  </button>
                ))}
              </div>

              {/* The actual HTML document */}
              <div id="tpl-preview-content" style={{ background:"#fff", width: "100%", maxWidth: "210mm", minHeight: "297mm", padding: 0, boxShadow:"0 24px 80px rgba(0,0,0,0.15)", overflow: "hidden" }}>
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}