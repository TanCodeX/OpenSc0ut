// ==================== src/app/ai-repo/page.tsx ====================
"use client";

import { useState } from "react";
import { Header } from "../../components";

export default function AIRepoPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // NOTE: This calls your Next.js proxy (Step 5)
      const res = await fetch("/api/ai-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl }),
      });

      const data = await res.json();

      if (data.success) {
        setAnalysisResult(data.result);
      } else {
        setError(data.error || "Analysis failed on the server.");
      }
    } catch (err: any) {
      setError("Failed to connect to the analysis service.");
      console.error(err);
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
            <label className="block text-sm font-semibold text-white mb-2">
              GitHub Repository URL
            </label>
            <div className="flex gap-4">
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="e.g., https://github.com/owner/repo"
                className="flex-1 px-4 py-2 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-full text-gray-300 placeholder-gray-500 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={loading || !repoUrl}
                className="bg-[#FF0B55] hover:bg-black hover:border-[#FF0B55] hover:border-2 hover:shadow-[0_0_15px_rgba(255,11,85,0.5)] text-black hover:text-white font-semibold px-6 py-2 text-sm rounded-full border-2 border-transparent transition-all duration-100 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Analyzing..." : "Run AI Analysis"}
              </button>
            </div>
          </form>

          {loading && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF0B55]"></div>
            </div>
          )}

          {error && (
            <div className="mt-8 bg-red-900/30 border border-red-800/50 p-4 rounded-lg text-red-300">
              Error: {error}
            </div>
          )}

          {analysisResult && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                AI Analysis Report
              </h2>
              <pre className="whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg text-sm text-gray-300">
                {JSON.stringify(analysisResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
// ===================================================================