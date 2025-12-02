import React, { useState } from "react";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState("idle"); // idle, loading, success, error

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
        <section id="contact" className="contact fade">
            <h2>Contact Me</h2>
            <p>Let's build something amazing together!</p>

            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your Name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="How can I help you?"
                        rows="5"
                    ></textarea>
                </div>

                <button type="submit" className="btn" disabled={status === "loading"}>
                    {status === "loading" ? "Sending..." : "Send Message"}
                </button>

                {status === "success" && (
                    <p className="success-msg">Message sent successfully! 🚀</p>
                )}
                {status === "error" && (
                    <p className="error-msg">Oops! Something went wrong. Please try again.</p>
                )}
            </form>
        </section>
    );
}
