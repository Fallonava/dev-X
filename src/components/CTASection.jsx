import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection({ title, buttonText = "Download Antigravity" }) {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;

        gsap.fromTo(
            section.querySelectorAll(".cta-content > *"),
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                },
            }
        );
    }, []);

    return (
        <section ref={sectionRef} style={{ padding: "120px 0" }}>
            <div className="container">
                <div className="cta-box">
                    <div className="cta-content">
                        <h2>{title}</h2>
                        <button className="btn btn-primary" style={{ marginTop: "32px", fontSize: "18px", padding: "18px 40px" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        .cta-box {
          background: linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(52, 168, 83, 0.1));
          border: 2px solid var(--glass-border);
          border-radius: 24px;
          padding: 80px 40px;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 56px;
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .cta-box {
            padding: 60px 30px;
          }

          .cta-content h2 {
            font-size: 36px;
          }
        }
      `}</style>
        </section>
    );
}
