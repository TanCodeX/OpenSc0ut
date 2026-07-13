"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrgCard } from "./OrgCard";
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((rec, idx) => (
                <motion.div
                  key={rec.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col h-full"
                >
                  <div className="mb-4 bg-[#0d0d0d]/80 border border-white/10 rounded-xl p-4 relative flex-shrink-0">
                    <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-gradient-to-br from-[#FF0B55] to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-lg border border-[#FF0B55]/30">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-gray-300 italic text-center pt-1 leading-relaxed">"{rec.reason}"</p>
                  </div>
                  <div className="flex-1">
                    {rec.org && <OrgCard org={rec.org} />}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
