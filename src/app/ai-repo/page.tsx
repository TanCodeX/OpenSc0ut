"use client";

import { useState } from "react";
import { SitePageHero } from "../../components";
import { motion, AnimatePresence } from "framer-motion";
import { AIAnalysisResult, RepoSignals } from "../../types/analysis";
import Link from "next/link";

export default function AIRepoPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [signals, setSignals] = useState<RepoSignals | null>(null);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setSignals(null);

    try {
      const res = await fetch("/api/repo-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data.result);
      setSignals(data.signals);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes("A")) return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10 shadow-emerald-400/20";
    if (grade.includes("B")) return "text-blue-400 border-blue-400/30 bg-blue-400/10 shadow-blue-400/20";
    if (grade.includes("C")) return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10 shadow-yellow-400/20";
    if (grade.includes("D")) return "text-orange-400 border-orange-400/30 bg-orange-400/10 shadow-orange-400/20";
    return "text-red-500 border-red-500/30 bg-red-500/10 shadow-red-500/20";
  };

  const getLabelColor = (label: string) => {
    switch (label) {
      case "Excellent": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "Good": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Fair": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Needs Improvement": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300">
      <main>
        <SitePageHero
          badge="AI tools"
          title={
            <>
              <span className="text-white">Repo </span>
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0B55] via-[#ff4d7d] to-[#FF0B55] bg-[length:200%] animate-[gradientShift_3s_ease_infinite]">
                  Scout
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF0B55] to-transparent" />
              </span>
            </>
          }
          subtitle="Analyze any GitHub repo's contribution readiness in seconds."
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-8 relative z-10 flex flex-col">
          
          {/* Search Bar */}
          <div className="w-full mb-12">
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF0B55]/40 to-purple-500/40 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500 pointer-events-none" />
              <form onSubmit={handleAnalyze} className="relative flex items-center w-full">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. facebook/react or https://github.com/microsoft/vscode"
                  className="w-full px-6 py-4 bg-[#0d0d0d]/90 backdrop-blur-xl border border-white/10 focus:border-[#FF0B55]/50 rounded-2xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-0 pr-36 shadow-2xl"
                />
                <motion.button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className={`absolute right-2 px-6 py-2.5 text-white font-bold rounded-xl transition-all duration-300 shadow-lg ${
                    loading
                      ? "bg-gradient-to-r from-[#FF0B55] via-[#ff4d7d] to-[#FF0B55] bg-[length:200%] animate-[shimmer_1.5s_linear_infinite] shadow-[#FF0B55]/40 min-w-[120px]"
                      : "bg-[#FF0B55] hover:bg-[#FF0B55]/90 disabled:opacity-50 shadow-[#FF0B55]/20"
                  }`}
                >
                  {loading ? "Scanning..." : "Analyze"}
                </motion.button>
              </form>
            </div>
            
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center max-w-2xl mx-auto">
                {error}
              </motion.div>
            )}
          </div>

          {/* Results Area */}
          <AnimatePresence>
            {analysis && signals && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="w-full space-y-8"
              >
                
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-gray-400 mb-2">Contribution Readiness for</h2>
                  <a href={`https://github.com/${signals.owner}/${signals.repo}`} target="_blank" rel="noopener noreferrer" className="text-4xl md:text-5xl font-extrabold text-white hover:text-[#FF0B55] transition-colors">
                    {signals.owner}/{signals.repo}
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Column: Grade & Summary */}
                  <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
                    {/* Grade Card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center text-center relative overflow-hidden h-64">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Overall Grade</span>
                      <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] ${getGradeColor(analysis.grade)}`}>
                        <span className="text-6xl font-black">{analysis.grade}</span>
                      </div>
                      <span className="mt-4 text-sm text-gray-500 font-medium">Score: {analysis.overallScore}/100</span>
                    </div>

                    {/* AI Narrative */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          <h3 className="text-lg font-bold">AI Synthesis</h3>
                        </div>
                        <button onClick={() => setIsSummaryExpanded(!isSummaryExpanded)} className="text-gray-400 hover:text-white">
                          <svg className={`w-5 h-5 transition-transform ${isSummaryExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                      <AnimatePresence>
                        {isSummaryExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            <p className="text-gray-300 leading-relaxed mb-4">{analysis.narrative}</p>
                            {analysis.contradictions && (
                              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3 mt-4">
                                <svg className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <p className="text-sm text-yellow-200/80">{analysis.contradictions}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right Column: Metrics & Issues */}
                  <div className="col-span-1 md:col-span-7 flex flex-col gap-6">
                    {/* 4 Categories */}
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(analysis.categories).map(([key, cat]) => (
                        <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block capitalize">{key}</span>
                          <div className="flex items-end justify-between">
                            <span className="text-3xl font-black text-white">{cat.score}</span>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getLabelColor(cat.label)}`}>
                              {cat.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Raw Signals Strip */}
                    <div className="flex flex-wrap gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="px-3 py-1 bg-black/40 rounded-lg text-xs font-medium text-gray-300">★ {signals.stars.toLocaleString()} Stars</div>
                      <div className="px-3 py-1 bg-black/40 rounded-lg text-xs font-medium text-gray-300">{signals.openIssues} Open Issues</div>
                      <div className="px-3 py-1 bg-black/40 rounded-lg text-xs font-medium text-gray-300">CONTRIBUTING.md: {signals.hasContributing ? "✅" : "❌"}</div>
                      <div className="px-3 py-1 bg-black/40 rounded-lg text-xs font-medium text-gray-300">CoC: {signals.hasCodeOfConduct ? "✅" : "❌"}</div>
                    </div>

                    {/* Start Here Card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="w-8 h-8 rounded-full bg-[#FF0B55]/20 flex items-center justify-center text-[#FF0B55]">🚀</span>
                        <h3 className="text-lg font-bold">Start Here</h3>
                        <span className="ml-auto text-xs font-medium text-gray-400 bg-white/10 px-2 py-1 rounded-full">{analysis.startHere.length} good first issues</span>
                      </div>
                      
                      <div className="space-y-3 flex-1">
                        {analysis.startHere.length > 0 ? (
                          analysis.startHere.map((issue) => (
                            <a key={issue.number} href={issue.url} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FF0B55]/40 transition-colors group">
                              <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white line-clamp-1">{issue.title}</h4>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-500">#{issue.number}</span>
                                    <div className="flex gap-1 overflow-hidden">
                                      {issue.labels.slice(0, 2).map((label) => (
                                        <span key={label} className="text-[9px] px-1.5 py-0.5 bg-white/10 text-gray-300 rounded truncate max-w-[80px]">{label}</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          ))
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
                            <svg className="w-8 h-8 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                            <p className="text-gray-400 text-sm">No "good first issue" labels found.</p>
                            <p className="text-gray-500 text-xs mt-1">This doesn't mean you can't contribute, but you may need to ask maintainers for a starting point.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}
