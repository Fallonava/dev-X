import React from "react";

const testimonials = [
    {
        quote: "Automasi dari Faishal berhasil mengurangi pekerjaan manual tim kami hingga 70%. Hasilnya cepat dan dokumentasinya jelas.",
        author: "Owner Klinik Utama"
    },
    {
        quote: "Website bisnis kami terlihat jauh lebih profesional dan cepat. Komunikasi sangat baik.",
        author: "CEO Startup Lokal"
    },
    {
        quote: "n8n workflow yang dibuat Faishal benar-benar memudahkan proses laporan harian. Recommended!",
        author: "Manager Operasional"
    }
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="container" style={{ padding: "80px 0" }}>
            <h2 style={{ textAlign: "center", marginBottom: "60px" }}>Testimonials</h2>
            <div className="testimonials-grid">
                {testimonials.map((item, index) => (
                    <div key={index} className="testimonial-card glass">
                        <p className="quote">"{item.quote}"</p>
                        <p className="author">— {item.author}</p>
                    </div>
                ))}
            </div>

            <style>{`
                .testimonials-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                }

                .testimonial-card {
                    padding: 32px;
                    border-radius: 24px;
                    background: var(--card-bg);
                    border: 1px solid var(--glass-border);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .quote {
                    font-size: 1.1rem;
                    font-style: italic;
                    color: var(--text);
                    margin-bottom: 20px;
                    line-height: 1.6;
                }

                .author {
                    font-weight: 600;
                    color: var(--primary);
                    text-align: right;
                }
            `}</style>
        </section>
    );
}
