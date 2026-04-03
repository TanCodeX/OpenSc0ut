"use client";

import { useState } from "react";
import { Header } from "../../components";
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
    <div className="p-3 bg-black/30 rounded-lg border border-gray-700/50 flex flex-col">
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
        <div className="md:col-span-2 bg-gray-900/50 border border-white/10 rounded-xl p-6">
          <h3 className="text-2xl font-semibold text-white mb-3">Overview</h3>
          <p className="text-gray-300 leading-relaxed text-sm">{result.summary}</p>
        </div>

        {/* Overall Health */}
        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
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
        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
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
        <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Overall Health Breakdown</h3>
          <div className="space-y-4">
            {result.healthBreakdown.map((factor, i) => (
              <ScoreBreakdownCard key={i} factor={factor} />
            ))}
          </div>
        </div>

        <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Code Quality Breakdown</h3>
          <div className="space-y-4">
            {result.qualityBreakdown.map((factor, i) => (
              <ScoreBreakdownCard key={i} factor={factor} />
            ))}
          </div>
        </div>
      </div>

      {/* Potential Issues */}
      <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl p-6 mt-6">
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
              <span key={i} className="px-2 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
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
      <Header />
      <main className="pt-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-10">
          <span className="text-[#FF0B55]">AI</span> Repository Scout
        </h1>

        <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block text-sm font-semibold text-white mb-2">GitHub Repository URL</label>
            <div className="flex gap-4">
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="flex-1 px-4 py-2 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-full text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50"
                required
              />
              <button
                type="submit"
                disabled={loading || !repoUrl}
                className="bg-[#FF0B55] hover:bg-black text-black hover:text-white font-semibold px-6 py-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Analyzing..." : "Run AI Analysis"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-8 bg-red-900/30 border border-red-800/50 p-4 rounded-lg text-red-300">{error}</div>
          )}

          {loading && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF0B55]"></div>
            </div>
          )}

          {analysisResult && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <AnalysisReportDisplay result={analysisResult} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
