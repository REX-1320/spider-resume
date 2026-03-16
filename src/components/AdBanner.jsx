import { useEffect } from "react";

const AdBanner = ({ isDark }) => {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }, []);
  return (
    <div style={{
      ...(isDark
        ? { background: "rgba(255,255,255,0.06)", backdropFilter: "blur(28px) saturate(180%)", WebkitBackdropFilter: "blur(28px) saturate(180%)", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)" }
        : { background: "rgba(255,255,255,0.22)", backdropFilter: "blur(30px) saturate(200%)", WebkitBackdropFilter: "blur(30px) saturate(200%)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)" }),
      borderRadius: "20px", padding: "12px 16px", margin: "10px 0", overflow: "hidden",
    }}>
      <p style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.35, color: isDark ? "rgba(240,230,215,0.6)" : "rgba(100,80,60,0.5)", marginBottom: "8px" }}>Sponsored</p>
      <ins className="adsbygoogle"
        style={{ display: "inline-block", width: "300px", height: "250px" }}
        data-ad-client="ca-pub-4908276514558540"
        data-ad-slot="5062281330"
      />
    </div>
  );
};

export default AdBanner;
