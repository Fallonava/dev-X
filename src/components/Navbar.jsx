import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Navbar({ theme, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // Initial entry animation - Heavy ease, appears first
    gsap.fromTo(
      ".navbar",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "cubic-bezier(0.2, 0.8, 0.2, 1.0)", delay: 0.1 }
    );
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      // Staggered animation for mobile menu links
      gsap.fromTo(
        ".mobile-nav-link",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power2.out", delay: 0.2 }
      );
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav className="navbar" ref={navRef}>
        <div className="nav-content">
          {/* Logo */}
          <div className="logo">
            <a href="#">Faishal</a>
          </div>

          {/* Desktop Menu */}
          <ul className="desktop-menu">
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          {/* Right Icons (Placeholder for Search/Bag if needed, currently just empty or Contact btn for desktop) */}
          <div className="nav-right">
            {/* Using a simple search icon placeholder as requested by Apple style prompt */}
            <button className="icon-btn" aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          {/* Mobile Menu Toggle (Hamburger) */}
          <button
            className={`menu-toggle ${isMenuOpen ? "is-active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            aria-expanded={isMenuOpen}
          >
            <span className="line line-top"></span>
            <span className="line line-bottom"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">
          <ul className="mobile-nav-list">
            <li><a href="#about" className="mobile-nav-link" onClick={toggleMenu}>About</a></li>
            <li><a href="#skills" className="mobile-nav-link" onClick={toggleMenu}>Skills</a></li>
            <li><a href="#portfolio" className="mobile-nav-link" onClick={toggleMenu}>Portfolio</a></li>
            <li><a href="#services" className="mobile-nav-link" onClick={toggleMenu}>Services</a></li>
            <li><a href="#testimonials" className="mobile-nav-link" onClick={toggleMenu}>Testimonials</a></li>
            <li><a href="#contact" className="mobile-nav-link" onClick={toggleMenu}>Contact</a></li>
          </ul>
        </div>
      </div>

      <style>{`
        /* Navbar Container */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 48px; /* Apple standard is often 44px or 48px */
          background: rgba(20, 20, 20, 0.7); /* Specific Apple dark glass */
          backdrop-filter: saturate(180%) blur(25px); /* High saturation and blur */
          -webkit-backdrop-filter: saturate(180%) blur(25px);
          z-index: 1000;
          transition: background 0.3s ease;
          display: flex;
          justify-content: center;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .nav-content {
          max-width: 1000px;
          width: 100%;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
        }

        /* Logo */
        .logo a {
          color: #f5f5f7;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          letter-spacing: -0.02em;
        }

        /* Desktop Menu */
        .desktop-menu {
          display: flex;
          gap: 32px;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .desktop-menu a {
          color: #f5f5f7;
          text-decoration: none;
          font-size: 12px;
          font-weight: 400;
          opacity: 0.8;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* Hover State: Focus Effect */
        .desktop-menu:hover a {
          opacity: 0.5; /* Dim others */
        }

        .desktop-menu a:hover {
          opacity: 1; /* Highlight hovered */
          color: #fff;
        }

        /* Right Icons */
        .nav-right {
            display: flex;
            align-items: center;
        }
        
        .icon-btn {
            background: none;
            border: none;
            color: #f5f5f7;
            opacity: 0.8;
            cursor: pointer;
            padding: 8px;
            transition: opacity 0.3s;
        }
        
        .icon-btn:hover {
            opacity: 1;
        }

        /* Hamburger Menu (Apple Style) */
        .menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 6px; /* Initial gap */
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          z-index: 1002;
          position: relative;
        }

        .menu-toggle .line {
          display: block;
          width: 18px;
          height: 1.5px; /* Thinner lines */
          background: #f5f5f7;
          border-radius: 1px;
          transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
          position: absolute;
          left: 3px; /* Center horizontally */
        }

        .menu-toggle .line-top {
            top: 9px; /* Initial position */
        }
        
        .menu-toggle .line-bottom {
            bottom: 9px; /* Initial position */
        }

        /* Active State (X) */
        .menu-toggle.is-active .line-top {
          top: 11px;
          transform: rotate(45deg);
        }

        .menu-toggle.is-active .line-bottom {
          bottom: 11px;
          transform: rotate(-45deg);
        }

        /* Mobile Menu Overlay */
        .mobile-menu {
          position: fixed;
          top: 48px; /* Below navbar */
          left: 0;
          width: 100%;
          height: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          overflow: hidden;
          transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 999;
        }

        .mobile-menu.open {
          height: calc(100vh - 48px);
        }
        
        .mobile-menu-content {
            padding: 40px 24px;
        }

        .mobile-nav-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .mobile-nav-link {
            display: block;
            color: #f5f5f7;
            text-decoration: none;
            font-size: 24px; /* Larger for mobile */
            font-weight: 600;
            padding: 16px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            opacity: 0; /* Hidden initially for animation */
        }

        /* Responsive */
        @media (max-width: 768px) {
          .desktop-menu {
            display: none;
          }

          .menu-toggle {
            display: flex;
          }
          
          .nav-right {
             display: none; /* Hide search on mobile header to save space or move to menu */
          }
          
          .navbar {
             justify-content: space-between; /* Spread logo and hamburger */
          }
          
          .nav-content {
             padding: 0 20px;
          }
        }
      `}</style>
    </>
  );
}