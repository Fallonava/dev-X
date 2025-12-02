import React, { useEffect, useState } from "react";
import gsap from "gsap";

export default function Navbar() {
  // Default to 'light' if no preference is saved
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    gsap.from(".navbar", {
      y: -50,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      delay: 0.2,
    });
  }, []);

  return (
    <nav className="navbar glass">
      <div className="logo">Antigravity</div>

      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Work</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#contact">Contact</a></li>
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
      `}</style>
    </nav>
  );
}