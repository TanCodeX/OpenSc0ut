"use client";

import React, { useEffect, useState } from "react";
import { Organization } from "../../data/orgs";
import { motion, AnimatePresence } from "framer-motion";

interface OrgCardProps {
  org: Organization;
}

interface GithubStats {
  stars: number;
  forks: number;
  issues: number;
  activity: string;
}


export function OrgCard({ org }: OrgCardProps) {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState(false);
  const [triedClearbit, setTriedClearbit] = useState(false);


  const [inView, setInView] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      if (!org.githubRepo) {
        if (isMounted) {
          setStats(null);
          setLoading(false);
        }
        return;
      }
      
      // Don't fetch until the card is actually visible on screen
      if (!inView) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/github?repo=${org.githubRepo}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setStats(data);
        } else {
          if (isMounted) setStats({ stars: 0, forks: 0, issues: 0, activity: "unknown" });
        }
      } catch (error) {
        console.error("Failed to fetch stats for", org.githubRepo);
        if (isMounted) setStats({ stars: 0, forks: 0, issues: 0, activity: "unknown" });
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [org.githubRepo, inView]);


  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);

  const getActivityBadge = (activity: string) => {
    switch (activity) {
      case "active":
        return { dot: "bg-emerald-400", text: "text-emerald-400", label: "Active" };
      case "moderate":
        return { dot: "bg-amber-400", text: "text-amber-400", label: "Moderate" };
      case "low":
        return { dot: "bg-red-400", text: "text-red-400", label: "Low" };
      default:
        return { dot: "bg-gray-400", text: "text-gray-400", label: "Unknown" };
    }
  };

  const initials = org.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group flex flex-col h-full rounded-2xl overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      {/* Card background */}
      <div className="absolute inset-0 bg-white dark:bg-[#0f0f13] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl transition-all duration-500 group-hover:border-[#FF0B55]/30" />

      {/* Ambient glow on hover */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,11,85,0.06), transparent 40%)" }}
      />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF0B55]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full p-5">
        {/* Header: Logo + Name + Year tags */}
        <div className="flex items-start gap-4 mb-4">
          {/* Logo or initials fallback */}
          <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:shadow-[#FF0B55]/10 group-hover:shadow-md transition-shadow duration-300">
            {org.logoUrl && !imgError ? (
              <img
                src={org.logoUrl}
                alt={`${org.name} logo`}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  if (!triedClearbit) {
                    setTriedClearbit(true);
                    const domain = org.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.org';
                    e.currentTarget.src = `https://logo.clearbit.com/${domain}`;
                  } else {
                    setImgError(true);
                  }
                }}
              />
            ) : (
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{initials}</span>
            )}
          </div>

          {/* Name + year badges */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#FF0B55] transition-colors duration-300 leading-tight line-clamp-2">
              {org.name}
            </h3>
            {org.years && org.years.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {org.years.slice(0, 2).map((y) => (
                  <span
                    key={y}
                    className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#FF0B55]/10 text-[#FF0B55] border border-[#FF0B55]/20 tracking-wide"
                  >
                    {y}
                  </span>
                ))}
                {org.years.length > 2 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10">
                    +{org.years.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {org.description}
        </p>

        {/* Tags */}
        {org.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {org.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-gray-400 transition-colors group-hover:border-[#FF0B55]/20"
              >
                {tag}
              </span>
            ))}
            {org.tags.length > 5 && (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] text-gray-400">
                +{org.tags.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Footer: GitHub stats */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/[0.06]">
          {org.githubRepo ? (
            loading ? (
              <div className="flex gap-3 animate-pulse">
                <div className="h-4 w-14 bg-gray-200 dark:bg-white/10 rounded-full" />
                <div className="h-4 w-14 bg-gray-200 dark:bg-white/10 rounded-full" />
              </div>
            ) : stats ? (
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{formatNumber(stats.stars)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{formatNumber(stats.forks)}</span>
                  </div>
                </div>
                {(() => {
                  const badge = getActivityBadge(stats.activity);
                  return (
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`} />
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${badge.text}`}>{badge.label}</span>
                    </div>
                  );
                })()}
              </div>
            ) : null
          ) : (
            <span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-widest">No Repository Linked</span>
          )}
        </div>


      </div>
    </motion.div>
  );
}
