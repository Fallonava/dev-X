import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-logo" style={{ marginBottom: "32px" }}>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, var(--primary), var(--accent-green))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Antigravity
          </div>
        </div>

        <div className="footer-links">
          <a href="#about">About Google</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#help">Help</a>
        </div>

        <div style={{ marginTop: "32px", fontSize: "14px" }}>
          © {new Date().getFullYear()} Google LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}