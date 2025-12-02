import React from "react";

const services = [
    {
        title: "🔥 Automasi & Integrasi",
        items: [
            "Pembuatan workflow automation (n8n, Make, Zapier)",
            "Integrasi API antar sistem",
            "Bot WhatsApp / Telegram berbasis automasi",
            "Dashboard data operasional"
        ]
    },
    {
        title: "🔥 Website Development",
        items: [
            "Landing page modern & responsif",
            "Website business / portfolio",
            "Integrasi frontend dengan API",
            "Deploy ke Vercel, VPS, atau hosting lain"
        ]
    },
    {
        title: "🔥 AI Solutions",
        items: [
            "Setup Stable Diffusion lokal",
            "Workflow AI untuk gambar / teks / data",
            "Integrasi AI ke website & aplikasi"
        ]
    },
    {
        title: "🔥 Server & Deployment",
        items: [
            "Setup VPS (Ubuntu, Docker)",
            "SSL & Cloudflare configuration",
            "Reverse proxy (Nginx, Traefik)",
            "Maintenance & monitoring"
        ]
    }
];

export default function Services() {
    return (
        <section id="services" className="container" style={{ padding: "80px 0" }}>
            <h2 style={{ textAlign: "center", marginBottom: "60px" }}>Layanan</h2>
            <div className="services-grid">
                {services.map((service, index) => (
                    <div key={index} className="service-card glass">
                        <h3>{service.title}</h3>
                        <ul>
                            {service.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <style>{`
                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                }

                .service-card {
                    padding: 32px;
                    border-radius: 24px;
                    background: var(--card-bg);
                    border: 1px solid var(--glass-border);
                    transition: transform 0.3s ease;
                }

                .service-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary);
                }

                .service-card h3 {
                    font-size: 1.5rem;
                    margin-bottom: 20px;
                    color: var(--primary);
                }

                .service-card ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .service-card li {
                    margin-bottom: 12px;
                    padding-left: 20px;
                    position: relative;
                    color: var(--text-secondary);
                    line-height: 1.5;
                }

                .service-card li::before {
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: var(--accent);
                }
            `}</style>
        </section>
    );
}
