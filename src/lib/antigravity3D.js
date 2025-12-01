import { gsap } from "gsap";

export function antiGravity3D(layers) {
  window.addEventListener("mousemove", e => {
    layers.forEach((layer,i)=>{
      const depth = (i+1) * 12;
      gsap.to(layer, {
        x: (window.innerWidth/2 - e.clientX) / depth,
        y: (window.innerHeight/2 - e.clientY) / depth,
        rotationX: -(e.clientY / depth),
        rotationY: (e.clientX / depth),
        duration: 1.4,
        ease: "expo.out"
      });
    });
  });
}