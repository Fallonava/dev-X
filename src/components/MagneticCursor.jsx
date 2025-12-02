import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function MagneticCursor() {
    const cursorRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const moveCursor = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out",
            });
        };

        const handleMouseEnter = () => {
            setIsHovering(true);
            gsap.to(cursor, { scale: 1.5, duration: 0.2 });
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
            gsap.to(cursor, { scale: 1, duration: 0.2 });
        };

        window.addEventListener("mousemove", moveCursor);

        // Add magnetic effect to specific elements
        const magneticElements = document.querySelectorAll("a, button, .bento-card");
        magneticElements.forEach((el) => {
            el.addEventListener("mouseenter", handleMouseEnter);
            el.addEventListener("mouseleave", handleMouseLeave);
        });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            magneticElements.forEach((el) => {
                el.removeEventListener("mouseenter", handleMouseEnter);
                el.removeEventListener("mouseleave", handleMouseLeave);
            });
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="magnetic-cursor"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "var(--text)",
                pointerEvents: "none",
                zIndex: 9999,
                transform: "translate(-50%, -50%)",
                mixBlendMode: "difference",
                opacity: 0.8,
            }}
        />
    );
}
