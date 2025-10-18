"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface AnimatedTextProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedText({ text, className = "", onClick }: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = "";

    // Split text into individual characters and create DOM elements
    const chars = text.split("");
    chars.forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateX(150px)";
      containerRef.current?.appendChild(span);
    });

    // Rerender to ensure DOM is updated
    setTimeout(() => {
      if (!containerRef.current) return;

      // Get all character elements
      const charElements = containerRef.current.children;

      // Create animation
      const tl = gsap.timeline();
      
      tl.fromTo(charElements, 
        {
          x: 150,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power4.out",
          stagger: 0.04
        }
      );

      animationRef.current = tl;
    }, 0);

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [text]);

  const handleClick = () => {
    if (animationRef.current && containerRef.current) {
      // Revert and replay animation
      animationRef.current.revert();
      
      const charElements = containerRef.current.children;
      const tl = gsap.timeline();
      
      tl.fromTo(charElements, 
        {
          x: 150,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power4.out",
          stagger: 0.04
        }
      );
      
      animationRef.current = tl;
    }
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <span 
      ref={containerRef} 
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
    />
  );
}
