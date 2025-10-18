"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface AnimatedTextProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedText({ text, className = "", onClick }: AnimatedTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const reachedBottom = useRef(false); // track if user reached bottom once

  const playAnimation = (duration = 2.5) => {
    if (!containerRef.current) return;

    const charElements = containerRef.current.children;
    const tl = gsap.timeline();

    tl.fromTo(
      charElements,
      { x: 150, opacity: 0 },
      { x: 0, opacity: 1, duration, ease: "power4.out", stagger: 0.04 }
    );

    animationRef.current = tl;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const chars = text.split("");
    chars.forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateX(150px)";
      containerRef.current?.appendChild(span);
    });

    // Initial animation
    setTimeout(() => playAnimation(2.5), 0);

    // Scroll listener
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Detect if user reached bottom of page
      if (scrollTop + windowHeight >= documentHeight - 50) {
        reachedBottom.current = true;
      }

      // Replay animation only when coming back to top *after reaching bottom once*
      if (reachedBottom.current && scrollTop <= 10) {
        reachedBottom.current = false; // reset for next time
        animationRef.current?.kill();
        playAnimation(1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      animationRef.current?.kill();
    };
  }, [text]);

  const handleClick = () => {
    animationRef.current?.revert();
    playAnimation(0.7);
    onClick?.();
  };

  return (
    <span
      ref={containerRef}
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
    />
  );
}
