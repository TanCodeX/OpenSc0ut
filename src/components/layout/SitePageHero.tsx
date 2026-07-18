"use client";

import type { ReactNode } from "react";
import PageGridBackground from "./PageGridBackground";
import { motion } from "framer-motion";

type SitePageHeroProps = {
  badge: string;
  title: ReactNode;
  subtitle?: string;
  description?: string;
  minHeightClass?: string;
  align?: "center" | "left";
};

export default function SitePageHero({
  badge,
  title,
  subtitle,
  description,
  minHeightClass = "min-h-[75vh]",
  align = "center",
}: SitePageHeroProps) {
  const alignClass = align === "left" ? "text-left lg:max-w-none" : "text-center max-w-4xl mx-auto";

  return (
    <div
      className={`relative flex items-center overflow-hidden ${minHeightClass}`}
    >
      <PageGridBackground />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[#FF0B55]/10 blur-[120px] animate-pulse" />
      </div>

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10vh] right-20 w-32 h-32 rounded-full bg-gradient-to-br from-[#FF0B55]/20 to-transparent border border-[#FF0B55]/20 blur-sm hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 16, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[55vh] left-16 w-20 h-20 rounded-full bg-gradient-to-br from-[#FF0B55]/15 to-transparent border border-[#FF0B55]/15 blur-sm hidden lg:block"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-28 pb-24 md:pt-32 md:pb-28">
        <div className={alignClass}>
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#FF0B55]/30 backdrop-blur-sm mb-6 shadow-lg shadow-[#FF0B55]/10 ${align === "left" ? "" : "mx-auto"}`}
          >
            <span className="w-2 h-2 bg-[#FF0B55] rounded-full animate-ping" />
            <span className="w-2 h-2 bg-[#FF0B55] rounded-full absolute" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">{badge}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-light mb-2">{subtitle}</p>
          ) : null}
          {description ? (
            <p
              className={`text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl ${align === "center" ? "mx-auto" : ""}`}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
