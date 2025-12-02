import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import gsap from "gsap";

export default function GravityHero() {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const renderRef = useRef(null);
    const runnerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // GSAP Animations for text
        const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });
        tl.fromTo(".hero-content h1", { y: 50, opacity: 0 }, { y: 0, opacity: 1, delay: 0.2 })
            .fromTo(".hero-content p", { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.6")
            .fromTo(".hero-buttons", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.6");

        // Matter.js Setup
        const Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint,
            Runner = Matter.Runner,
            Composite = Matter.Composite;

        const engine = Engine.create();
        const world = engine.world;
        engineRef.current = engine;

        // Disable gravity initially or set it low for floating effect
        engine.world.gravity.y = 1;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: "transparent",
                pixelRatio: window.devicePixelRatio
            }
        });
        renderRef.current = render;

        // Create Walls
        const wallOptions = {
            isStatic: true,
            render: { visible: false },
            restitution: 0.8
        };

        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, wallOptions);
        const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);
        const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);

        World.add(world, [ground, leftWall, rightWall]);

        // Create Pills
        const skills = [
            "n8n", "Automation", "React", "Next.js", "AI", "Python",
            "Node.js", "Docker", "API", "Webhooks", "Workflow", "Efficiency"
        ];

        const colors = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#8E24AA", "#00ACC1"];

        const pills = skills.map((skill, index) => {
            const x = Math.random() * (window.innerWidth - 100) + 50;
            const y = Math.random() * -500 - 50; // Start above screen
            const width = skill.length * 14 + 40; // Approximate width based on text
            const height = 50;
            const color = colors[index % colors.length];

            const body = Bodies.rectangle(x, y, width, height, {
                chamfer: { radius: 25 },
                restitution: 0.6,
                friction: 0.1,
                render: {
                    fillStyle: isMobile ? "transparent" : color, // Hide on mobile if too cluttered, or keep
                    strokeStyle: isMobile ? color : "transparent",
                    lineWidth: isMobile ? 2 : 0,
                    opacity: 0.9
                }
            });

            // Custom property to store text
            body.label = skill;
            body.render.text = {
                content: skill,
                color: "#FFFFFF",
                size: 16,
                family: "Inter, sans-serif"
            };

            return body;
        });

        if (!isMobile) {
            World.add(world, pills);
        }

        // Mouse Control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });

        World.add(world, mouseConstraint);
        render.mouse = mouse;

        // Custom Rendering for Text
        Matter.Events.on(render, "afterRender", function () {
            const context = render.context;
            context.font = "500 16px Inter, sans-serif";
            context.textAlign = "center";
            context.textBaseline = "middle";

            pills.forEach(body => {
                if (!body.render.visible) return;
                const { x, y } = body.position;
                const angle = body.angle;

                context.save();
                context.translate(x, y);
                context.rotate(angle);
                context.fillStyle = "#FFFFFF";
                if (isMobile) context.fillStyle = body.render.strokeStyle;
                context.fillText(body.label, 0, 0);
                context.restore();
            });
        });

        // Run
        Render.run(render);
        const runner = Runner.create();
        runnerRef.current = runner;
        Runner.run(runner, engine);

        // Resize Handler
        const handleResizeRender = () => {
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;

            // Reposition walls
            Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
            Matter.Body.setPosition(rightWall, { x: window.innerWidth + 50, y: window.innerHeight / 2 });

            // Re-scale ground width
            // Note: Matter.js bodies don't easily resize, simpler to remove and recreate walls or just update position for simple cases
            // For robust resizing, we'd recreate walls. For now, position update is okay for height, but width needs scaling.
            // Let's just recreate walls for simplicity in a real app, but here we'll leave it for now or do a quick fix:
            Matter.Body.setVertices(ground, Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100).vertices);
            Matter.Body.setVertices(rightWall, Matter.Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight).vertices);
        };

        window.addEventListener("resize", handleResizeRender);

        return () => {
            window.removeEventListener("resize", handleResizeRender);
            Render.stop(render);
            Runner.stop(runner);
            if (render.canvas) render.canvas.remove();
            World.clear(world);
            Engine.clear(engine);
        };
    }, [isMobile]);

    return (
        <section className="gravity-hero">
            <div ref={sceneRef} className="matter-scene" />

            <div className="container hero-content-wrapper">
                <div className="hero-content">
                    <h1>Membangun Automasi, Website, & Solusi AI yang Mempercepat Bisnis Anda</h1>
                    <p>
                        Saya Faishal — Automation Engineer & Web Developer yang membantu bisnis meningkatkan efisiensi
                        melalui workflow cerdas berbasis n8n, API integration, website modern, dan teknologi AI terbaru.
                    </p>
                    <div className="hero-buttons">
                        <a href="#contact" className="btn btn-primary">
                            Mulai dari Konsultasi Gratis
                        </a>
                        <a href="#portfolio" className="btn btn-secondary">
                            Lihat Portofolio
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                .gravity-hero {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .matter-scene {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    pointer-events: auto; /* Allow interaction with canvas */
                }

                .hero-content-wrapper {
                    position: relative;
                    z-index: 2;
                    pointer-events: none; /* Let clicks pass through to canvas where no content */
                }

                .hero-content {
                    max-width: 800px;
                    text-align: center;
                    margin: 0 auto;
                    pointer-events: auto; /* Re-enable clicks for text/buttons */
                }

                .hero-content h1 {
                    font-size: 3.5rem;
                    line-height: 1.2;
                    margin-bottom: 24px;
                    background: linear-gradient(to right, #fff, #ccc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-content p {
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    margin-bottom: 40px;
                    line-height: 1.6;
                }

                .hero-buttons {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                }

                .btn {
                    padding: 16px 32px;
                    border-radius: 100px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-primary {
                    background: var(--primary);
                    color: white;
                    border: 1px solid var(--primary);
                }

                .btn-primary:hover {
                    background: var(--primary-dark);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(66, 133, 244, 0.3);
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .hero-content h1 {
                        font-size: 2.5rem;
                    }
                    .hero-content p {
                        font-size: 1rem;
                    }
                    .hero-buttons {
                        flex-direction: column;
                    }
                    .btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </section>
    );
}
