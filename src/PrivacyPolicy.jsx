// src/PrivacyPolicy.jsx
export default function PrivacyPolicy({ onBack, theme, D, glassCard, textPrimary, textSecondary, textMuted }) {
  const sections = [
    {
      title: "1. Introduction",
      body: "Spider Resume respects your privacy. This policy explains what information we collect, how we use it, and your rights. By using Spider Resume, you agree to the practices described here.",
    },
    {
      title: "2. Information We Collect",
      bullets: [
        "Resume content you enter (name, experience, education, skills, etc.)",
        "Account details such as your name and email address",
        "Basic analytics data such as feature usage to improve the platform",
        "Payment identifiers from Razorpay when upgrading to Pro (no card details stored)",
      ],
    },
    {
      title: "3. How We Use Your Information",
      bullets: [
        "To generate and display your resume using AI tools",
        "To maintain and improve the Spider Resume platform",
        "To manage your account and subscription status",
        "To enforce daily usage limits for free-tier users",
      ],
    },
    {
      title: "4. Data Storage",
      body: "Your data is stored securely using Google Firebase Firestore with encryption at rest and in transit. Resume content and account information is stored under your unique user ID and retained as long as your account is active.",
    },
    {
      title: "5. Data Sharing",
      body: "Spider Resume does not sell or share your personal information with third parties, except when required by law or to provide core services (such as sending resume content to Groq AI for generation — processed transiently and not retained by them).",
    },
    {
      title: "6. Cookies",
      body: "We may use cookies and local storage to maintain your session and remember your preferences. Free-tier users may see ads served by Google AdSense which uses cookies. You may disable cookies in your browser, though some features may not work correctly.",
    },
    {
      title: "7. Security",
      body: "We take reasonable technical and organisational measures to protect your data against unauthorised access, loss, or misuse. All data is transmitted over HTTPS and stored in access-controlled cloud infrastructure.",
    },
    {
      title: "8. User Rights",
      body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us. We will respond within 30 days.",
    },
    {
      title: "9. Changes to This Policy",
      body: "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of Spider Resume after changes constitutes your acceptance.",
    },
    {
      title: "10. Contact",
      contact: "contact@spiderresume.com",
    },
  ];

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: textMuted, fontSize: "13px", marginBottom: "28px", padding: 0 }}>← Back</button>

      <h1 style={{ fontSize: "32px", fontWeight: "800", color: textPrimary, margin: "0 0 6px" }}>Privacy Policy</h1>
      <p style={{ fontSize: "12px", color: textMuted, margin: "0 0 32px" }}>Last updated: March 2026</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sections.map(({ title, body, bullets, contact }) => (
          <div key={title} style={{ ...glassCard, padding: "22px 26px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: textPrimary, margin: "0 0 10px", letterSpacing: "0.01em" }}>{title}</p>
            {body && <p style={{ fontSize: "13px", color: textSecondary, lineHeight: 1.75, margin: 0 }}>{body}</p>}
            {bullets && (
              <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "5px" }}>
                {bullets.map(b => <li key={b} style={{ fontSize: "13px", color: textSecondary, lineHeight: 1.7 }}>{b}</li>)}
              </ul>
            )}
            {contact && (
              <a href={`mailto:${contact}`} style={{ fontSize: "13px", color: theme.accent1, fontWeight: "600", textDecoration: "none" }}>{contact}</a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
