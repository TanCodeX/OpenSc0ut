"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ORGS, Organization } from "../../data/orgs";

interface AIRecommendation {
  slug: string;
  reason: string;
  org?: Organization;
}

export function GsocAIAdvisor() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIRecommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Map the returned slugs to actual org data
      if (data.results && Array.isArray(data.results)) {
        const enrichedResults = data.results.map((item: any) => {
          const org = ORGS.find((o) => o.slug === item.slug);
          return {
            ...item,
            org,
          };
        }).filter((item: AIRecommendation) => item.org !== undefined);
        
        setResults(enrichedResults);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      setError(err.message || "Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-16 mt-8">
      {/* Advisor Header & Search Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative group"
      >
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF0B55]/30 via-purple-500/30 to-[#FF0B55]/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" />
        
        <div className="relative bg-[#0d0d0d]/90 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl">
          {/* Internal ambient light */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF0B55]/10 rounded-full blur-[80px] -z-10" />
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF0B55] to-purple-600 flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">AI Org Advisor</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Describe your skills, interests, and what you want to learn. Our AI will match you with the best GSoC organizations.
              </p>
              
              <form onSubmit={handleSearch} className="relative flex items-center w-full">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. I know React and Node.js, and I love open-source dev tools..."
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 focus:border-[#FF0B55]/50 rounded-2xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/20 pr-32"
                />
                <motion.button
                  type="submit"
                  disabled={loading || !query.trim()}
                  animate={loading ? {
                    boxShadow: [
                      "0 0 12px 2px rgba(255,11,85,0.3)",
                      "0 0 24px 6px rgba(255,11,85,0.6)",
                      "0 0 12px 2px rgba(255,11,85,0.3)",
                    ],
                  } : {}}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute right-2 px-5 py-2.5 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg overflow-hidden ${
                    loading
                      ? "bg-gradient-to-r from-[#FF0B55] via-[#ff4d7d] to-[#FF0B55] bg-[length:200%] animate-[shimmer_1.5s_linear_infinite] shadow-[#FF0B55]/40 min-w-[120px]"
                      : "bg-[#FF0B55] hover:bg-[#FF0B55]/90 disabled:opacity-50 shadow-[#FF0B55]/20"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      {/* Three animated bouncing dots */}
                      <span className="flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 bg-white rounded-full block"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.15,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </span>
                      <span className="tracking-wide">Thinking</span>
                    </span>
                  ) : (
                    "Find Match"
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Results Section */}
      <AnimatePresence>
        {results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-[#FF0B55] rounded-full" />
              <h3 className="text-xl font-bold text-white">Top AI Recommendations</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((rec, idx) => {
                const org = rec.org!;
                const initials = org.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase();

                return (
                  <motion.div
                    key={rec.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-white/80 dark:bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md rounded-lg border-[0.5px] border-gray-200 dark:border-[hsla(0,1.10%,36.10%,0.44)] overflow-hidden hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 flex flex-col h-full min-h-[280px]"
                  >
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Header: Logo + Name + rank badge */}
                      <div className="flex items-start gap-3 mb-3">
                        {/* Logo or initials */}
                        <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-400">
                          {(() => {
                            const githubOwner = org.githubRepo ? org.githubRepo.split('/')[0] : null;
                            const primarySrc = githubOwner ? `https://github.com/${githubOwner}.png` : org.logoUrl;
                            
                            if (primarySrc) {
                              return (
                                <img
                                  src={primarySrc}
                                  alt={`${org.name} logo`}
                                  className="w-full h-full object-contain p-1"
                                  onError={(e) => {
                                    if (githubOwner && org.logoUrl && e.currentTarget.src !== org.logoUrl) {
                                      e.currentTarget.src = org.logoUrl;
                                    } else {
                                      e.currentTarget.style.display = "none";
                                    }
                                  }}
                                />
                              );
                            }
                            return initials;
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                              {org.name}
                            </h3>
                            {/* Rank badge */}
                            <span className="shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#FF0B55] to-purple-600 text-white flex items-center justify-center text-[10px] font-bold shadow">
                              {idx + 1}
                            </span>
                          </div>
                          {/* Year badges */}
                          {org.years && org.years.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
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
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {org.description}
                      </p>

                      {/* AI Reason */}
                      <div className="flex gap-2 mb-3 p-2.5 rounded-lg bg-[#FF0B55]/5 border border-[#FF0B55]/15">
                        <svg className="w-3.5 h-3.5 text-[#FF0B55] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <p className="text-xs text-gray-400 dark:text-gray-400 leading-relaxed italic">
                          {rec.reason}
                        </p>
                      </div>

                      {/* Tags */}
                      {org.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {org.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-white/5 border border-white/10 text-gray-300 hover:border-[#FF0B55]/40 hover:text-white hover:bg-[#FF0B55]/8 transition-all duration-200 cursor-default tracking-wide"
                            >
                              {tag}
                            </span>
                          ))}
                          {org.tags.length > 4 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-white/5 border border-white/10 text-gray-500 tracking-wide">
                              +{org.tags.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 bg-gray-50 dark:bg-black/30 border-t border-[0.5px] border-gray-200 dark:border-[hsla(0,1.10%,36.10%,0.44)] text-center">
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
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
