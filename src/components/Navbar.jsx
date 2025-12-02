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
      <div className="logo">Faishal</div>

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
        <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
        <li><a href="#skills" onClick={() => setIsMenuOpen(false)}>Skills</a></li>
        <li><a href="#portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</a></li>
        <li><a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a></li>
        <li><a href="#testimonials" onClick={() => setIsMenuOpen(false)}>Testimonials</a></li>
        <li>
          <a href="#contact" className="nav-download-btn" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Contact Me
          </a>
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