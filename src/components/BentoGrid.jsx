import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const BentoCard = ({ title, children, className = "" }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.4,
                ease: "power2.out",
                transformPerspective: 1000,
            });
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.4,
                ease: "power2.out",
            });
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            card.removeEventListener("mousemove", handleMouseMove);
            card.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div ref={cardRef} className={`bento-card glass ${className}`}>
            <h3>{title}</h3>
            {children}
        </div>
    );
};

export default function BentoGrid() {
    return (
        <section id="about" className="container" style={{ paddingBottom: "50px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "60px" }}>About & Work</h2>

            <div className="bento-grid">
                {/* About Me - Large Card */}
                <BentoCard title="Who am I?" className="col-span-2 row-span-2 feature-card">
                    <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        I'm a Fullstack Developer obsessed with <b>automation</b> and <b>interactive design</b>.
                        I build systems that run themselves and interfaces that feel alive.
                    </p>
                    <div style={{ marginTop: "30px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <span className="tag">React</span>
                        <span className="tag">Node.js</span>
                        <span className="tag">n8n</span>
                        <span className="tag">GSAP</span>
                    </div>
                </BentoCard>

                {/* Project 1 */}
                <BentoCard title="AI Art Gen">
                    <p className="card-desc">Stable Diffusion + n8n workflow for automated stock image generation.</p>
                    <a href="#" className="link">View Project →</a>
                </BentoCard>

                {/* Project 2 */}
                <BentoCard title="Crypto Dash">
                    <p className="card-desc">Real-time Web3 analytics dashboard using D3.js.</p>
                    <a href="#" className="link">View Project →</a>
                </BentoCard>

                {/* Stats */}
                <BentoCard title="Experience" className="col-span-1 stat-card">
                    <div className="stat">
                        <span className="number">5+</span>
                        <span className="label">Years</span>
                    </div>
                </BentoCard>

                {/* Project 3 */}
                <BentoCard title="SaaS Platform" className="col-span-2">
                    <p className="card-desc">Enterprise automation platform handling 1M+ events/day.</p>
                    <a href="#" className="link">View Project →</a>
                </BentoCard>
            </div>

            <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }
        .bento-card {
          padding: 32px;
          border-radius: 32px;
          background: var(--card-bg);
          transition: transform 0.1s; /* Handled by GSAP */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid var(--glass-border);
          transform-style: preserve-3d; /* Important for 3D effect */
        }
        .bento-card:hover {
          border-color: var(--primary);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
        }
        .bento-card h3 {
          margin-top: 0;
          font-size: 1.5rem;
          margin-bottom: 15px;
          font-weight: 700;
          transform: translateZ(20px); /* Pop out text */
        }
        .card-desc {
          color: var(--text-secondary);
          line-height: 1.5;
          transform: translateZ(10px);
        }
        .tag {
          padding: 6px 14px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .link {
          display: inline-block;
          margin-top: 20px;
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
          transform: translateZ(15px);
        }
        .link:hover {
          color: var(--accent);
        }
        .stat {
          text-align: center;
          padding: 20px 0;
          transform: translateZ(20px);
        }
        .stat .number {
          display: block;
          font-size: 4rem;
          font-weight: 800;
          background: linear-gradient(to bottom right, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 10px;
        }
        .stat .label {
          font-size: 1.1rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .col-span-2 { grid-column: span 2; }
        .row-span-2 { grid-row: span 2; }
        
        @media (max-width: 768px) {
          .col-span-2 { grid-column: span 1; }
          .row-span-2 { grid-row: span 1; }
          .bento-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </section>
    );
}
