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
export default function TemplatesPage({ callAI, form, setPage, glassCard, glassBase, glassBtn, glassInput, textPrimary, textSecondary, textMuted, theme, D, isPro }) {
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
      const raw = await callAI(`Create a unique ${style} style resume template as complete self-contained HTML with inline CSS only.
Use these placeholders exactly: {{NAME}} {{ROLE}} {{EMAIL}} {{PHONE}} {{LOCATION}} {{SUMMARY}} {{SKILLS}} {{EXP_ITEMS}} {{EDU_ITEMS}}
The template must look like a real professional resume in ${style} style.
Return ONLY:
TEMPLATE_META:{"name":"${style} ${new Date().getHours()}","style":"${style}","tags":["${style.toLowerCase()}","auto"]}
TEMPLATE_HTML:
<div ...complete HTML...>`);
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
      const raw = await callAI(`Create a custom resume template based on: "${customPrompt}"
${form.name ? `For: ${form.name}, ${form.experience?.[0]?.role||""}` : ""}
Requirements: Complete HTML with inline CSS. Use placeholders: {{NAME}} {{ROLE}} {{EMAIL}} {{PHONE}} {{LOCATION}} {{SUMMARY}} {{SKILLS}} {{EXP_ITEMS}} {{EDU_ITEMS}}
Return ONLY:
TEMPLATE_META:{"name":"[name]","style":"[style]","tags":["custom"]}
TEMPLATE_HTML:
<div ...>`);
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
      const raw = await callAI(`Modify this resume template HTML: "${modifyPrompt}"
Current HTML (first 3000 chars): ${currentHtml.substring(0,3000)}
Return ONLY the complete modified HTML starting with <div. Keep all {{PLACEHOLDER}} variables. Apply changes faithfully.`);
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
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px 40px", zIndex: 1, position: "relative" }}>
      {toast && <div style={{ position:"fixed", top:76, left:"50%", transform:"translateX(-50%)", zIndex:999, background: D?"rgba(20,20,30,0.96)":"#fff", border:`1px solid ${theme.accent1}66`, borderRadius:14, padding:"11px 22px", fontSize:13, fontWeight:600, color:textPrimary, boxShadow:"0 8px 32px rgba(0,0,0,0.18)", backdropFilter:"blur(20px)", whiteSpace:"nowrap" }}>{toast}</div>}

      {/* Header + Custom Generator */}
      <div style={{ ...glassCard, padding:"18px 22px", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:14 }}>
          <div>
            <p style={{ fontSize:17, fontWeight:800, color:textPrimary, margin:"0 0 3px" }}>🎨 Resume Templates</p>
            <p style={{ fontSize:11, color:textMuted, margin:0 }}>{templates.length} templates · Auto-updated hourly · Stored in Firestore</p>
          </div>
          <span style={{ fontSize:10, padding:"4px 10px", borderRadius:10, background:"rgba(139,92,246,0.15)", color:"#8B5CF6", fontWeight:700, border:"1px solid rgba(139,92,246,0.3)" }}>⚡ Live Updates</span>
        </div>
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:textMuted, margin:"0 0 7px" }}>✨ Generate Custom Template {!isPro && <span style={{ color:theme.accent1 }}>· Pro Only</span>}</p>
        <div style={{ display:"flex", gap:8 }}>
          <input value={customPrompt} onChange={e=>setCustomPrompt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&genCustom()} placeholder='e.g. "dark navy with gold, two-column, finance executive"' style={{ ...glassInput, flex:1, borderRadius:12, padding:"10px 14px", fontSize:13, color:textPrimary, boxSizing:"border-box" }} />
          <button onClick={genCustom} disabled={customLoading||!customPrompt.trim()} style={{ ...glassBtn, padding:"10px 18px", fontSize:13, fontWeight:700, background:customLoading?"transparent":accent, color:customLoading?textMuted:(D?"#1a1410":"#2d2520"), borderRadius:12, border:"none", cursor:customLoading?"not-allowed":"pointer", flexShrink:0 }}>
            {customLoading ? "⏳" : "Generate →"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {TABS.map(([id,label,count])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{ ...glassBtn, padding:"7px 14px", fontSize:12, borderRadius:12, border:activeTab===id?`1.5px solid ${theme.accent1}`:undefined, color:activeTab===id?theme.accent1:textSecondary, background:activeTab===id?`${theme.accent1}18`:undefined, cursor:"pointer" }}>
            {label} <span style={{ opacity:.6 }}>({count})</span>
          </button>
        ))}
      </div>

      {loading && <div style={{ ...glassCard, padding:"48px 24px", textAlign:"center" }}><p style={{ fontSize:32, marginBottom:10 }}>⏳</p><p style={{ fontSize:14, fontWeight:700, color:textPrimary }}>Loading templates...</p></div>}

      {/* Grid */}
      {!loading && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(235px,1fr))", gap:14 }}>
          {filtered.map((tpl, idx) => {
            const color = TYPE_COLOR[tpl.type] || theme.accent1;
            return (
              <div key={tpl.firestoreId||idx} style={{ ...glassCard, overflow:"hidden", display:"flex", flexDirection:"column" }}>
                {/* Mini preview */}
                <div style={{ height:155, overflow:"hidden", cursor:"pointer", background:"#fff", position:"relative", borderRadius:"20px 20px 0 0" }} onClick={()=>openPreview(tpl)}>
                  <div style={{ transform:"scale(0.33)", transformOrigin:"top left", width:"303%", pointerEvents:"none" }}>
                    <div dangerouslySetInnerHTML={{ __html: renderCard(tpl, idx) }} />
                  </div>
                  <div style={{ position:"absolute", inset:0, background:"transparent" }} />
                  <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(0,0,0,0.55)", color:"#fff", fontSize:10, padding:"3px 8px", borderRadius:6, fontWeight:600 }}>👁 View</div>
                </div>
                {/* Info */}
                <div style={{ padding:"12px 14px", flex:1, display:"flex", flexDirection:"column", gap:7 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:textPrimary, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tpl.name}</p>
                    <span style={{ fontSize:9, padding:"2px 7px", borderRadius:7, background:color+"22", color, fontWeight:700, border:`1px solid ${color}44`, flexShrink:0 }}>{TYPE_LABEL[tpl.type]||tpl.type}</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {(tpl.tags||[]).slice(0,3).map(tag=><span key={tag} style={{ fontSize:9, padding:"2px 7px", borderRadius:6, background:D?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)", color:textMuted }}>{tag}</span>)}
                  </div>
                  <div style={{ display:"flex", gap:6, marginTop:"auto" }}>
                    <button onClick={()=>openPreview(tpl)} style={{ ...glassBtn, flex:1, padding:"7px", fontSize:12, color:textSecondary, borderRadius:10, cursor:"pointer" }}>👁 Preview</button>
                    <button onClick={()=>{ if(!isPro){setPage("upgrade");return;} openPreview(tpl); }} style={{ ...glassBtn, flex:1, padding:"7px", fontSize:12, fontWeight:700, background:isPro?accent:undefined, color:isPro?(D?"#1a1410":"#2d2520"):textMuted, borderRadius:10, border:"none", cursor:"pointer" }}>
                      {isPro ? "Use ✓" : "🔒 Pro"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ ...glassCard, padding:"48px 24px", textAlign:"center" }}>
          <p style={{ fontSize:36, marginBottom:12 }}>📭</p>
          <p style={{ fontSize:14, fontWeight:700, color:textPrimary, marginBottom:8 }}>No templates here yet</p>
          <p style={{ fontSize:13, color:textSecondary }}>Use the generator above to create a custom template.</p>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {showPreview && selected && (
        <div onClick={()=>setShowPreview(false)} style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:760, maxHeight:"92vh", display:"flex", flexDirection:"column", borderRadius:20, overflow:"hidden", background:D?"#161616":"#f0f0f0" }}>
            {/* Modal top bar */}
            <div style={{ padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", background:D?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", flexShrink:0, gap:8, flexWrap:"wrap" }}>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:textPrimary, margin:0 }}>{selected.name}</p>
                <p style={{ fontSize:10, color:textMuted, margin:0 }}>{selected.style} · {TYPE_LABEL[selected.type]||selected.type}</p>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {isPro && <button onClick={()=>window.print()} style={{ ...glassBtn, padding:"7px 14px", fontSize:12, fontWeight:700, background:accent, color:D?"#1a1410":"#2d2520", borderRadius:10, border:"none", cursor:"pointer" }}>⬇ Download PDF</button>}
                <button onClick={()=>setShowPreview(false)} style={{ ...glassBtn, padding:"7px 12px", fontSize:13, color:textSecondary, borderRadius:10, cursor:"pointer" }}>✕</button>
              </div>
            </div>
            {/* Modify bar — Pro only */}
            {isPro && (
              <div style={{ padding:"9px 14px", background:D?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.65)", borderBottom:`1px solid ${D?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)"}`, display:"flex", gap:8, flexShrink:0 }}>
                <input value={modifyPrompt} onChange={e=>setModifyPrompt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&modifyTpl()} placeholder='Modify: e.g. "change to blue, add a photo placeholder, make header bigger"' style={{ ...glassInput, flex:1, borderRadius:10, padding:"8px 14px", fontSize:12, color:textPrimary, boxSizing:"border-box" }} />
                <button onClick={modifyTpl} disabled={modifyLoading||!modifyPrompt.trim()} style={{ ...glassBtn, padding:"8px 16px", fontSize:12, fontWeight:700, background:modifyLoading?"transparent":accent, color:modifyLoading?textMuted:(D?"#1a1410":"#2d2520"), borderRadius:10, border:"none", cursor:modifyLoading?"not-allowed":"pointer", flexShrink:0 }}>
                  {modifyLoading ? "⏳" : "✏️ Modify & Save"}
                </button>
              </div>
            )}
            {/* Preview */}
            <div style={{ flex:1, overflowY:"auto", padding:18 }}>
              <div style={{ background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.14)" }}>
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
