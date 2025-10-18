"use client";

// @ts-ignore
import gsap from "gsap";
import React, { useEffect, useRef } from "react";

const GlobalCursor = () => {
    const $follower = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!$follower.current) {
            console.log("Global cursor ref is null");
            return;
        }

        console.log("Setting up global cursor animation");

        // Set initial position to center
        gsap.set($follower.current, {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            opacity: 0,
        });

        const handleMouseMove = (e: MouseEvent) => {
            gsap.to($follower.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: "power2.out",
            });
        };

        const handleMouseEnter = () => {
            gsap.to($follower.current, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to($follower.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={$follower}
            className="pointer-events-none fixed left-0 top-0 w-32 h-32 rounded-full z-50"
            style={{
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.9) 0%, rgba(251, 146, 60, 0.7) 50%, rgba(239, 68, 68, 0.5) 100%)',
                filter: 'blur(15px)',
                boxShadow: '0 0 40px rgba(239, 68, 68, 0.8), 0 0 80px rgba(239, 68, 68, 0.6)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
            }}
        >
        </div>
    );
};

export default GlobalCursor;
