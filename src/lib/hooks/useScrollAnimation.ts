"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useScrollAnimation = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !contentRef.current) return;

    const hero = heroRef.current;
    const content = contentRef.current;

    // Set initial state - hero content starts visible
    gsap.set(hero.querySelector('.hero-content'), {
      opacity: 1,
      y: 0,
      scale: 1
    });

    // Set initial state for scroll indicator
    gsap.set(hero.querySelector('.scroll-indicator'), {
      opacity: 1
    });

    // Create timeline for hero fade backward animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,
        pinSpacing: false,
      }
    });

    // Fade hero content backward as user scrolls
    tl.to(hero.querySelector('.hero-content'), {
      opacity: 0,
      y: -80,
      scale: 0.85,
      duration: 0.8,
      ease: "power3.out"
    })
    // Also fade out scroll indicator
    .to(hero.querySelector('.scroll-indicator'), {
      opacity: 0,
      duration: 0.3,
      ease: "power3.out"
    }, 0.1);

    // Create separate animation for content section coming upwards
    gsap.fromTo(content, 
      {
        opacity: 0,
        y: 150,
        scale: 0.92
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: content,
          start: "top 90%",
          end: "top 10%",
          scrub: 0.8,
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return { heroRef, contentRef };
};
