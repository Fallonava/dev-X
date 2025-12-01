import { gsap } from "gsap";

export function initParticleField(container, count = 70) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    container.appendChild(p);
    randomOrbit(p);
  }
}

function randomOrbit(p) {
  gsap.set(p, { 
    x: gsap.utils.random(-200, 200),
    y: gsap.utils.random(-200, 200),
    scale: gsap.utils.random(0.3, 1.5),
    opacity: gsap.utils.random(0.2, 0.8)
  });

  gsap.to(p, {
    x: `+=${gsap.utils.random(-150,150)}`,
    y: `+=${gsap.utils.random(-150,150)}`,
    duration: gsap.utils.random(6,14),
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
}

export function cursorMagnet(container, strength = 180) {
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX - window.innerWidth/2) / strength;
    const y = (e.clientY - window.innerHeight/2) / strength;

    gsap.to(container.querySelectorAll(".particle"), {
      x: `+=${x*10}`,
      y: `+=${y*10}`,
      duration: 1.5,
      ease: "expo.out"
    });
  });
}