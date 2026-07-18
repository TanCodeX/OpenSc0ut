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
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setSignals(null);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await fetch("/api/repo-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url }),
        signal: controller.signal,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data.result);
      setSignals(data.signals);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError("Scanning stopped by user.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
      setAbortController(null);
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

  const getBuildStatusStyles = (status: string) => {
    switch (status) {
      case "passing":
        return {
          badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
          glow: "from-emerald-500/10",
          label: "Passing",
          icon: "✓",
        };
      case "failing":
        return {
          badge: "text-red-400 bg-red-500/10 border-red-500/30",
          glow: "from-red-500/15",
          label: "Failing",
          icon: "✕",
        };
      case "pending":
        return {
          badge: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
          glow: "from-yellow-500/10",
          label: "Pending",
          icon: "…",
        };
      case "no_ci":
        return {
          badge: "text-gray-400 bg-gray-500/10 border-gray-500/30",
          glow: "from-gray-500/10",
          label: "No CI",
          icon: "—",
        };
      default:
        return {
          badge: "text-gray-400 bg-gray-500/10 border-gray-500/30",
          glow: "from-gray-500/10",
          label: "Unknown",
          icon: "?",
        };
    }
  };

  const getCodeHealthStatusStyles = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
      case "at_risk":
        return "text-orange-400 bg-orange-400/10 border-orange-400/30";
      case "broken":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    }
  };

  const getRiskStyles = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
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
          subtitle="Analyze contribution readiness, CI health on main, and open bugs — in seconds."
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
                <div className="absolute right-2 flex items-center gap-2">
                  {loading && (
                    <motion.button
                      type="button"
                      onClick={handleStop}
                      className="px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 text-sm font-bold rounded-xl transition-all shadow-lg border border-white/10 backdrop-blur-sm"
                    >
                      Stop
                    </motion.button>
                  )}
                  <motion.button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className={`px-6 py-2.5 text-white font-bold rounded-xl transition-all duration-300 shadow-lg ${
                      loading
                        ? "bg-gradient-to-r from-[#FF0B55] via-[#ff4d7d] to-[#FF0B55] bg-[length:200%] animate-[shimmer_1.5s_linear_infinite] shadow-[#FF0B55]/40 min-w-[120px]"
                        : "bg-[#FF0B55] hover:bg-[#FF0B55]/90 disabled:opacity-50 shadow-[#FF0B55]/20"
                    }`}
                  >
                    {loading ? "Scanning..." : "Analyze"}
                  </motion.button>
                </div>
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
                          <h3 className="text-lg font-bold">Summary</h3>
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
                      <div className="px-3 py-1 bg-black/40 rounded-lg text-xs font-medium text-gray-300 flex items-center gap-1.5"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path></svg> {signals.stars.toLocaleString()} Stars</div>
                      <div className="px-3 py-1 bg-black/40 rounded-lg text-xs font-medium text-gray-300 flex items-center gap-1.5"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg> {signals.forks.toLocaleString()} Forks</div>
                      <div className="px-3 py-1 bg-black/40 rounded-lg text-xs font-medium text-gray-300 flex items-center gap-1.5"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16"><path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.498 3.498 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"></path></svg> {signals.contributorsCount.toLocaleString()} Contributors</div>
                      <div className="px-3 py-1 bg-black/40 rounded-lg text-xs font-medium text-gray-300 flex items-center gap-1.5"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg> {signals.openIssues.toLocaleString()} Open Issues</div>
                      <div className="px-3 py-1 bg-black/40 rounded-lg text-xs font-medium text-gray-300">CONTRIBUTING.md: {signals.hasContributing ? "✅" : "❌"}</div>
                      <div className="px-3 py-1 bg-black/40 rounded-lg text-xs font-medium text-gray-300">CoC: {signals.hasCodeOfConduct ? "✅" : "❌"}</div>
                    </div>

                    {/* Required Skills */}
                    {signals.languages && signals.languages.length > 0 && (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Required Skills</span>
                        <div className="flex flex-wrap gap-2">
                          {signals.languages.map((lang) => (
                            <span key={lang} className="px-3 py-1.5 bg-[#FF0B55]/10 border border-[#FF0B55]/20 text-[#FF0B55] rounded-full text-xs font-semibold">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

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

                {/* Code Health & Bugs — is main broken? active bugs? */}
                {signals.codeHealth && analysis.codeHealth && (() => {
                  const ch = signals.codeHealth;
                  const assessment = analysis.codeHealth;
                  const buildStyles = getBuildStatusStyles(ch.buildStatus);
                  return (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${buildStyles.glow} via-transparent to-transparent pointer-events-none`} />

                      <div className="relative">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                              <svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </span>
                            <div>
                              <h3 className="text-lg font-bold">Code Health &amp; Bugs</h3>
                              <p className="text-xs text-gray-500">Is the main branch broken? What bugs are open?</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border uppercase tracking-wide ${getCodeHealthStatusStyles(assessment.status)}`}>
                              {assessment.status.replace("_", " ")}
                            </span>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getRiskStyles(assessment.riskLevel)}`}>
                              {assessment.riskLevel} risk
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed mb-6 max-w-3xl">
                          {assessment.summary}
                        </p>

                        {assessment.warnings && assessment.warnings.length > 0 && (
                          <div className="mb-6 flex flex-col gap-2">
                            {assessment.warnings.map((warning, i) => (
                              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-500/5 border border-orange-500/15">
                                <svg className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p className="text-sm text-orange-200/90">{warning}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {/* Build status card */}
                          <div className="rounded-2xl bg-black/30 border border-white/10 p-5">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {signals.defaultBranch} branch
                              </span>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${buildStyles.badge}`}>
                                {buildStyles.icon} {buildStyles.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300 mb-4">{ch.buildStatusDescription}</p>
                            <div className="space-y-2 text-xs text-gray-500">
                              {ch.latestCommitSha && (
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-600 shrink-0">commit</span>
                                  {ch.latestCommitUrl ? (
                                    <a href={ch.latestCommitUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white font-mono">
                                      {ch.latestCommitSha}
                                    </a>
                                  ) : (
                                    <span className="font-mono text-gray-300">{ch.latestCommitSha}</span>
                                  )}
                                  {ch.latestCommitMessage && (
                                    <span className="text-gray-500 line-clamp-1">— {ch.latestCommitMessage}</span>
                                  )}
                                </div>
                              )}
                              {ch.latestWorkflowName && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600 shrink-0">workflow</span>
                                  {ch.latestWorkflowUrl ? (
                                    <a href={ch.latestWorkflowUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white truncate">
                                      {ch.latestWorkflowName}
                                    </a>
                                  ) : (
                                    <span className="text-gray-300 truncate">{ch.latestWorkflowName}</span>
                                  )}
                                  {ch.latestWorkflowConclusion && (
                                    <span className="text-gray-500">({ch.latestWorkflowConclusion})</span>
                                  )}
                                </div>
                              )}
                              {ch.totalCheckCount > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600">checks</span>
                                  <span className="text-gray-300">
                                    {ch.failingCheckCount > 0
                                      ? `${ch.failingCheckCount} failing · ${ch.totalCheckCount} total`
                                      : `${ch.totalCheckCount} green`}
                                  </span>
                                </div>
                              )}
                            </div>

                            {ch.failingChecks.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                                <span className="text-[10px] font-bold text-red-400/80 uppercase tracking-wider">Failing checks</span>
                                {ch.failingChecks.slice(0, 5).map((check, i) => (
                                  <div key={i} className="flex items-center justify-between gap-2 text-sm">
                                    {check.url ? (
                                      <a href={check.url} target="_blank" rel="noopener noreferrer" className="text-red-300 hover:text-red-200 truncate">
                                        {check.name}
                                      </a>
                                    ) : (
                                      <span className="text-red-300 truncate">{check.name}</span>
                                    )}
                                    <span className="text-[10px] text-red-400/70 shrink-0 font-mono">{check.conclusion}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Bugs card */}
                          <div className="rounded-2xl bg-black/30 border border-white/10 p-5 flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Open bugs</span>
                              <div className="flex items-center gap-2">
                                {ch.criticalBugCount > 0 && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-red-400 bg-red-500/10 border-red-500/30">
                                    {ch.criticalBugCount} critical
                                  </span>
                                )}
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                  ch.openBugCount === 0
                                    ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
                                    : ch.openBugCount >= 10
                                      ? "text-orange-400 bg-orange-400/10 border-orange-400/30"
                                      : "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
                                }`}>
                                  {ch.openBugCount} bug{ch.openBugCount === 1 ? "" : "s"}
                                </span>
                              </div>
                            </div>

                            <div className="flex-1 space-y-2">
                              {ch.recentBugIssues.length > 0 ? (
                                ch.recentBugIssues.map((issue) => (
                                  <a
                                    key={issue.number}
                                    href={issue.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-red-500/30 transition-colors group"
                                  >
                                    <div className="flex items-start gap-2.5">
                                      <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <div className="min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white line-clamp-1">{issue.title}</h4>
                                        <div className="flex items-center gap-2 mt-1.5">
                                          <span className="text-xs text-gray-500">#{issue.number}</span>
                                          <div className="flex gap-1 overflow-hidden">
                                            {issue.labels.slice(0, 2).map((label) => (
                                              <span key={label} className="text-[9px] px-1.5 py-0.5 bg-red-500/10 text-red-300/80 rounded truncate max-w-[80px]">{label}</span>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </a>
                                ))
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
                                  <svg className="w-7 h-7 text-emerald-500/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-gray-400 text-sm">No open bug-labeled issues found.</p>
                                  <p className="text-gray-500 text-xs mt-1">Either the project is clean, or bugs use different labels.</p>
                                </div>
                              )}
                            </div>

                            {ch.openBugCount > ch.recentBugIssues.length && (
                              <a
                                href={`https://github.com/${signals.owner}/${signals.repo}/issues?q=is%3Aissue+is%3Aopen+label%3Abug`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 text-xs text-center text-gray-400 hover:text-[#FF0B55] transition-colors"
                              >
                                View all {ch.openBugCount} bug issues on GitHub →
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] text-gray-600 text-center">
                          Based on CI check-runs, Actions on <code className="text-gray-500">{signals.defaultBranch}</code>, and bug-labeled issues — not a full static analysis of source code.
                        </p>
                      </div>
                    </div>
                  );
                })()}
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
