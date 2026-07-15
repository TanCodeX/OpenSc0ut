import { GoogleGenerativeAI } from '@google/generative-ai';
import { RepoSignals, AIAnalysisResult, StartHereIssue } from '../types/analysis';

const GITHUB_API_URL = 'https://api.github.com';

async function fetchGitHub(endpoint: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} on ${endpoint}`);
  }

  return response.json();
}

async function fetchGitHubResponse(endpoint: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} on ${endpoint}`);
  }

  return response;
}

export async function fetchRepoSignals(owner: string, repo: string): Promise<RepoSignals> {
  const repoPath = `/repos/${owner}/${repo}`;
  
  // 1. Core Repo Data
  const repoData = await fetchGitHub(repoPath);
  
  // 1.5 Get True Open Issues (excluding PRs)
  let trueOpenIssues = repoData.open_issues_count || 0;
  try {
    const issuesData = await fetchGitHub(`/search/issues?q=repo:${owner}/${repo}+type:issue+state:open&per_page=1`);
    if (issuesData && issuesData.total_count !== undefined) {
      trueOpenIssues = issuesData.total_count;
    }
  } catch (e) {
    console.warn("Failed to fetch true open issues count", e);
  }
  
  // 2. Check for CONTRIBUTING.md
  let hasContributing = false;
  try {
    await fetchGitHub(`${repoPath}/contents/CONTRIBUTING.md`);
    hasContributing = true;
  } catch (e) {
    // Ignore, just means it doesn't exist
  }

  // 3. Check for Code of Conduct
  let hasCodeOfConduct = false;
  try {
    await fetchGitHub(`${repoPath}/contents/CODE_OF_CONDUCT.md`);
    hasCodeOfConduct = true;
  } catch (e) {
    try {
      // Sometimes it's lowercase or just code_of_conduct
      await fetchGitHub(`${repoPath}/community/code_of_conduct`);
      hasCodeOfConduct = true;
    } catch(err) {}
  }

  // 4. Good First Issues (Start Here)
  let goodFirstIssueCount = 0;
  let startHereIssues: StartHereIssue[] = [];
  try {
    // Search API is rate limited, but we need it for this
    const issuesData = await fetchGitHub(`/search/issues?q=repo:${owner}/${repo}+label:"good first issue"+state:open&sort=created&order=desc&per_page=3`);
    goodFirstIssueCount = issuesData.total_count || 0;
    
    startHereIssues = (issuesData.items || []).map((item: any) => ({
      title: item.title,
      url: item.html_url,
      number: item.number,
      labels: item.labels.map((l: any) => l.name),
      created_at: item.created_at
    }));
  } catch (e) {
    console.warn("Failed to fetch good first issues", e);
  }

  // 5. Recent Commits for Activity Score
  let commitActivityScore = 50; // Default
  try {
    const commits = await fetchGitHub(`${repoPath}/commits?per_page=30`);
    if (commits && commits.length > 0) {
      const lastCommitDate = new Date(commits[0].commit.committer.date);
      const daysSinceLastCommit = (Date.now() - lastCommitDate.getTime()) / (1000 * 3600 * 24);
      
      if (daysSinceLastCommit < 7) commitActivityScore = 95;
      else if (daysSinceLastCommit < 30) commitActivityScore = 80;
      else if (daysSinceLastCommit < 90) commitActivityScore = 50;
      else commitActivityScore = 20;
    } else {
      commitActivityScore = 10;
    }
  } catch (e) {
    console.warn("Failed to fetch commits", e);
  }

  // 6. Languages (Required Skills)
  let languages: string[] = [];
  try {
    const langData = await fetchGitHub(`${repoPath}/languages`);
    languages = Object.keys(langData);
  } catch (e) {
    console.warn("Failed to fetch languages", e);
  }

  // 7. Contributors Count
  let contributorsCount = 0;
  try {
    const res = await fetchGitHubResponse(`${repoPath}/contributors?per_page=1&anon=1`);
    const linkHeader = res.headers.get('link');
    if (linkHeader) {
      const match = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (match) {
        contributorsCount = parseInt(match[1], 10);
      } else {
        contributorsCount = 1; // Only 1 page but link header exists? Rare, but possible
      }
    } else {
      // If no link header, then all contributors fit on 1 page (so 1 or 0)
      const data = await res.json();
      contributorsCount = data.length || 0;
    }
  } catch (e) {
    console.warn("Failed to fetch contributors count", e);
  }

  return {
    owner,
    repo,
    stars: repoData.stargazers_count || 0,
    forks: repoData.forks_count || 0,
    openIssues: trueOpenIssues,
    openPRs: 0, // Hard to get exactly without multiple queries, ignoring for now
    closedPRs: 0, // Ignoring for now
    hasContributing,
    hasCodeOfConduct,
    license: repoData.license?.name || null,
    defaultBranch: repoData.default_branch || 'main',
    commitActivityScore,
    averagePRMergeTimeDays: null, // Hard to calculate quickly without massive queries
    goodFirstIssueCount,
    startHereIssues,
    languages,
    contributorsCount,
  };
}

export async function generateAIAnalysis(signals: RepoSignals): Promise<AIAnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
You are an expert open-source maintainer and advisor helping a potential contributor decide if they should invest time contributing to a specific repository.
We have extracted structured signals about this repository. You need to synthesize this into a "Contribution Readiness" scorecard.

Repository: ${signals.owner}/${signals.repo}
Structured Signals:
- Stars: ${signals.stars}
- Forks: ${signals.forks}
- Open Issues: ${signals.openIssues}
- Has CONTRIBUTING.md: ${signals.hasContributing}
- Has Code of Conduct: ${signals.hasCodeOfConduct}
- License: ${signals.license || "None / Unknown"}
- Commit Activity Score (0-100, 100 is very active): ${signals.commitActivityScore}
- Good First Issues open: ${signals.goodFirstIssueCount}

Task:
1. Provide an overall grade (A+, A, B, C, D, or F).
2. Provide an overall score (0-100).
3. Write a plain-English narrative (2-3 sentences) evaluating the health, activity, and beginner-friendliness of the repo.
4. If there are contradictions (e.g. 5000 stars but low commit activity, or lots of issues but no good-first-issues), point them out in a sentence. Otherwise, set contradictions to null.
5. Score the 4 categories (Activity, Friendliness, Health, Governance) out of 100, and assign a label ("Excellent", "Good", "Fair", or "Needs Improvement").

IMPORTANT: Return ONLY valid JSON matching this schema:
{
  "grade": "A+",
  "overallScore": 95,
  "narrative": "...",
  "contradictions": "..." | null,
  "categories": {
    "activity": { "score": 90, "label": "Excellent" },
    "friendliness": { "score": 85, "label": "Good" },
    "health": { "score": 90, "label": "Excellent" },
    "governance": { "score": 100, "label": "Excellent" }
  }
}
Do not include markdown blocks like \`\`\`json. Just the raw JSON object.
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();
  
  if (text.startsWith('\`\`\`json')) {
    text = text.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
  } else if (text.startsWith('\`\`\`')) {
    text = text.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse AI output:", text);
    throw new Error("Failed to parse AI response into valid JSON");
  }

  // Merge the startHereIssues into the final result
  return {
    ...parsed,
    startHere: signals.startHereIssues
  };
}
