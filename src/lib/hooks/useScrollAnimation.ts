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
    const heroContent = hero.querySelector<HTMLElement>('.hero-content');
    const scrollIndicator = hero.querySelector<HTMLElement>('.scroll-indicator');

    // Set initial state - hero content starts visible
    if (heroContent) {
      gsap.set(heroContent, {
        opacity: 1,
        y: 0,
        scale: 1,
      });
    }

    // Set initial state for scroll indicator
    if (scrollIndicator) {
      gsap.set(scrollIndicator, {
        opacity: 1,
      });
    }

    // Hero section slides up and disappears on scroll
    gsap.to(hero, {
      y: -150,
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    // Fade out scroll indicator slightly before hero disappears
    if (scrollIndicator) {
      gsap.to(scrollIndicator, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power2.in",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=300",
          scrub: true,
        },
      });
    }

    // Content section fades in from bottom
    gsap.fromTo(content,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: content,
          start: "top 85%",
          end: "top 30%",
          scrub: true,
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return { heroRef, contentRef };
};
