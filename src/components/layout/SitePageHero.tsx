"use client";

import type { ReactNode } from "react";
import PageGridBackground from "./PageGridBackground";

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
  minHeightClass = "min-h-[56vh]",
  align = "center",
}: SitePageHeroProps) {
  const alignClass = align === "left" ? "text-left lg:max-w-none" : "text-center max-w-4xl mx-auto";

  return (
    <div
      className={`relative flex items-center overflow-hidden ${minHeightClass}`}
    >
      <PageGridBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-24 md:py-28">
        <div className={alignClass}>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6 ${align === "left" ? "" : "mx-auto"}`}
          >
            <span className="w-2 h-2 bg-[#FF0B55] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">{badge}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-xl md:text-2xl text-gray-300 font-light mb-2">{subtitle}</p>
          ) : null}
          {description ? (
            <p
              className={`text-base md:text-lg text-gray-400 max-w-2xl ${align === "center" ? "mx-auto" : ""}`}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
