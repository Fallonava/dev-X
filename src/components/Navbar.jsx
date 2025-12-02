import React, { useEffect, useState } from "react";
import gsap from "gsap";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    gsap.fromTo(
      ".navbar",
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.3 }
    );
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">Antigravity</div>

      {/* Mobile Menu Toggle */}
      <button
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
        aria-expanded={isMenuOpen}
      >
        <span className={isMenuOpen ? "open" : ""}></span>
        <span className={isMenuOpen ? "open" : ""}></span>
        <span className={isMenuOpen ? "open" : ""}></span>
      </button>

      {/* Navigation Menu */}
      <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
        <li><a href="#product" onClick={() => setIsMenuOpen(false)}>Product</a></li>
        <li><a href="#use-cases" onClick={() => setIsMenuOpen(false)}>Use Cases</a></li>
        <li><a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a></li>
        <li><a href="#blog" onClick={() => setIsMenuOpen(false)}>Blog</a></li>
        <li><a href="#resources" onClick={() => setIsMenuOpen(false)}>Resources</a></li>
        <li>
          <button className="nav-download-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download
          </button>
        </li>
      </ul>

      <style>{`
        .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          z-index: 1001;
        }

        .menu-toggle span {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .menu-toggle span.open:nth-child(1) {
          transform: rotate(45deg) translate(8px, 8px);
        }

        .menu-toggle span.open:nth-child(2) {
          opacity: 0;
        }

        .menu-toggle span.open:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: flex;
          }

          .nav-menu {
            position: fixed;
            top: 0;
            right: -100%;
            height: 100vh;
            width: 280px;
            background: rgba(10, 14, 39, 0.95);
            backdrop-filter: blur(20px);
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 40px;
            gap: 32px;
            transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            border-left: 1px solid var(--glass-border);
            box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
          }

          .nav-menu.active {
            right: 0;
          }

          .nav-menu li {
            width: 100%;
          }

          .nav-menu a {
            font-size: 1.2rem;
            display: block;
            padding: 12px 0;
          }

          .nav-download-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </nav>
  );
}