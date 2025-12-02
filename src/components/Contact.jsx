import React, { useState } from "react";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState("idle");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            // REPLACE THIS URL WITH YOUR ACTUAL N8N WEBHOOK URL
            const webhookUrl = "https://your-n8n-instance.com/webhook/contact-form";

            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus("error");
        }
    };

    return (
        <section id="contact" className="container">
            <h2 style={{ textAlign: "center", marginBottom: "80px" }}>Let's Connect</h2>

            <div className="contact-wrapper">
                {/* Left Column - Info */}
                <div className="contact-info">
                    <h3>Get in Touch</h3>
                    <p className="desc">
                        Have a project in mind or just want to chat?
                        I'm always open to new opportunities and collaborations.
                    </p>

                    <div className="info-items">
                        <div className="info-item">
                            <span className="icon">📧</span>
                            <div>
                                <div className="label">Email</div>
                                <div className="value">hello@antigravity.dev</div>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="icon">🌍</span>
                            <div>
                                <div className="label">Location</div>
                                <div className="value">Remote / Worldwide</div>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="icon">⚡</span>
                            <div>
                                <div className="label">Response Time</div>
                                <div className="value">Within 24 hours</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Form */}
                <form onSubmit={handleSubmit} className="contact-form glass">
                    <div className="form-group">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder=" "
                        />
                        <label htmlFor="name">Your Name</label>
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder=" "
                        />
                        <label htmlFor="email">Your Email</label>
                    </div>

                    <div className="form-group">
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder=" "
                            rows="5"
                        ></textarea>
                        <label htmlFor="message">Your Message</label>
                    </div>

                    <button type="submit" className="btn" disabled={status === "loading"}>
                        {status === "loading" ? "Sending..." : "Send Message →"}
                    </button>

                    {status === "success" && (
                        <p className="success-msg">✓ Message sent successfully!</p>
                    )}
                    {status === "error" && (
                        <p className="error-msg">✗ Something went wrong. Please try again.</p>
                    )}
                </form>
            </div>

            <style>{`
        .contact-wrapper {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .contact-info h3 {
          font-size: 2rem;
          margin-bottom: 20px;
          font-weight: 700;
        }
        
        .contact-info .desc {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 40px;
        }
        
        .info-items {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .info-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        
        .info-item .icon {
          font-size: 1.5rem;
          background: var(--card-bg);
          padding: 12px;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
        }
        
        .info-item .label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        
        .info-item .value {
          font-weight: 500;
          font-size: 1rem;
        }
        
        .contact-form {
          padding: 40px;
          border-radius: 24px;
          background: var(--card-bg);
        }
        
        .form-group {
          position: relative;
          margin-bottom: 30px;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 16px;
          border: 1.5px solid var(--glass-border);
          border-radius: 12px;
          background: transparent;
          font-size: 1rem;
          font-family: inherit;
          color: var(--text);
          transition: all 0.3s;
          outline: none;
        }
        
        .form-group label {
          position: absolute;
          left: 16px;
          top: 16px;
          color: var(--text-secondary);
          font-size: 1rem;
          transition: all 0.3s;
          pointer-events: none;
          background: var(--card-bg);
          padding: 0 4px;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-group input:focus + label,
        .form-group textarea:focus + label,
        .form-group input:not(:placeholder-shown) + label,
        .form-group textarea:not(:placeholder-shown) + label {
          top: -8px;
          font-size: 0.85rem;
          color: var(--primary);
        }
        
        .btn {
          width: 100%;
          margin-top: 10px;
        }
        
        .success-msg {
          margin-top: 16px;
          color: #10b981;
          font-weight: 500;
          text-align: center;
        }
        
        .error-msg {
          margin-top: 16px;
          color: #ef4444;
          font-weight: 500;
          text-align: center;
        }
        
        @media (max-width: 968px) {
          .contact-wrapper {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
        </section>
    );
}
