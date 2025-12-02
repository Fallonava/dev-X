import React, { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";

import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  useEffect(() => {
    // Smooth scroll
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1.2,
      smoothWheel: true,
      smoothTouch: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP fade-in
    gsap.from(".fade", {
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });

    return () => lenis.destroy();
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
}