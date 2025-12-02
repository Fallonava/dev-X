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
      { y: -100, opacity: 0 },
      { y: 20, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
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
          <a href="#contact" className="nav-download-btn" onClick={() => setIsMenuOpen(false)}>
            Contact Me
          </a>
        </li>
      </ul>

      <style>{`
        .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          z-index: 1001;
        }

        .menu-toggle span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .menu-toggle span.open:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .menu-toggle span.open:nth-child(2) {
          opacity: 0;
        }

        .menu-toggle span.open:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
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
            width: 100%;
            max-width: 320px;
            background: rgba(28, 28, 30, 0.95);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px;
            gap: 24px;
            transition: right 0.5s cubic-bezier(0.19, 1, 0.22, 1);
            border-left: 1px solid var(--glass-border);
            box-shadow: -20px 0 40px rgba(0, 0, 0, 0.5);
            z-index: 999;
          }

          .nav-menu.active {
            right: 0;
          }

          .nav-menu li {
            width: 100%;
            text-align: center;
          }

          .nav-menu a {
            font-size: 1.5rem;
            display: block;
            padding: 16px 0;
            color: var(--text);
            font-weight: 600;
          }
          
          .nav-menu a:hover {
            color: var(--primary);
            background: transparent;
          }

          .nav-download-btn {
            width: 100%;
            justify-content: center;
            margin-top: 20px;
            background: var(--primary);
            color: white;
            padding: 16px;
          }
          
          .nav-download-btn:hover {
            background: #1a85ff;
          }
        }
      `}</style>
    </nav>
  );
}