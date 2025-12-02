import React, { useEffect } from "react";
import gsap from "gsap";

export default function GravityHero() {
    useEffect(() => {
        gsap.fromTo(
            ".hero h1",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.5 }
        );

        gsap.fromTo(
            ".hero-buttons",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.8 }
        );
    }, []);

    return (
        <section className="hero">
            <div className="container">
                <h1>Experience liftoff with the next-generation IDE</h1>
                <div className="hero-buttons">
                    <button className="btn btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Download for Windows
                    </button>
                    <button className="btn btn-secondary">
                        Explore use cases
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
