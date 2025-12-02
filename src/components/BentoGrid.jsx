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
        {/* Project 1 - n8n Automation */}
        <BentoCard title="n8n Automation" className="col-span-2">
          <p className="card-desc">Booking & Notifikasi Real-Time: Google Sheets → API → WhatsApp → Dashboard.</p>
          <p className="card-result">Hasil: Penghematan 20–30 jam kerja manual per bulan.</p>
        </BentoCard>

        {/* Project 2 - Dokter Schedule */}
        <BentoCard title="Sistem Jadwal Dokter" className="col-span-1">
          <p className="card-desc">Integrasi Google Sheets + API + Frontend untuk jadwal real-time.</p>
        </BentoCard>

        {/* Project 3 - Landing Page */}
        <BentoCard title="Corporate Landing Page" className="col-span-1">
          <p className="card-desc">React based, clean design, SEO-friendly, high speed score.</p>
        </BentoCard>

        {/* Project 4 - AI Image Gen */}
        <BentoCard title="AI Image Generator" className="col-span-2">
          <p className="card-desc">Setup Stable Diffusion + Upscale di Windows untuk produksi konten komersial.</p>
          <p className="card-result">Hasil: Gambar kualitas tinggi siap jual di Adobe Stock.</p>
        </BentoCard>

        {/* Project 5 - Server Deployment */}
        <BentoCard title="Server Deployment" className="col-span-2">
          <p className="card-desc">VPS + Docker + Domain + SSL. Setup n8n, web apps, reverse proxy.</p>
          <p className="card-result">Hasil: Infrastruktur stabil dan aman.</p>
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
