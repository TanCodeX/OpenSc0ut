// ==================== src/app/api/ai-repo/route.ts ====================
import { NextRequest, NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000/api/ai-repo";

// Simple GitHub URL validation
const isValidGitHubUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "github.com" && parsed.pathname.split("/").length >= 3;
  } catch {
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { repo_url } = await request.json();

    if (!repo_url) {
      return NextResponse.json(
        { success: false, error: "Repository URL is required." },
        { status: 400 }
      );
    }

    if (!isValidGitHubUrl(repo_url)) {
      return NextResponse.json(
        { success: false, error: "Invalid GitHub repository URL." },
        { status: 400 }
      );
    }

    console.log(`[AI-REPO] Forwarding request for: ${repo_url}`);

    const pythonResponse = await fetch(PYTHON_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_url }),
    });

    const data = await pythonResponse.json();

    if (!pythonResponse.ok) {
      console.error("[AI-REPO] Python API error:", data);
      return NextResponse.json(
        { success: false, error: data.error || "Python API returned an error." },
        { status: pythonResponse.status }
      );
    }

    if (!data.result) {
      return NextResponse.json(
        { success: false, error: "Python API returned no result." },
        { status: 500 }
      );
    }

    // Return result in a consistent structure
    return NextResponse.json({
      success: true,
      result: {
        repositoryName: data.result.repositoryName || repo_url.split("/").pop(),
        summary: data.result.summary || "No summary provided",
        score: data.result.score || 0,
        healthBreakdown: data.result.healthBreakdown || [],
        codeQualityScore: data.result.codeQualityScore || 0,
        qualityBreakdown: data.result.qualityBreakdown || [],
        potentialBugs: data.result.potentialBugs || [],
        dependencyHealth: data.result.dependencyHealth || "Stable",
        lastCommitDate: data.result.lastCommitDate || new Date().toISOString(),
        license: data.result.license || "Unknown",
        keyFeatures: data.result.keyFeatures || [],
        contributionGuide: data.result.contributionGuide || { difficulty: "Medium", goodFirstIssuesLink: "#" },
        techStack: data.result.techStack || [],
      },
    });
  } catch (error: any) {
    console.error("[AI-REPO] Proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error or Python API offline." },
      { status: 500 }
    );
  }
}
