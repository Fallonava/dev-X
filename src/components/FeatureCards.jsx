import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeatureCards({ title, features }) {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;

        gsap.fromTo(
            section.querySelector("h2"),
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                },
            }
        );

        gsap.fromTo(
            section.querySelectorAll(".feature-card"),
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%",
                },
            }
        );
    }, []);

    return (
        <section ref={sectionRef} style={{ padding: "120px 0" }}>
            <div className="container">
                <h2 style={{ textAlign: "center", marginBottom: "64px" }}>{title}</h2>

                <div className="grid-3">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card card">
                            <div className="feature-icon">
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .feature-card {
          text-align: center;
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, var(--primary), var(--accent-green));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .feature-icon svg {
          width: 32px;
          height: 32px;
        }
      `}</style>
        </section>
    );
}
