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

interface GFIIssue {
  title: string;
  url: string;
  created_at: string;
}

interface GFIResponse {
  total_count: number;
  issues: GFIIssue[];
}

export function OrgCard({ org }: OrgCardProps) {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [gfiData, setGfiData] = useState<GFIResponse | null>(null);
  const [loadingGfi, setLoadingGfi] = useState<boolean>(false);
  const [showGfi, setShowGfi] = useState<boolean>(false);

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
      try {
        setLoading(true);
        const res = await fetch(`/api/github?repo=${org.githubRepo}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setStats(data);
        } else {
           if (isMounted) setStats({ stars: 0, forks: 0, issues: 0, activity: 'unknown' });
        }
      } catch (error) {
        console.error("Failed to fetch stats for", org.githubRepo);
        if (isMounted) setStats({ stars: 0, forks: 0, issues: 0, activity: 'unknown' });
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [org.githubRepo]);

  const handleFetchGfi = async () => {
    if (showGfi) {
      setShowGfi(false);
      return;
    }
    
    setShowGfi(true);
    if (gfiData) return; // Already fetched

    setLoadingGfi(true);
    try {
      const res = await fetch(`/api/github?repo=${org.githubRepo}&gfi=1`);
      if (res.ok) {
        const data = await res.json();
        setGfiData(data);
      }
    } catch (error) {
      console.error("Failed to fetch GFI for", org.githubRepo);
    } finally {
      setLoadingGfi(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'active':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'moderate':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'low':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative group flex flex-col h-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#FF0B55]/40 hover:shadow-xl hover:shadow-[#FF0B55]/5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF0B55]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="p-6 flex-1 flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#FF0B55] transition-colors">
            {org.name}
          </h3>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 whitespace-nowrap">
              {org.category}
            </span>
            {org.years && org.years.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end max-w-[140px]">
                {org.years.map((y) => (
                  <span key={y} className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#FF0B55]/10 text-[#FF0B55] border border-[#FF0B55]/20">
                    {y}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1">
          {org.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {org.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-md bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-white/10 mt-auto flex items-center justify-between">
          {org.ideas && (
            <a
              href={org.ideas}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-[#FF0B55] hover:text-[#cc0944] transition-colors flex items-center gap-1"
            >
              Ideas List
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          )}
          {org.githubRepo ? (
            loading ? (
              <div className="flex justify-between items-center animate-pulse w-full ml-auto justify-end">
                 <div className="flex gap-4 ml-auto">
                    <div className="h-4 w-12 bg-gray-200 dark:bg-white/10 rounded" />
                    <div className="h-4 w-12 bg-gray-200 dark:bg-white/10 rounded" />
                 </div>
              </div>
            ) : stats ? (
              <div className="flex justify-between items-center ml-auto gap-4">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                    <span className="text-sm font-semibold">{formatNumber(stats.stars)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    <span className="text-sm font-semibold">{formatNumber(stats.forks)}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border ${getActivityColor(stats.activity)}`}>
                  {stats.activity}
                </span>
              </div>
            ) : null
          ) : (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-auto">
              No Repository Linked
            </span>
          )}
        </div>

        {/* Good First Issues Section */}
        {org.githubRepo && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
            <button 
              onClick={handleFetchGfi}
              className="w-full py-2 px-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {showGfi ? 'Hide Good First Issues' : 'Find Good First Issues'}
            </button>

            <AnimatePresence>
              {showGfi && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-2">
                    {loadingGfi ? (
                       <div className="space-y-2">
                         <div className="h-8 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
                         <div className="h-8 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
                       </div>
                    ) : gfiData && gfiData.issues.length > 0 ? (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 mb-2">Showing top {gfiData.issues.length} of {gfiData.total_count}</div>
                        {gfiData.issues.map((issue, idx) => (
                          <a
                            key={idx}
                            href={issue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-[#FF0B55]/40 transition-colors group/issue"
                          >
                            <div className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover/issue:text-[#FF0B55] line-clamp-2">
                                {issue.title}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-500">
                        No open "good first issue" found right now.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
