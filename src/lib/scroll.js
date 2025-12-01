import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollSmoother);

export function initSmoothScroll(wrapper, content) {
  if (typeof window !== "undefined") {
    return ScrollSmoother.create({
      wrapper,
      content,
      smooth: 1.2,
      effects: true
    });
  }
}