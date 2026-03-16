export const DESKTOP_STYLE = `
@media (min-width: 860px) {
  .desktop-preview { display: block !important; }
}
@media (max-width: 859px) {
  .desktop-grid { grid-template-columns: 1fr !important; }
}
`;

export const PRINT_STYLE = `@media print {
  body * { visibility: hidden !important; }
  #resume-printable, #resume-printable * { visibility: visible !important; }
  #resume-printable { position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; padding: 32px 40px !important; background: white !important; box-shadow: none !important; border: none !important; z-index: 99999 !important; }
  #resume-printable h1 { color: #1a1612 !important; font-size: 22px !important; }
  #resume-printable h2 { color: #666 !important; font-size: 9px !important; }
  #resume-printable p, #resume-printable span { color: #333 !important; }
}`;

export const FREE_TEMPLATES = ["Classic"];
export const PRO_TEMPLATES = ["Modern", "Minimal", "Bold"];
export const LOGO_SRC = "/logo.png";

// Free themes (available to all users)
export const LIGHT_THEMES_FREE = [
  // ── 10 FREE LIGHT THEMES ──
  { id: "sunset",    name: "Sunset",    bg: "linear-gradient(135deg, #f0e0d0 0%, #e8d0c0 25%, #ddd0c8 50%, #d0d8e0 75%, #dcd0e0 100%)", accent1: "#c9845e", accent2: "#e8a878", blob1: "rgba(255,180,120,0.35)", blob2: "rgba(180,200,255,0.28)", blob3: "rgba(200,240,210,0.22)" },
  { id: "lavender",  name: "Lavender",  bg: "linear-gradient(135deg, #e4dcf5 0%, #d8ccec 25%, #dcd8ec 50%, #d0d4f0 75%, #dcd8f0 100%)", accent1: "#8a5ec9", accent2: "#aa80e8", blob1: "rgba(180,130,255,0.35)", blob2: "rgba(140,170,255,0.28)", blob3: "rgba(210,185,255,0.22)" },
  { id: "ocean",     name: "Ocean",     bg: "linear-gradient(135deg, #cceaf5 0%, #b8dced 25%, #a8d4e0 50%, #9ac4e8 75%, #80ccea 100%)", accent1: "#4090b0", accent2: "#60b8d8", blob1: "rgba(100,200,230,0.35)", blob2: "rgba(100,160,220,0.28)", blob3: "rgba(80,190,210,0.22)" },
  { id: "rose",      name: "Rose",      bg: "linear-gradient(135deg, #faeaec 0%, #f0dade 25%, #eeccd8 50%, #f5dce8 75%, #f0dce4 100%)", accent1: "#c85070", accent2: "#e87090", blob1: "rgba(230,160,180,0.35)", blob2: "rgba(210,140,170,0.28)", blob3: "rgba(240,180,200,0.22)" },
  { id: "mint",      name: "Mint",      bg: "linear-gradient(135deg, #daf5ea 0%, #ccecdc 25%, #c0e8d0 50%, #ccecd8 75%, #d4f0e2 100%)", accent1: "#3a9e6e", accent2: "#58c48e", blob1: "rgba(120,210,170,0.35)", blob2: "rgba(100,195,155,0.28)", blob3: "rgba(130,215,180,0.22)" },
  { id: "peach",     name: "Peach",     bg: "linear-gradient(135deg, #fff4e8 0%, #ffeada 25%, #ffdec8 50%, #ffead4 75%, #fff4e2 100%)", accent1: "#d47840", accent2: "#f09858", blob1: "rgba(255,185,130,0.35)", blob2: "rgba(255,165,105,0.28)", blob3: "rgba(255,175,120,0.22)" },
  { id: "arctic",    name: "Arctic",    bg: "linear-gradient(135deg, #e4f4fc 0%, #d4ecf8 25%, #c8e8f8 50%, #cce8fc 75%, #d8f0fc 100%)", accent1: "#3878b8", accent2: "#58a0dc", blob1: "rgba(100,180,240,0.35)", blob2: "rgba(80,160,220,0.28)", blob3: "rgba(90,170,230,0.22)" },
  { id: "sand",      name: "Sand",      bg: "linear-gradient(135deg, #f8f0dc 0%, #f0e4c8 25%, #eadcbc 50%, #f0e0c4 75%, #f5eacc 100%)", accent1: "#a07828", accent2: "#c09840", blob1: "rgba(200,160,80,0.35)", blob2: "rgba(180,140,60,0.28)", blob3: "rgba(190,150,70,0.22)" },
  { id: "cherry",    name: "Cherry",    bg: "linear-gradient(135deg, #fce8f0 0%, #f8d8e8 25%, #f4cce0 50%, #f8d8ec 75%, #fce4f4 100%)", accent1: "#c03060", accent2: "#e05080", blob1: "rgba(220,100,140,0.35)", blob2: "rgba(200,80,120,0.28)", blob3: "rgba(230,110,150,0.22)" },
  { id: "sage",      name: "Sage",      bg: "linear-gradient(135deg, #e4ede4 0%, #d8e4d8 25%, #ccdccc 50%, #d4e0d4 75%, #dce8dc 100%)", accent1: "#4e7a4e", accent2: "#6a9e6a", blob1: "rgba(120,170,120,0.35)", blob2: "rgba(100,155,100,0.28)", blob3: "rgba(110,162,110,0.22)" },
];

