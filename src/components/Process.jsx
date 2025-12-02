import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        id: "01",
        title: "Discovery",
        desc: "Understanding the core problem. I dive deep into requirements, user needs, and technical constraints to build a solid foundation.",
    },
    {
        id: "02",
        title: "Strategy",
        desc: "Planning the architecture. I design scalable systems and intuitive interfaces, ensuring every component has a purpose.",
    },
    {
        id: "03",
        title: "Build",
        desc: "Crafting the code. I write clean, performant, and maintainable code, focusing on modern best practices and automation.",
    },
    {
        id: "04",
        title: "Launch",
        desc: "Deploying to the world. I ensure smooth deployments, robust monitoring, and continuous optimization for peak performance.",
    },
];

export default function Process() {
    useEffect(() => {
        const cards = gsap.utils.toArray(".process-card");

        cards.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    end: "top 50%",
                    scrub: 1,
                },
                y: 100,
                opacity: 0,
                scale: 0.9,
            });
        });
    }, []);

    return (
        <section id="process" className="container">
            <h2 style={{ textAlign: "center", marginBottom: "80px" }}>My Process</h2>

            <div className="process-grid">
                {steps.map((step) => (
                    <div key={step.id} className="process-card glass">
                        <span className="step-id">{step.id}</span>
                        <h3>{step.title}</h3>
                        <p>{step.desc}</p>
                    </div>
                ))}
            </div>

            <style>{`
        .process-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }
        .process-card {
          padding: 40px;
          border-radius: 24px;
          background: var(--card-bg);
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s;
        }
        .process-card:hover {
          border-color: var(--primary);
        }
        .step-id {
          font-size: 4rem;
          font-weight: 900;
          color: var(--glass-border);
          position: absolute;
          top: -10px;
          right: 20px;
          opacity: 0.5;
          z-index: 0;
        }
        .process-card h3 {
          font-size: 1.8rem;
          margin-bottom: 15px;
          position: relative;
          z-index: 1;
        }
        .process-card p {
          color: var(--text-secondary);
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }
      `}</style>
        </section>
    );
}
