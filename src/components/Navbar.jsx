import React, { useEffect } from "react";
import gsap from "gsap";

export default function Navbar() {
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
      </ul>
    </nav>
  );
}