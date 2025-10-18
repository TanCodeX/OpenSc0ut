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

    // Play once initially
    setTimeout(() => playAnimation(2.5), 0);

    // ✅ Intersection Observer to detect when it comes back into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element just came into view
            animationRef.current?.kill();
            playAnimation(1); // replay shorter version
          }
        });
      },
      {
        threshold: 0.4, // Trigger when 40% of the element is visible
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
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
