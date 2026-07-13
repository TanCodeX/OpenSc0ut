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
  const [imgError, setImgError] = useState(false);
  const [triedClearbit, setTriedClearbit] = useState(false);

  const initials = org.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group flex flex-col h-full min-h-[280px] rounded-2xl overflow-hidden"
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
            {(() => {
              const githubOwner = org.githubRepo ? org.githubRepo.split('/')[0] : null;
              const primarySrc = githubOwner ? `https://github.com/${githubOwner}.png` : org.logoUrl;
              
              if (primarySrc && !imgError) {
                return (
                  <img
                    src={primarySrc}
                    alt={`${org.name} logo`}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      if (!triedClearbit) {
                        setTriedClearbit(true);
                        // Try fallback to original logoUrl if github failed, else clearbit
                        if (githubOwner && org.logoUrl) {
                          e.currentTarget.src = org.logoUrl;
                        } else {
                          const domain = org.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.org';
                          e.currentTarget.src = `https://logo.clearbit.com/${domain}`;
                        }
                      } else {
                        setImgError(true);
                      }
                    }}
                  />
                );
              }
              
              return (
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{initials}</span>
              );
            })()}
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
          <div className="flex flex-wrap gap-1.5 mb-2 flex-1 items-end">
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
      </div>
      
      {/* Footer */}
      <div className="relative z-10 px-5 py-3 bg-gray-50 dark:bg-black/30 border-t border-[0.5px] border-gray-200 dark:border-white/[0.06] text-center mt-auto">
        {org.ideas ? (
          <a
            href={org.ideas}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF0B55] hover:text-[#e00a4c] text-sm font-medium transition-colors"
          >
            View Project Ideas →
          </a>
        ) : org.githubRepo ? (
          <a
            href={`https://github.com/${org.githubRepo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF0B55] hover:text-[#e00a4c] text-sm font-medium transition-colors"
          >
            View on GitHub →
          </a>
        ) : (
          <span className="text-gray-500 text-xs uppercase tracking-widest">No link available</span>
        )}
      </div>
    </motion.div>
  );
}
