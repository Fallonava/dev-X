import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import useMeasure from "react-use-measure";

export default function Skills() {
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
                height: 400,
                wireframes: false,
                background: "transparent",
            },
        });

        // Boundaries
        const ground = Bodies.rectangle(bounds.width / 2, 410, bounds.width, 20, { isStatic: true, render: { visible: false } });
        const left = Bodies.rectangle(-10, 200, 20, 400, { isStatic: true, render: { visible: false } });
        const right = Bodies.rectangle(bounds.width + 10, 200, 20, 400, { isStatic: true, render: { visible: false } });

        // Skills
        const skills = ["JavaScript", "React", "Node.js", "Python", "Docker", "AWS", "n8n", "GraphQL", "TypeScript", "SQL"];
        const bodies = skills.map((skill, i) => {
            const width = skill.length * 15 + 40;
            return Bodies.rectangle(
                Math.random() * bounds.width,
                Math.random() * -200,
                width,
                50,
                {
                    chamfer: { radius: 25 },
                    render: {
                        fillStyle: "#1a1a1a",
                        strokeStyle: "#333",
                        lineWidth: 1,
                        text: {
                            content: skill,
                            color: "#fff",
                            size: 16,
                            family: "Inter",
                        },
                    },
                }
            );
        });

        World.add(engine.world, [ground, left, right, ...bodies]);

        // Mouse
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: { stiffness: 0.2, render: { visible: false } },
        });
        World.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        // Custom renderer for text
        const originalRender = Render.world;
        Render.world = function (render) {
            originalRender(render);
            const ctx = render.context;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            bodies.forEach((body, i) => {
                const { x, y } = body.position;
                const angle = body.angle;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.fillStyle = "#fff";
                ctx.font = "16px Inter";
                ctx.fillText(skills[i], 0, 0);
                ctx.restore();
            });
        };

        Engine.run(engine);
        Render.run(render);

        return () => {
            Render.stop(render);
            World.clear(engine.world);
            Engine.clear(engine);
            render.canvas.remove();
            Render.world = originalRender; // Restore original renderer
        };
    }, [bounds]);

    return (
        <section id="skills" className="container" ref={ref}>
            <h2 style={{ textAlign: "center" }}>Skills</h2>
            <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "20px" }}>
                Drag and throw to explore.
            </p>
            <div ref={sceneRef} style={{ height: "400px", border: "1px solid var(--glass-border)", borderRadius: "20px", overflow: "hidden" }} />
        </section>
    );
}
