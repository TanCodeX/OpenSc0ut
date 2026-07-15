"use client";

import { PageGridBackground } from "../../components";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Animated counter hook
function useCounter(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Stat card with animated counter
function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCounter(value, 2000, inView);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05 }}
      className="relative group cursor-default"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF0B55]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
      <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-[#FF0B55] to-transparent" />
        <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#FF0B55] to-[#ff6b9d] mb-1">
          {count}{suffix}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">{label}</div>
      </div>
    </motion.div>
  );
}

// Feature card
function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="relative group"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF0B55]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="relative bg-white/5 border border-white/10 group-hover:border-[#FF0B55]/40 rounded-2xl p-6 h-full transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF0B55]/20 to-[#FF0B55]/5 border border-[#FF0B55]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// Timeline step
function TimelineStep({ step, title, desc, delay }: { step: number; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex gap-6 group"
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF0B55] to-[#ff4080] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-[#FF0B55]/30 group-hover:scale-110 transition-transform duration-300">
          {step}
        </div>
        {step < 4 && <div className="w-px flex-1 mt-2 bg-gradient-to-b from-[#FF0B55]/40 to-transparent" />}
      </div>
      <div className="pb-8">
        <h4 className="text-gray-900 dark:text-white font-bold mb-1">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// Tech badge
function TechBadge({ name, delay }: { name: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.1, y: -2 }}
      className="px-4 py-2 rounded-full bg-gradient-to-br from-[#FF0B55]/10 to-[#FF0B55]/5 border border-[#FF0B55]/30 text-[#FF0B55] text-sm font-semibold cursor-default hover:bg-[#FF0B55]/20 hover:border-[#FF0B55]/60 hover:shadow-lg hover:shadow-[#FF0B55]/20 transition-all duration-300"
    >
      {name}
    </motion.span>
  );
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      <main>

        {/* ─── HERO ─── */}
        <div className="relative min-h-[75vh] flex items-center overflow-hidden">
          <PageGridBackground />

          {/* Radial glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] rounded-full bg-[#FF0B55]/10 blur-[120px] animate-pulse" />
          </div>

          {/* Floating orbs */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-[#FF0B55]/20 to-transparent border border-[#FF0B55]/20 blur-sm hidden lg:block"
          />
          <motion.div
            animate={{ y: [0, 16, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-24 left-16 w-20 h-20 rounded-full bg-gradient-to-br from-[#FF0B55]/15 to-transparent border border-[#FF0B55]/15 blur-sm hidden lg:block"
          />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-32">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-[#FF0B55]/30 backdrop-blur-sm mb-8 shadow-lg shadow-[#FF0B55]/10"
              >
                <span className="w-2 h-2 bg-[#FF0B55] rounded-full animate-ping" />
                <span className="w-2 h-2 bg-[#FF0B55] rounded-full absolute" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Our Story</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 font-extrabold tracking-tight">
                <span className="text-gray-900 dark:text-white">About </span>
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0B55] via-[#ff4d7d] to-[#FF0B55] bg-[length:200%] animate-[gradientShift_3s_ease_infinite]">
                    OpenSc0ut
                  </span>
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF0B55] to-transparent" />
                </span>
              </h1>

              <p className="text-2xl text-gray-600 dark:text-gray-300 mb-4 font-light tracking-wide">
                Discover. Contribute. <span className="text-[#FF0B55] font-semibold">Grow.</span>
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Your gateway to meaningful open source contributions and developer growth — built for devs, by a dev.
              </p>

              {/* Scroll cue */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-12 flex flex-col items-center gap-2 text-gray-400"
              >
                <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── STATS ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={50000} suffix="+" label="Repositories" delay={0} />
            <StatCard value={5000} suffix="+" label="Developers" delay={0.1} />
            <StatCard value={120} suffix="+" label="Languages" delay={0.2} />
            <StatCard value={98} suffix="%" label="Satisfaction" delay={0.3} />
          </div>
        </div>

        {/* ─── MISSION ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold tracking-widest text-[#FF0B55] uppercase mb-3 block">Mission</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Why We Built This
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Finding the right open-source project to contribute to can be overwhelming. We built OpenSc0ut to cut through the noise and surface projects that actually match your skills and interests.
            </p>
          </motion.div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              delay={0}
              icon={<svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
              title="Smart Discovery"
              desc="Filter repositories by language, stars, forks, and activity. Find the perfect project in seconds, not hours."
            />
            <FeatureCard
              delay={0.1}
              icon={<svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              title="Real-Time Data"
              desc="Powered by the GitHub API, every result is fresh and accurate. No stale data, no outdated listings."
            />
            <FeatureCard
              delay={0.2}
              icon={<svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              title="Community Driven"
              desc="Connect with thousands of developers worldwide who are all working toward the same goal — growing together."
            />
            <FeatureCard
              delay={0.3}
              icon={<svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
              title="Skill Matching"
              desc="Whether you're a beginner or a seasoned engineer, find projects that challenge you at just the right level."
            />
            <FeatureCard
              delay={0.4}
              icon={<svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
              title="AI Recommendations"
              desc="Our AI-powered suggestions analyze trends and recommend repos most likely to match your dev profile."
            />
            <FeatureCard
              delay={0.5}
              icon={<svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
              title="Learn & Grow"
              desc="Every contribution is a step forward. Track your progress and celebrate milestones as you level up."
            />
          </div>
        </div>

        {/* ─── HOW IT WORKS ─── */}
        <div className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF0B55]/3 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left — steps */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-10"
                >
                  <span className="text-xs font-bold tracking-widest text-[#FF0B55] uppercase mb-3 block">Process</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                    How It Works
                  </h2>
                </motion.div>
                <div className="space-y-0">
                  <TimelineStep step={1} title="Search & Filter" desc="Enter keywords and apply filters like language, stars, or activity to narrow results." delay={0.1} />
                  <TimelineStep step={2} title="Explore Projects" desc="Browse rich project cards with all the info you need — stars, forks, language, and last update." delay={0.2} />
                  <TimelineStep step={3} title="Dive Deep" desc="Click through to GitHub and explore the codebase, open issues, and contribution guidelines." delay={0.3} />
                  <TimelineStep step={4} title="Contribute & Shine" desc="Make your first PR, get it merged, and build a portfolio that speaks for itself." delay={0.4} />
                </div>
              </div>

              {/* Right — tech stack card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative group"
                >
                  {/* Animated glow */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#FF0B55]/20 via-transparent to-[#FF0B55]/10 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 group-hover:blur-3xl transition-all duration-700 pointer-events-none" />

                  {/* Moving gradient border */}
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-[#FF0B55]/50 via-white/10 to-[#FF0B55]/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[length:200%] animate-[gradientShift_3s_ease_infinite] blur-[2px]" />

                  <div className="relative bg-[#0d0d0d]/95 backdrop-blur-2xl border border-white/[0.08] group-hover:border-transparent rounded-3xl p-8 space-y-8 transition-all duration-500 shadow-2xl overflow-hidden">

                    {/* Internal ambient light */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF0B55]/10 rounded-full blur-[80px] -z-10 group-hover:bg-[#FF0B55]/20 transition-colors duration-700" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -z-10 group-hover:bg-purple-500/20 transition-colors duration-700" />
                    {/* GitHub API */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-[#FF0B55]/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#FF0B55]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">GitHub API</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Unauthenticated", value: "60 req/hr", color: "text-amber-500" },
                          { label: "Authenticated", value: "5,000 req/hr", color: "text-emerald-500" },
                        ].map((item) => (
                          <div key={item.label} className="bg-white/10 border border-white/10 rounded-xl p-3">
                            <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

                    {/* Tech stack */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        <h4 className="font-bold text-gray-900 dark:text-white">Built With</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "GitHub API"].map((tech, i) => (
                          <TechBadge key={tech} name={tech} delay={i * 0.05} />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ─── OPEN SOURCE BENEFITS ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold tracking-widest text-[#FF0B55] uppercase mb-3 block">Benefits</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Why Open Source?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
              Contributing to open source is one of the most powerful ways to grow as a developer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <svg className="w-6 h-6 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                title: "Gain Real-World Experience",
                desc: "Work on production-level codebases used by thousands — or even millions — of developers globally.",
                gradient: "from-rose-500/10",
              },
              {
                icon: <svg className="w-6 h-6 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
                title: "Build Your Portfolio",
                desc: "Merged PRs are public proof of your skills — the best portfolio is code that's actually running in production.",
                gradient: "from-orange-500/10",
              },
              {
                icon: <svg className="w-6 h-6 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
                title: "Learn from the Best",
                desc: "Code reviews from experienced maintainers are worth more than any tutorial — get direct expert feedback.",
                gradient: "from-blue-500/10",
              },
              {
                icon: <svg className="w-6 h-6 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                title: "Join a Global Community",
                desc: "Connect with developers across continents. Open source transcends borders, companies, and time zones.",
                gradient: "from-purple-500/10",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                <div className="relative flex gap-5 bg-white/5 border border-white/10 group-hover:border-[#FF0B55]/30 rounded-2xl p-6 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#FF0B55]/10 border border-[#FF0B55]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF0B55]/20 transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1.5">{item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── CTA BANNER ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0B55] via-[#d4004a] to-[#8b0033]" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10 py-16 px-8 text-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                🚀
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Ready to Start Contributing?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Thousands of open-source projects are waiting for your first PR. Your journey starts here.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#FF0B55] font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  Explore Projects
                </Link>
                <Link
                  href="/gsoc"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  Explore GSoC
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

      </main>

      {/* Gradient shift keyframe */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}