export const DARK_THEMES_FREE = [
  // ── 10 FREE DARK THEMES ──
  { id: "ember",     name: "Ember",     bg: "linear-gradient(135deg, #1e1608 0%, #261c0c 25%, #1c2010 50%, #181a20 75%, #1e181e 100%)", accent1: "#d4a050", accent2: "#f0c060", blob1: "rgba(210,160,80,0.2)",  blob2: "rgba(90,120,200,0.14)", blob3: "rgba(90,170,130,0.12)" },
  { id: "violet",    name: "Violet",    bg: "linear-gradient(135deg, #160c28 0%, #180c24 25%, #140e24 50%, #100c24 75%, #12101e 100%)", accent1: "#9a5cd4", accent2: "#bc80f0", blob1: "rgba(155,90,210,0.22)", blob2: "rgba(100,120,210,0.16)", blob3: "rgba(170,125,210,0.14)" },
  { id: "midnight",  name: "Midnight",  bg: "linear-gradient(135deg, #080e1e 0%, #0c1226 25%, #080e1c 50%, #060c18 75%, #080c18 100%)", accent1: "#5880d4", accent2: "#78a0f0", blob1: "rgba(88,128,210,0.2)",  blob2: "rgba(120,140,230,0.16)", blob3: "rgba(80,110,185,0.14)" },
  { id: "crimson",   name: "Crimson",   bg: "linear-gradient(135deg, #200810 0%, #240c14 25%, #1c0810 50%, #220a12 75%, #1e0c12 100%)", accent1: "#d44060", accent2: "#f06080", blob1: "rgba(210,64,96,0.2)",  blob2: "rgba(240,96,128,0.16)", blob3: "rgba(185,55,85,0.14)" },
  { id: "forest",    name: "Forest",    bg: "linear-gradient(135deg, #081408 0%, #0c1a0a 25%, #0a140a 50%, #0a180a 75%, #08140a 100%)", accent1: "#50c850", accent2: "#72e872", blob1: "rgba(80,200,80,0.2)",  blob2: "rgba(115,235,115,0.16)", blob3: "rgba(70,185,70,0.14)" },
  { id: "royal",     name: "Royal",     bg: "linear-gradient(135deg, #080c1e 0%, #0a1028 25%, #080c1c 50%, #0a1020 75%, #080e1c 100%)", accent1: "#40b0d0", accent2: "#60d4f0", blob1: "rgba(64,176,208,0.2)", blob2: "rgba(96,210,240,0.16)", blob3: "rgba(55,165,195,0.14)" },
  { id: "obsidian",  name: "Obsidian",  bg: "linear-gradient(135deg, #101010 0%, #141414 25%, #121212 50%, #0e0e10 75%, #101012 100%)", accent1: "#a0a0c0", accent2: "#c0c0e0", blob1: "rgba(160,160,200,0.18)", blob2: "rgba(140,140,180,0.14)", blob3: "rgba(150,150,190,0.12)" },
  { id: "aurora",    name: "Aurora",    bg: "linear-gradient(135deg, #080e18 0%, #0c1420 25%, #081418 50%, #081018 75%, #0a1018 100%)", accent1: "#40d8a0", accent2: "#60f0c0", blob1: "rgba(64,216,160,0.2)", blob2: "rgba(80,180,200,0.16)", blob3: "rgba(50,200,140,0.14)" },
  { id: "dusk",      name: "Dusk",      bg: "linear-gradient(135deg, #1a100c 0%, #201610 25%, #1c1210 50%, #1e1410 75%, #1a1210 100%)", accent1: "#e08040", accent2: "#f0a060", blob1: "rgba(224,128,64,0.2)", blob2: "rgba(240,160,96,0.16)", blob3: "rgba(210,115,52,0.14)" },
  { id: "neon",      name: "Neon",      bg: "linear-gradient(135deg, #050510 0%, #08080e 25%, #060610 50%, #08060e 75%, #06060e 100%)", accent1: "#e040e0", accent2: "#f060f0", blob1: "rgba(224,64,224,0.22)", blob2: "rgba(64,200,240,0.18)", blob3: "rgba(200,50,200,0.16)" },
];

export const LIGHT_THEMES_PRO = [];
export const DARK_THEMES_PRO  = [];

// Promo codes
export const PROMO_CODES = {
  "SPIDER2026": { label: "1 Year Free", months: 12 },
  "LAUNCH50":   { label: "1 Year Free", months: 12 },
  "REXFREE":    { label: "1 Year Free", months: 12 },
};
