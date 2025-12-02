import React, { useEffect } from "react";
import Lenis from "lenis";

import Navbar from "./components/Navbar";
import GravityHero from "./components/GravityHero";
import About from "./components/About";
import Skills from "./components/Skills";
import BentoGrid from "./components/BentoGrid";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  useEffect(() => {
    // Smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Feature cards data
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Intelligent code completion",
      description: "AI-powered suggestions that understand your codebase and accelerate your workflow."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Real-time collaboration",
      description: "Work together seamlessly with your team, no matter where you are."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Seamless deployment",
      description: "Deploy directly to Google Cloud with one click and scale effortlessly."
    }
  ];

  // Steps data
  const steps = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      ),
      title: "Download",
      description: "Get the Antigravity IDE for your platform and install in seconds."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Connect",
      description: "Link your Google Cloud account and access all your projects."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
      title: "Build",
      description: "Start coding with the power of Google's infrastructure behind you."
    }
  ];

  // Placeholder illustration component
  const Illustration = () => (
    <svg viewBox="0 0 400 300" style={{ width: "100%", maxWidth: "400px" }}>
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4285f4", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#34a853", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="200" cy="150" r="80" fill="url(#grad1)" opacity="0.3" />
      <circle cx="200" cy="150" r="60" fill="url(#grad1)" opacity="0.5" />
      <circle cx="200" cy="150" r="40" fill="url(#grad1)" />
      <circle cx="160" cy="120" r="15" fill="#fbbc04" opacity="0.8" />
      <circle cx="240" cy="180" r="20" fill="#ea4335" opacity="0.8" />
      <circle cx="220" cy="110" r="12" fill="#4285f4" opacity="0.9" />
    </svg>
  );

  return (
    <>
      <Navbar />
      <GravityHero />
      <About />
      <Skills />
      <div id="portfolio">
        <BentoGrid />
      </div>
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
