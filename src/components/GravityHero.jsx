import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import useMeasure from "react-use-measure";

export default function GravityHero() {
    const sceneRef = useRef(null);
    const [ref, bounds] = useMeasure();

    useEffect(() => {
        if (!bounds.width) return;

        const Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        const engine = Engine.create();
        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: bounds.width,
                height: bounds.height,
                wireframes: false,
                background: "transparent",
            },
        });

        // Create boundaries
        const ground = Bodies.rectangle(
            bounds.width / 2,
            bounds.height + 50,
            bounds.width,
            100,
            { isStatic: true, render: { visible: false } }
        );
        const leftWall = Bodies.rectangle(
            -50,
            bounds.height / 2,
            100,
            bounds.height,
            { isStatic: true, render: { visible: false } }
        );
        const rightWall = Bodies.rectangle(
            bounds.width + 50,
            bounds.height / 2,
            100,
            bounds.height,
            { isStatic: true, render: { visible: false } }
        );

        // Create falling objects (skills/keywords)
        const keywords = ["React", "Node.js", "n8n", "Design", "AI", "Web3"];
        const bodies = keywords.map((word) => {
            const x = Math.random() * bounds.width;
            const y = Math.random() * -500; // Start above screen
            const size = 60 + Math.random() * 40;

            return Bodies.circle(x, y, size / 2, {
                restitution: 0.9, // Bouncy
                friction: 0.005,
                render: {
                    fillStyle: ["#3b82f6", "#8b5cf6", "#ffffff"][Math.floor(Math.random() * 3)],
                },
                label: word, // Custom label property
            });
        });

        World.add(engine.world, [ground, leftWall, rightWall, ...bodies]);

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false,
                },
            },
        });
        World.add(engine.world, mouseConstraint);

        // Keep the mouse in sync with rendering
        render.mouse = mouse;

        // Run the engine
        Engine.run(engine);
        Render.run(render);

        return () => {
            Render.stop(render);
            World.clear(engine.world);
            Engine.clear(engine);
            render.canvas.remove();
            render.canvas = null;
            render.context = null;
            render.textures = {};
        };
    }, [bounds]);

    return (
        <section ref={ref} className="hero-gravity" style={{ height: "100vh", position: "relative", overflow: "hidden" }}>
            <div ref={sceneRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />

            <div className="container" style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}>
                <h1 style={{ fontSize: "5rem", fontWeight: "800", lineHeight: "1", maxWidth: "800px" }}>
                    Defying <br />
                    <span style={{ color: "var(--primary)" }}>Gravity</span>.
                </h1>
                <p style={{ fontSize: "1.5rem", marginTop: "20px", color: "var(--text-secondary)", maxWidth: "500px" }}>
                    Building digital experiences that float above the ordinary.
                </p>
            </div>
        </section>
    );
}
