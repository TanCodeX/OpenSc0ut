"use client";

import { useState } from "react";
import { SitePageHero } from "../../components";
import { cn } from "@/lib/utils";

// --- Types ---
interface ScoreFactor {
  factor: string;
  weight: number;
  score: number;
}

interface SuspiciousSnippet {
  query: { file: string; snippet: string };
  matched: { repo?: string; file?: string; snippet?: string };
  similarity: number;
}

interface AIAnalysisResult {
  repositoryName: string;
  summary: string;
  score: number; // Overall Project Health (0-100)
  healthBreakdown: ScoreFactor[];
  codeQualityScore: number; // Code Quality (0-100)
  qualityBreakdown: ScoreFactor[];
  potentialBugs: SuspiciousSnippet[];
  dependencyHealth: "Stable" | "Outdated" | "Critical";
  lastCommitDate: string;
  license: string;
  keyFeatures: string[];
  contributionGuide: {
    difficulty: "Easy" | "Medium" | "Hard";
    goodFirstIssuesLink: string;
  };
  techStack: string[];
}

// --- Components ---
const ScoreBreakdownCard: React.FC<{ factor: ScoreFactor }> = ({ factor }) => {
  const getColor = (score: number) =>
    score >= 90 ? "text-green-400" : score >= 70 ? "text-yellow-400" : "text-red-400";
  const getBarColor = (score: number) =>
    score >= 90 ? "bg-green-500" : score >= 70 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="p-3 bg-black/30 rounded-xl border border-white/10 flex flex-col">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-300">{factor.factor}</span>
        <span className={cn("text-lg font-bold", getColor(factor.score))}>{factor.score}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className={cn("h-2.5 rounded-full transition-all duration-500", getBarColor(factor.score))}
          style={{ width: `${factor.score}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">Weight: {factor.weight}%</p>
    </div>
  );
};

const AnalysisReportDisplay: React.FC<{ result: AIAnalysisResult }> = ({ result }) => {
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-600/70 text-green-100 border-green-500/30";
      case "Medium":
        return "bg-yellow-600/70 text-yellow-100 border-yellow-500/30";
      case "Hard":
        return "bg-red-600/70 text-red-100 border-red-500/30";
      default:
        return "bg-gray-600/70 text-gray-100 border-gray-500/30";
    }
  };

  const getHealthColor = (score: number) =>
    score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";
  const getDependencyClass = (health: string) =>
    health === "Stable" ? "text-green-400" : health === "Outdated" ? "text-yellow-400" : "text-red-400";

  const formattedLastCommit = new Date(result.lastCommitDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Repo Title */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-[#FF0B55] mb-2">{result.repositoryName}</h2>
        <p className="text-gray-400">AI Generated Analysis Report</p>
      </div>

      {/* Overview & Scores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Overview */}
        <div className="md:col-span-2 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-2xl font-semibold text-white mb-3">Overview</h3>
          <p className="text-gray-300 leading-relaxed text-sm">{result.summary}</p>
        </div>

        {/* Overall Health */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-400 font-medium mb-2">Overall Project Health</p>
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-gray-700"
                d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
                strokeWidth="3"
                fill="none"
              />
              <path
                className={getHealthColor(result.score)}
                strokeDasharray={`${result.score}, 100`}
                d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
                strokeWidth="3"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xl font-bold text-white">
                {result.score}
                <span className="text-xs">%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Code Quality */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-400 font-medium mb-2">Code Quality Score</p>
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-gray-700"
                d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
                strokeWidth="3"
                fill="none"
              />
              <path
                className={getHealthColor(result.codeQualityScore)}
                strokeDasharray={`${result.codeQualityScore}, 100`}
                d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
                strokeWidth="3"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xl font-bold text-white">
                {result.codeQualityScore}
                <span className="text-xs">%</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Overall Health Breakdown</h3>
          <div className="space-y-4">
            {result.healthBreakdown.map((factor, i) => (
              <ScoreBreakdownCard key={i} factor={factor} />
            ))}
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Code Quality Breakdown</h3>
          <div className="space-y-4">
            {result.qualityBreakdown.map((factor, i) => (
              <ScoreBreakdownCard key={i} factor={factor} />
            ))}
          </div>
        </div>
      </div>

      {/* Potential Issues */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-semibold text-white mb-4">Potential Issues ({result.potentialBugs.length})</h3>
        <ul className="space-y-3">
          {result.potentialBugs.length ? (
            result.potentialBugs.map((bug, i) => (
              <li
                key={i}
                className="flex items-start text-sm bg-black/30 p-3 rounded-lg border border-yellow-800/50"
              >
                <span className="text-yellow-400 mr-3 mt-0.5">•</span>
                <span className="text-gray-300 flex-1">
                  {bug.query.file} | {bug.query.snippet.slice(0, 80)}... (similarity: {bug.similarity.toFixed(2)})
                </span>
              </li>
            ))
          ) : (
            <li className="text-green-400 flex items-center">No major issues detected. Great job!</li>
          )}
        </ul>
      </div>

      {/* License & Last Commit */}
      <div className="flex justify-between mt-6">
        <p className="text-gray-400 text-sm">
          License: <span className="text-white">{result.license}</span>
        </p>
        <p className="text-gray-400 text-sm">
          Last Commit: <span className="text-white">{formattedLastCommit}</span>
        </p>
      </div>

      {/* Contribution Guide */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-white mb-2">Contribution Guide</h3>
        <p
          className={cn(
            "inline-block px-3 py-1 rounded-full text-sm font-medium border",
            getDifficultyClass(result.contributionGuide.difficulty)
          )}
        >
          {result.contributionGuide.difficulty}
        </p>
        <a
          href={result.contributionGuide.goodFirstIssuesLink}
          target="_blank"
          className="ml-4 text-[#FF0B55] underline"
        >
          Good First Issues
        </a>
      </div>

      {/* Tech Stack */}
      {result.techStack.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white mb-2">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {result.techStack.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-[#FF0B55]/10 border border-[#FF0B55]/25 text-sm text-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---
export default function AIRepoPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/ai-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl }),
      });
      const data = await res.json();

      if (data.success && data.result) {
        const backend = data.result;
        const result: AIAnalysisResult = {
          repositoryName: backend.repositoryName,
          summary: backend.summary,
          score: backend.score,
          healthBreakdown: backend.healthBreakdown || [],
          codeQualityScore: backend.codeQualityScore || 0,
          qualityBreakdown: backend.qualityBreakdown || [],
          potentialBugs: backend.potentialBugs || [],
          dependencyHealth: backend.dependencyHealth || "Stable",
          lastCommitDate: backend.lastCommitDate || new Date().toISOString(),
          license: backend.license || "Unknown",
          keyFeatures: backend.keyFeatures || [],
          contributionGuide: backend.contributionGuide || { difficulty: "Medium", goodFirstIssuesLink: "#" },
          techStack: backend.techStack || [],
        };
        setAnalysisResult(result);
      } else {
        setError(data.error || "Analysis failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to AI analysis service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        <SitePageHero
          badge="AI tools"
          title={
            <>
              <span className="text-[#FF0B55]">AI</span> repository scout
            </>
          }
          description="Paste a GitHub URL and get a structured health and quality snapshot — same visual language as the rest of OpenSc0ut."
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-8 relative z-10">
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF0B55]/10 to-transparent blur-3xl -z-10 rounded-3xl" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-[#FF0B55] rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Analyze a repository</h2>
            </div>
            <p className="text-gray-400 max-w-2xl">
              We call the AI repo API and render scores, breakdowns, and notes in cards below.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0B55]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">GitHub repository URL</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="flex-1 min-w-0 px-4 py-3 bg-black/40 border border-white/15 rounded-full text-gray-300 placeholder-gray-500 hover:border-[#FF0B55]/40 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading || !repoUrl}
                    className="shrink-0 rounded-full bg-[#FF0B55] px-8 py-3 text-sm font-semibold text-black transition hover:bg-[#FF0B55]/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Analyzing..." : "Run analysis"}
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}

              {loading && (
                <div className="flex justify-center mt-10">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#FF0B55] border-t-transparent" />
                </div>
              )}

              {analysisResult && (
                <div className="mt-10 pt-10 border-t border-white/10">
                  <AnalysisReportDisplay result={analysisResult} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
