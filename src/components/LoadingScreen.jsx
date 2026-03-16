import { DARK_THEMES_FREE, LOGO_SRC } from "../constants/themes";

const LoadingScreen = () => (
  <div style={{ minHeight: "100vh", background: DARK_THEMES_FREE[0].bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ textAlign: "center", color: "rgba(240,230,215,0.8)" }}>
      <img src={LOGO_SRC} style={{ height: "80px", mixBlendMode: "screen", marginBottom: "16px" }} alt="Spider" />
      <p style={{ fontSize: "14px", opacity: 0.6 }}>Loading...</p>
    </div>
  </div>
);

export default LoadingScreen;
