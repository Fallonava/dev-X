import React, { useEffect, useState } from "react";
import gsap from "gsap";

export default function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    gsap.from(".navbar", {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.5,
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
          font-size: 1.2rem;
          padding: 5px;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .theme-toggle:hover {
          background: var(--glass-bg);
        }
      `}</style>
    </nav>
  );
}