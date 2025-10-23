"use client";

// @ts-ignore
import gsap from "gsap";
import React, { useEffect, useRef } from "react";

interface GlobalCursorProps {
  targetRef: React.RefObject<HTMLElement | null>;
}

const GlobalCursor: React.FC<GlobalCursorProps> = ({ targetRef }) => {
  const $follower = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!$follower.current || !target) {
      console.log("Global cursor ref or target ref is null");
      return;
    }

    console.log("Setting up scoped cursor animation");

    // Set initial state to hidden
    gsap.set($follower.current, {
      opacity: 0,
    });

    const handleMouseMove = (e: MouseEvent) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Move cursor to new position
      gsap.to($follower.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out",
      });

      // Show cursor immediately
      gsap.to($follower.current, {
        opacity: 1,
        duration: 0.1,
        ease: "power2.out",
      });

      // Set timeout to fade out after 0.5 seconds of no movement
      timeoutRef.current = setTimeout(() => {
        gsap.to($follower.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      }, 500);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      // Clear timeout when mouse enters
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Move to position and show
      gsap.to($follower.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });
      gsap.to($follower.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      // Clear timeout when mouse leaves
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      gsap.to($follower.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Attach events to the specific target element
    target.addEventListener("mousemove", handleMouseMove);
    target.addEventListener("mouseenter", handleMouseEnter);
    target.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      // Clean up timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Clean up event listeners from the target
      if (target) {
        target.removeEventListener("mousemove", handleMouseMove);
        target.removeEventListener("mouseenter", handleMouseEnter);
        target.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [targetRef]); // Re-run effect if targetRef changes

  return (
    <div
      ref={$follower}
      className="pointer-events-none fixed left-0 top-0 w-20 h-20 rounded-full"
      style={{
        transform: "translate(-50%, -50%)",
        // --- MODIFIED STYLES ---
        background:
          "radial-gradient(circle, rgba(255, 11, 85, 0.5) 0%, rgba(255, 11, 85, 0.3) 50%, rgba(255, 11, 85, 0.1) 100%)", // Reduced opacity
        filter: "blur(20px)", // Increased blur for softer edges
        boxShadow:
          "0 0 30px rgba(255, 11, 85, 0.5), 0 0 60px rgba(255, 11, 85, 0.3)", // Reduced shadow opacity and spread
        border: "1px solid rgba(255, 11, 85, 0.2)", // Made border thinner and less opaque
        // --- END MODIFIED STYLES ---
        zIndex: 1,
      }}
    ></div>
  );
};

export default GlobalCursor;