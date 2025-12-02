import React, { useEffect, useState } from "react";
import gsap from "gsap";

export default function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // Fixed animation to ensure navbar appears
    gsap.fromTo(
      ".navbar",
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.2 }
    );
  }, []);

  return (
    <nav className="navbar glass">
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
        <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
        <li><a href="#projects" onClick={() => setIsMenuOpen(false)}>Work</a></li>
        <li><a href="#skills" onClick={() => setIsMenuOpen(false)}>Skills</a></li>
        <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
        <li>
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </li>
      </ul>

      <style>{`
        .theme-toggle {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          padding: 6px;
          border-radius: 50%;
          transition: background 0.2s, transform 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text);
        }
        .theme-toggle:hover {
          background: var(--glass-border);
          transform: rotate(15deg);
        }

        /* Mobile Menu Toggle Button */
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

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .menu-toggle {
            display: flex;
          }

          .nav-menu {
            position: fixed;
            top: 0;
            right: -100%;
            height: 100vh;
            width: 250px;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 40px;
            gap: 32px;
            transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            border-left: 1px solid var(--glass-border);
            box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
          }

          .nav-menu.active {
            right: 0;
          }

          .nav-menu li {
            width: 100%;
          }

          .nav-menu a {
            font-size: 1.1rem;
            display: block;
            padding: 8px 0;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            padding: 10px 20px !important;
            top: 20px;
            min-width: calc(100vw - 40px);
          }

          .navbar:hover {
            padding: 10px 20px !important;
          }
        }
      `}</style>
    </nav>
  );
}