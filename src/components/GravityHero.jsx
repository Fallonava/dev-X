import React, { useEffect, useState } from "react";
import gsap from "gsap";

export default function GravityHero() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger entry animation
        setTimeout(() => setIsLoaded(true), 100);

        // Floating animation for the hero visual
        gsap.to(".hero-visual-floating", {
            y: -20,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }, []);

    return (
        <section className="antigravity-hero">
            {/* Background Grid & Glow */}
            <div className="hero-background">
                <div className="grid-overlay"></div>
                <div className="glow-spot glow-1"></div>
                <div className="glow-spot glow-2"></div>
            </div>

            <div className="container hero-content-wrapper">
                <div className="hero-content">
                    <div className={`badge ${isLoaded ? 'visible' : ''}`}>
                        <span>Public Preview</span>
                    </div>

                    <h1 className={`hero-title ${isLoaded ? 'visible' : ''}`}>
                        Build the new way
                    </h1>

                    <p className={`hero-desc ${isLoaded ? 'visible' : ''}`}>
                        The first agentic IDE. Plan, execute, and verify complex software with AI agents that understand your codebase.
                    </p>

                    <div className={`hero-buttons ${isLoaded ? 'visible' : ''}`}>
                        <a href="#download" className="btn btn-primary">
                            Download Antigravity
                        </a>
                        <a href="#docs" className="btn btn-text">
                            Read the docs ›
                        </a>
                    </div>

                    {/* Hero Visual - Abstract IDE Interface */}
                    <div className={`hero-visual ${isLoaded ? 'visible' : ''}`}>
                        <div className="hero-visual-floating">
                            <div className="ide-window">
                                <div className="ide-header">
                                    <div className="dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                    <div className="tab">agent_plan.md</div>
                                </div>
                                <div className="ide-body">
                                    <div className="code-line"><span className="keyword">task</span> <span className="string">"Refactor Authentication"</span> <span className="brace">{`{`}</span></div>
                                    <div className="code-line indent"><span className="property">status</span>: <span className="value">IN_PROGRESS</span></div>
                                    <div className="code-line indent"><span className="property">agent</span>: <span className="value">@security-bot</span></div>
                                    <div className="code-line indent"><span className="property">steps</span>: <span className="brace">[</span></div>
                                    <div className="code-line double-indent"><span className="string">"Analyze current session logic"</span>,</div>
                                    <div className="code-line double-indent"><span className="string">"Implement JWT rotation"</span></div>
                                    <div className="code-line indent"><span className="brace">]</span></div>
                                    <div className="code-line"><span className="brace">{`}`}</span></div>

                                    <div className="cursor"></div>
                                </div>
                                {/* Floating Agent Node */}
                                <div className="agent-node">
                                    <div className="agent-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path></svg>
                                    </div>
                                    <div className="agent-status">Analyzing...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .antigravity-hero {
                    position: relative;
                    width: 100%;
                    min-height: 100vh;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-top: 100px;
                    background: #050505;
                    color: #fff;
                }

                /* Background Effects */
                .hero-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    overflow: hidden;
                }

                .grid-overlay {
                    position: absolute;
                    width: 200%;
                    height: 200%;
                    top: -50%;
                    left: -50%;
                    background-image: 
                        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                    transform: perspective(500px) rotateX(60deg);
                    animation: gridMove 20s linear infinite;
                }

                @keyframes gridMove {
                    0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
                    100% { transform: perspective(500px) rotateX(60deg) translateY(40px); }
                }

                .glow-spot {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.4;
                }

                .glow-1 {
                    top: -20%;
                    left: 20%;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, #4285f4, transparent);
                }

                .glow-2 {
                    bottom: -20%;
                    right: 10%;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, #ab47bc, transparent);
                }

                /* Content */
                .hero-content-wrapper {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                }

                .hero-content {
                    max-width: 1000px;
                    margin: 0 auto;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                /* Badge */
                .badge {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 6px 16px;
                    border-radius: 100px;
                    margin-bottom: 24px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .badge span {
                    font-size: 14px;
                    font-weight: 500;
                    color: #e8eaed;
                    letter-spacing: 0.02em;
                }

                .badge.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Typography */
                .hero-title {
                    font-size: 5rem;
                    font-weight: 700;
                    letter-spacing: -0.04em;
                    line-height: 1;
                    margin-bottom: 24px;
                    background: linear-gradient(180deg, #fff 0%, #9aa0a6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    opacity: 0;
                    transform: translateY(30px);
                    filter: blur(10px);
                    transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
                    transition-delay: 0.1s;
                }

                .hero-title.visible {
                    opacity: 1;
                    transform: translateY(0);
                    filter: blur(0);
                }

                .hero-desc {
                    font-size: 1.5rem;
                    color: #9aa0a6;
                    max-width: 700px;
                    margin-bottom: 40px;
                    line-height: 1.5;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
                    transition-delay: 0.2s;
                }

                .hero-desc.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Buttons */
                .hero-buttons {
                    display: flex;
                    gap: 24px;
                    align-items: center;
                    margin-bottom: 80px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
                    transition-delay: 0.3s;
                }

                .hero-buttons.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .btn-primary {
                    background: #fff;
                    color: #000;
                    padding: 14px 32px;
                    border-radius: 100px;
                    font-weight: 600;
                    font-size: 16px;
                    text-decoration: none;
                    transition: transform 0.2s;
                }

                .btn-primary:hover {
                    transform: scale(1.05);
                }

                .btn-text {
                    color: #8ab4f8;
                    font-weight: 500;
                    font-size: 16px;
                    text-decoration: none;
                }

                .btn-text:hover {
                    text-decoration: underline;
                }

                /* Visual */
                .hero-visual {
                    width: 100%;
                    max-width: 800px;
                    perspective: 1000px;
                    opacity: 0;
                    transform: translateY(40px) scale(0.95);
                    transition: all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
                    transition-delay: 0.4s;
                }

                .hero-visual.visible {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }

                .ide-window {
                    background: rgba(32, 33, 36, 0.8);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
                    text-align: left;
                    position: relative;
                }

                .ide-header {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .dots {
                    display: flex;
                    gap: 6px;
                }

                .dots span {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                }

                .tab {
                    font-family: monospace;
                    font-size: 12px;
                    color: #9aa0a6;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 4px 12px;
                    border-radius: 4px;
                }

                .ide-body {
                    padding: 24px;
                    font-family: 'Roboto Mono', monospace;
                    font-size: 14px;
                    line-height: 1.6;
                    color: #e8eaed;
                    position: relative;
                }

                .code-line { margin-bottom: 4px; }
                .indent { padding-left: 20px; }
                .double-indent { padding-left: 40px; }
                
                .keyword { color: #ff7b72; }
                .string { color: #a5d6ff; }
                .property { color: #79c0ff; }
                .value { color: #d2a8ff; }
                .brace { color: #e8eaed; }

                .cursor {
                    display: inline-block;
                    width: 2px;
                    height: 16px;
                    background: #4285f4;
                    margin-left: 4px;
                    vertical-align: middle;
                    animation: blink 1s infinite;
                }

                @keyframes blink {
                    50% { opacity: 0; }
                }

                .agent-node {
                    position: absolute;
                    top: -20px;
                    right: -20px;
                    background: #1e1e1e;
                    border: 1px solid #4285f4;
                    padding: 12px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(66, 133, 244, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    animation: floatAgent 4s ease-in-out infinite;
                }

                @keyframes floatAgent {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .agent-icon {
                    color: #4285f4;
                }

                .agent-status {
                    font-size: 12px;
                    font-weight: 500;
                    color: #fff;
                }

                @media (max-width: 768px) {
                    .hero-title { font-size: 3rem; }
                    .hero-desc { font-size: 1.1rem; }
                    .hero-buttons { flex-direction: column; gap: 16px; }
                    .ide-window { margin: 0 20px; }
                }
            `}</style>
        </section>
    );
}
