import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AntigravitySection({ title, subtitle, image, imagePosition = "right", children }) {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;

        gsap.fromTo(
            section.querySelector(".section-content"),
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                },
            }
        );

        if (section.querySelector(".section-image")) {
            gsap.fromTo(
                section.querySelector(".section-image"),
                { x: imagePosition === "right" ? 50 : -50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                    },
                }
            );
        }
    }, [imagePosition]);

    return (
        <section ref={sectionRef} style={{ padding: "120px 0" }}>
            <div className="container">
                <div className={`two-column ${imagePosition === "left" ? "reverse" : ""}`}>
                    {imagePosition === "left" && image && (
                        <div className="section-image">
                            {image}
                        </div>
                    )}

                    <div className="section-content">
                        <h2>{title}</h2>
                        {subtitle && <p style={{ fontSize: "20px", marginBottom: "32px" }}>{subtitle}</p>}
                        {children}
                    </div>

                    {imagePosition === "right" && image && (
                        <div className="section-image">
                            {image}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .two-column.reverse {
          direction: rtl;
        }

        .two-column.reverse > * {
          direction: ltr;
        }

        .section-image {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .section-image img,
        .section-image svg {
          width: 100%;
          max-width: 500px;
          height: auto;
        }

        @media (max-width: 768px) {
          .two-column.reverse {
            direction: ltr;
          }
        }
      `}</style>
        </section>
    );
}
