import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StepsSection({ title, steps }) {
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
            section.querySelectorAll(".step-card"),
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.3,
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

                <div className="steps-grid grid-3">
                    {steps.map((step, index) => (
                        <div key={index} className="step-card card">
                            <div className="step-number">{index + 1}</div>
                            <div className="step-icon">
                                {step.icon}
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .step-card {
          text-align: center;
          position: relative;
        }

        .step-number {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
        }

        .step-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: rgba(66, 133, 244, 0.1);
          border: 2px solid var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .step-icon svg {
          width: 40px;
          height: 40px;
        }

        @media (min-width: 769px) {
          .step-card:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -16px;
            transform: translateX(50%);
            width: 32px;
            height: 2px;
            background: linear-gradient(90deg, var(--primary), transparent);
          }
        }
      `}</style>
        </section>
    );
}
