"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const cards = [
  {
    id: "discover",
    title: "Discover",
    desc: "Explore curated open source projects",
    iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    id: "contribute",
    title: "Contribute",
    desc: "Make meaningful contributions",
    iconPath: "M12 6v6m0 0v6m0-6h6m-6 0H6",
  },
  {
    id: "analyze",
    title: "Analyze",
    desc: "AI-powered code insights",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    id: "grow",
    title: "Grow",
    desc: "Level up your skills",
    iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
];

export default function HeroCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // entrance: staggered slide-up, all cards land at y=0
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 35, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.2,
        }
      );

      // icon glow pulse — starts after entrance finishes
      iconRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          scale: 1.1,
          duration: 2 + i * 0.25,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.4 + i * 0.35,
        });
      });

      // subtle scale-breathe idle (NO y movement — avoids any overlap)
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          scale: 1.018,
          duration: 3 + i * 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.6 + i * 0.5, // safely after entrance completes
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardRefs.current[idx];
    const glow = glowRefs.current[idx];
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -12;
    const rotY = ((x - cx) / cx) * 12;

    gsap.to(card, { rotateX: rotX, rotateY: rotY, scale: 1.06, duration: 0.35, ease: "power2.out", overwrite: "auto" });
    gsap.to(glow, { x: x - cx, y: y - cy, opacity: 0.55, duration: 0.45, ease: "power2.out" });
  };

  const handleMouseLeave = (idx: number) => {
    const card = cardRefs.current[idx];
    const glow = glowRefs.current[idx];
    if (!card || !glow) return;
    gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.55, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
    gsap.to(glow, { opacity: 0, duration: 0.4 });
  };

  return (
    <div
      ref={containerRef}
      className="hidden lg:grid grid-cols-2 gap-4 items-start"
      style={{ perspective: "900px" }}
    >
      {cards.map((card, idx) => (
        <div
          key={card.id}
          ref={(el) => { cardRefs.current[idx] = el; }}
          className="group relative overflow-hidden rounded-2xl p-6 cursor-pointer"
          style={{
            // Solid dark background — no more see-through
            background: "linear-gradient(135deg, #1a1a1f 0%, #111114 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
            transformStyle: "preserve-3d",
            opacity: 0,
            willChange: "transform",
            // Right-column cards offset downward via CSS — stable, not animated
            marginTop: idx % 2 === 1 ? 32 : 0,
          }}
          onMouseMove={(e) => handleMouseMove(e, idx)}
          onMouseLeave={() => handleMouseLeave(idx)}
        >
          {/* Radial glow following cursor */}
          <div
            ref={(el) => { glowRefs.current[idx] = el; }}
            className="pointer-events-none absolute rounded-full"
            style={{
              width: 160,
              height: 160,
              background: "radial-gradient(circle, rgba(255,11,85,0.38) 0%, transparent 70%)",
              opacity: 0,
              top: "50%",
              left: "50%",
              marginTop: -80,
              marginLeft: -80,
              willChange: "transform, opacity",
            }}
          />

          {/* Shimmer top border */}
          <div className="pointer-events-none absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,11,85,0.7), transparent)" }} />

          {/* Corner glow */}
          <div className="pointer-events-none absolute top-0 right-0 w-20 h-20 opacity-25" style={{ background: "radial-gradient(circle at top right, #FF0B55 0%, transparent 70%)" }} />

          {/* Micro particles */}
          {[0, 1, 2].map((pi) => (
            <div
              key={pi}
              className="pointer-events-none absolute w-1 h-1 rounded-full bg-[#FF0B55]/50"
              style={{ top: `${18 + pi * 28}%`, right: `${8 + pi * 14}%`, animation: `ping ${2.5 + pi * 0.7}s cubic-bezier(0,0,0.2,1) infinite`, animationDelay: `${pi * 0.6}s` }}
            />
          ))}

          {/* Icon */}
          <div
            ref={(el) => { iconRefs.current[idx] = el; }}
            className="relative w-12 h-12 bg-[#FF0B55]/20 rounded-xl flex items-center justify-center mb-4"
            style={{ boxShadow: "0 0 20px rgba(255,11,85,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" }}
          >
            <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(255,11,85,0.3) 0%, transparent 60%)" }} />
            <svg className="w-6 h-6 text-[#FF0B55] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.iconPath} />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-white mb-1 relative z-10">{card.title}</h3>
          <p className="text-sm text-gray-400 relative z-10">{card.desc}</p>

          {/* Bottom accent */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 opacity-60" style={{ background: "linear-gradient(to top, rgba(255,11,85,0.05), transparent)" }} />
        </div>
      ))}
    </div>
  );
}
