import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

import Navbar from "./components/Navbar";
import GravityHero from "./components/GravityHero";
import BentoGrid from "./components/BentoGrid";
import Process from "./components/Process";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CursorParticles from "./components/CursorParticles";
import MagneticCursor from "./components/MagneticCursor";

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

  return (
    <>
      <MagneticCursor />
      <CursorParticles />
      <Navbar />
      <GravityHero />
      <BentoGrid />
      <Process />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}
