import React from "react";

const BentoCard = ({ title, children, className = "" }) => (
    <div className={`bento-card glass ${className}`}>
        <h3>{title}</h3>
        {children}
    </div>
);

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
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid var(--glass-border);
        }
        .bento-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--primary);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3);
        }
        .bento-card h3 {
          margin-top: 0;
          font-size: 1.5rem;
          margin-bottom: 15px;
          font-weight: 700;
        }
        .card-desc {
          color: var(--text-secondary);
          line-height: 1.5;
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
        }
        .link:hover {
          color: var(--accent);
        }
        .stat {
          text-align: center;
          padding: 20px 0;
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
