import React from "react";

export default function About() {
    return (
        <section id="about" className="container" style={{ padding: "100px 0" }}>
            <div className="about-content" style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
                <h2 style={{ marginBottom: "40px", fontSize: "2.5rem" }}>Tentang Saya</h2>
                <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "var(--text-secondary)", marginBottom: "30px" }}>
                    Saya adalah seorang <b>Automation Engineer & Fullstack Developer</b> dengan fokus pada integrasi sistem,
                    pembuatan workflow otomatis, dan pengembangan website modern. Saya menggabungkan keahlian teknis dengan
                    pendekatan problem-solving agar setiap proyek memberi dampak langsung pada kinerja bisnis.
                </p>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-secondary)" }}>
                    Selama beberapa tahun terakhir, saya telah membantu berbagai bisnis dalam membangun automasi operasional,
                    menghubungkan sistem melalui API, membangun website cepat, aman, dan profesional, serta mengadopsi AI
                    untuk membuat proses lebih efisien.
                </p>
                <div style={{ marginTop: "40px", padding: "20px", background: "var(--card-bg)", borderRadius: "16px", border: "1px solid var(--glass-border)" }}>
                    <p style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--primary)" }}>
                        Misi saya: Membuat teknologi bekerja untuk Anda — bukan sebaliknya.
                    </p>
                </div>
            </div>
        </section>
    );
}
