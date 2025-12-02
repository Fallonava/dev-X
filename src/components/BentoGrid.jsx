import React from "react";

const BentoCard = ({ title, children, className = "" }) => (
    <div className={`bento-card glass ${className}`}>
        <h3>{title}</h3>
        {children}
    </div>
);

export default function BentoGrid() {
    return (
        <section id="about" className="container">
            <h2 style={{ textAlign: "center" }}>About & Work</h2>

            <div className="bento-grid">
                {/* About Me - Large Card */}
                <BentoCard title="Who am I?" className="col-span-2 row-span-2">
                    <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>
                        I'm a Fullstack Developer obsessed with <b>automation</b> and <b>interactive design</b>.
                        I build systems that run themselves and interfaces that feel alive.
                    </p>
                    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                        <span className="tag">React</span>
                        <span className="tag">Node.js</span>
                        <span className="tag">n8n</span>
                    </div>
                </BentoCard>

                {/* Project 1 */}
                <BentoCard title="AI Art Gen">
                    <p>Stable Diffusion + n8n workflow for automated stock image generation.</p>
                    <a href="#" className="link">View Project →</a>
                </BentoCard>

                {/* Project 2 */}
                <BentoCard title="Crypto Dash">
                    <p>Real-time Web3 analytics dashboard using D3.js.</p>
                    <a href="#" className="link">View Project →</a>
                </BentoCard>

                {/* Stats */}
                <BentoCard title="Experience" className="col-span-1">
                    <div className="stat">
                        <span className="number">5+</span>
                        <span className="label">Years</span>
                    </div>
                </BentoCard>

                {/* Project 3 */}
                <BentoCard title="SaaS Platform" className="col-span-2">
                    <p>Enterprise automation platform handling 1M+ events/day.</p>
                    <a href="#" className="link">View Project →</a>
                </BentoCard>
            </div>

            <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }
        .bento-card {
          padding: 30px;
          border-radius: 24px;
          background: var(--card-bg);
          transition: transform 0.3s ease;
        }
        .bento-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
        }
        .bento-card h3 {
          margin-top: 0;
          font-size: 1.5rem;
          margin-bottom: 15px;
        }
        .tag {
          padding: 5px 12px;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          font-size: 0.8rem;
        }
        .link {
          display: inline-block;
          margin-top: 15px;
          color: var(--primary);
          text-decoration: none;
        }
        .stat {
          text-align: center;
        }
        .stat .number {
          display: block;
          font-size: 3rem;
          font-weight: 800;
          color: var(--accent);
        }
        .col-span-2 { grid-column: span 2; }
        .row-span-2 { grid-row: span 2; }
        
        @media (max-width: 768px) {
          .col-span-2 { grid-column: span 1; }
        }
      `}</style>
        </section>
    );
}
