import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  "n8n Workflow Automation", "API Integration", "REST & Webhooks",
  "React", "Next.js", "TailwindCSS", "JavaScript", "Node.js", "Python",
  "Docker", "Linux VPS", "Reverse Proxy", "Cloudflare", "SSL/HTTPS",
  "AI Image Gen", "Stable Diffusion", "MidJourney",
  "Supabase", "MySQL", "MongoDB",
  "Problem Solving", "System Thinking", "Fast Execution", "Communication"
];

export default function Skills() {
  useEffect(() => {
    const skillTags = gsap.utils.toArray(".skill-tag");

    gsap.from(skillTags, {
      scrollTrigger: {
        trigger: ".skills-grid",
        start: "top 80%",
      },
      opacity: 0,
      y: 30,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  return (
    <section id="skills" className="container">
      <h2 style={{ textAlign: "center", marginBottom: "60px" }}>Skills & Technologies</h2>

      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div key={index} className="skill-tag">
            {skill}
          </div>
        ))}
      </div>

      <style>{`
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .skill-tag {
          padding: 16px 24px;
          background: var(--card-bg);
          border: 1.5px solid var(--glass-border);
          border-radius: 100px;
          text-align: center;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        
        .skill-tag::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 100px;
          z-index: -1;
        }
        
        .skill-tag:hover {
          transform: translateY(-4px) scale(1.05);
          border-color: var(--primary);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
          color: var(--bg);
        }
        
        .skill-tag:hover::before {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 12px;
          }
          .skill-tag {
            padding: 12px 18px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
}
