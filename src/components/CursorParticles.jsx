import React, { useEffect, useRef } from "react";

export default function CursorParticles() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;
        let particles = [];
        let lastMousePos = { x: 0, y: 0 };

        // Physics constants (fine-tuned to match Antigravity.google)
        const GRAVITY = 0.3; // Reduced for slower fall
        const DAMPING = 0.85; // Less energy loss = more bounces
        const FRICTION = 0.99; // Air resistance

        // Google brand colors
        const COLORS = ["#4285f4", "#ea4335", "#fbbc04", "#34a853"];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        class Particle {
            constructor(x, y, speedMultiplier = 1) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 2; // 2-5 pixels (smaller range)
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];

                // Initial velocity with some randomness
                this.velocityX = (Math.random() - 0.5) * 4 * speedMultiplier;
                this.velocityY = (Math.random() - 0.5) * 2 - 1; // Slight upward initial velocity

                this.life = 1; // Opacity from 1 to 0
                this.bounces = 0;
                this.maxBounces = 20;
            }

            update() {
                // Apply gravity
                this.velocityY += GRAVITY;

                // Apply friction (air resistance)
                this.velocityX *= FRICTION;

                // Update position
                this.x += this.velocityX;
                this.y += this.velocityY;

                // Bottom boundary collision
                if (this.y + this.size >= canvas.height) {
                    this.y = canvas.height - this.size;
                    this.velocityY *= -DAMPING;
                    this.velocityX *= DAMPING;
                    this.bounces++;

                    // Fade out after many bounces
                    if (this.bounces > this.maxBounces * 0.5) {
                        this.life -= 0.02;
                    }
                }

                // Top boundary collision
                if (this.y - this.size <= 0) {
                    this.y = this.size;
                    this.velocityY *= -DAMPING;
                }

                // Side boundaries collision
                if (this.x + this.size >= canvas.width) {
                    this.x = canvas.width - this.size;
                    this.velocityX *= -DAMPING;
                } else if (this.x - this.size <= 0) {
                    this.x = this.size;
                    this.velocityX *= -DAMPING;
                }

                // Slow particles lose life
                if (Math.abs(this.velocityX) < 0.1 && Math.abs(this.velocityY) < 0.1) {
                    this.life -= 0.005;
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.life;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // Simple particle-to-particle collision detection
            collideWith(other) {
                const dx = other.x - this.x;
                const dy = other.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = this.size + other.size;

                if (distance < minDistance) {
                    // Particles are colliding
                    const angle = Math.atan2(dy, dx);
                    const targetX = this.x + Math.cos(angle) * minDistance;
                    const targetY = this.y + Math.sin(angle) * minDistance;

                    const ax = (targetX - other.x) * 0.05;
                    const ay = (targetY - other.y) * 0.05;

                    this.velocityX -= ax;
                    this.velocityY -= ay;
                    other.velocityX += ax;
                    other.velocityY += ay;
                }
            }
        }

        window.addEventListener("mousemove", (e) => {
            const mouseSpeed = Math.sqrt(
                Math.pow(e.clientX - lastMousePos.x, 2) +
                Math.pow(e.clientY - lastMousePos.y, 2)
            );

            lastMousePos.x = e.clientX;
            lastMousePos.y = e.clientY;

            // Generate more particles for faster movement
            const particleCount = Math.min(Math.floor(mouseSpeed / 10) + 2, 8);
            const speedMultiplier = Math.min(mouseSpeed / 50, 2);

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(e.clientX, e.clientY, speedMultiplier));
            }

            // Limit total particles for performance
            if (particles.length > 500) {
                particles = particles.slice(-500);
            }
        });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw all particles
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw();

                // Check collisions with other particles (only nearby for performance)
                for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
                    particles[i].collideWith(particles[j]);
                }

                // Remove dead particles
                if (particles[i].life <= 0 || particles[i].bounces > particles[i].maxBounces) {
                    particles.splice(i, 1);
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 1,
            }}
        />
    );
}
