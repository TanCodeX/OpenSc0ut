import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  RepoSignals,
  AIAnalysisResult,
  StartHereIssue,
  CodeHealthSignals,
  BugIssue,
  BuildStatus,
  FailingCheck,
} from '../types/analysis';

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

/**
 * Soft-fetch helper that returns null on failure instead of throwing.
 * Used for optional enrichment endpoints so one failure doesn't kill the scan.
 */
async function tryFetchGitHub(endpoint: string, options: RequestInit = {}): Promise<any | null> {
  try {
    return await fetchGitHub(endpoint, options);
  } catch {
    return null;
  }
}

/**
 * Detects whether the default branch tip is green/red and gathers open bug issues.
 * Uses check-runs, combined commit status, and recent Actions workflow runs.
 */
export async function fetchCodeHealth(
  owner: string,
  repo: string,
  defaultBranch: string
): Promise<CodeHealthSignals> {
  const repoPath = `/repos/${owner}/${repo}`;
  const empty: CodeHealthSignals = {
    buildStatus: 'unknown',
    buildStatusDescription: 'Could not determine build status.',
    latestCommitSha: null,
    latestCommitMessage: null,
    latestCommitUrl: null,
    latestWorkflowName: null,
    latestWorkflowConclusion: null,
    latestWorkflowUrl: null,
    failingChecks: [],
    failingCheckCount: 0,
    totalCheckCount: 0,
    openBugCount: 0,
    criticalBugCount: 0,
    recentBugIssues: [],
  };

  // ── 1. Latest commit on default branch ──────────────────────────────────
  let latestCommitSha: string | null = null;
  let latestCommitMessage: string | null = null;
  let latestCommitUrl: string | null = null;

  const commitData = await tryFetchGitHub(`${repoPath}/commits/${encodeURIComponent(defaultBranch)}`);
  if (commitData?.sha) {
    latestCommitSha = commitData.sha;
    latestCommitMessage = commitData.commit?.message?.split('\n')[0] || null;
    latestCommitUrl = commitData.html_url || null;
  }

  // ── 2. Check runs on that commit ────────────────────────────────────────
  let failingChecks: FailingCheck[] = [];
  let failingCheckCount = 0;
  let totalCheckCount = 0;
  let checkRunStatus: BuildStatus | null = null;

  if (latestCommitSha) {
    // Prefer the Checks API (Actions, third-party CI)
    const checksData = await tryFetchGitHub(
      `${repoPath}/commits/${latestCommitSha}/check-runs?per_page=50`
    );

    if (checksData && Array.isArray(checksData.check_runs)) {
      const runs = checksData.check_runs as any[];
      totalCheckCount = checksData.total_count ?? runs.length;

      const completed = runs.filter((r) => r.status === 'completed');
      const inProgress = runs.filter((r) => r.status !== 'completed');
      const failed = completed.filter((r) =>
        ['failure', 'timed_out', 'cancelled', 'action_required', 'startup_failure'].includes(
          r.conclusion
        )
      );

      failingCheckCount = failed.length;
      failingChecks = failed.slice(0, 8).map((r) => ({
        name: r.name || r.app?.name || 'Check',
        conclusion: r.conclusion || 'failure',
        url: r.html_url || r.details_url || null,
      }));

      if (totalCheckCount === 0) {
        checkRunStatus = null; // fall through to other signals
      } else if (failed.length > 0) {
        checkRunStatus = 'failing';
      } else if (inProgress.length > 0) {
        checkRunStatus = 'pending';
      } else {
        checkRunStatus = 'passing';
      }
    }

    // Fallback: combined commit status (legacy CI integrations)
    if (checkRunStatus === null) {
      const statusData = await tryFetchGitHub(`${repoPath}/commits/${latestCommitSha}/status`);
      if (statusData && statusData.total_count > 0) {
        totalCheckCount = Math.max(totalCheckCount, statusData.total_count);
        const state = statusData.state as string;
        if (state === 'failure' || state === 'error') {
          checkRunStatus = 'failing';
          const badStatuses = (statusData.statuses || []).filter(
            (s: any) => s.state === 'failure' || s.state === 'error'
          );
          failingCheckCount = Math.max(failingCheckCount, badStatuses.length);
          failingChecks = [
            ...failingChecks,
            ...badStatuses.slice(0, 5).map((s: any) => ({
              name: s.context || 'Status check',
              conclusion: s.state,
              url: s.target_url || null,
            })),
          ];
        } else if (state === 'pending') {
          checkRunStatus = 'pending';
        } else if (state === 'success') {
          checkRunStatus = 'passing';
        }
      }
    }
  }

  // ── 3. Latest Actions workflow run on default branch ────────────────────
  let latestWorkflowName: string | null = null;
  let latestWorkflowConclusion: string | null = null;
  let latestWorkflowUrl: string | null = null;
  let workflowStatus: BuildStatus | null = null;

  const runsData = await tryFetchGitHub(
    `${repoPath}/actions/runs?branch=${encodeURIComponent(defaultBranch)}&per_page=5&exclude_pull_requests=true`
  );

  if (runsData?.workflow_runs?.length) {
    // Prefer the most recent completed run; otherwise take the newest
    const completedRun =
      runsData.workflow_runs.find((r: any) => r.status === 'completed') ||
      runsData.workflow_runs[0];

    latestWorkflowName = completedRun.name || completedRun.display_title || null;
    latestWorkflowConclusion = completedRun.conclusion || completedRun.status || null;
    latestWorkflowUrl = completedRun.html_url || null;

    if (completedRun.status !== 'completed') {
      workflowStatus = 'pending';
    } else if (
      ['failure', 'timed_out', 'cancelled', 'startup_failure'].includes(completedRun.conclusion)
    ) {
      workflowStatus = 'failing';
    } else if (completedRun.conclusion === 'success') {
      workflowStatus = 'passing';
    } else if (completedRun.conclusion === 'skipped' || completedRun.conclusion === 'neutral') {
      // Not a real pass/fail signal
      workflowStatus = null;
    }
  }

  // ── 4. Aggregate build status ───────────────────────────────────────────
  let buildStatus: BuildStatus;
  let buildStatusDescription: string;

  // Prefer check-runs (most accurate for HEAD); fall back to workflow runs
  const primary = checkRunStatus ?? workflowStatus;

  if (primary === 'failing') {
    buildStatus = 'failing';
    const parts: string[] = [];
    if (failingChecks.length > 0) {
      parts.push(
        `${failingChecks.length} check${failingChecks.length === 1 ? '' : 's'} failing on \`${defaultBranch}\``
      );
    }
    if (latestWorkflowConclusion && ['failure', 'timed_out', 'cancelled'].includes(latestWorkflowConclusion)) {
      parts.push(
        `latest workflow "${latestWorkflowName || 'CI'}" concluded: ${latestWorkflowConclusion}`
      );
    }
    buildStatusDescription =
      parts.join('; ') || `Build checks are failing on the \`${defaultBranch}\` branch.`;
  } else if (primary === 'pending') {
    buildStatus = 'pending';
    buildStatusDescription = `CI checks are still running on \`${defaultBranch}\`.`;
  } else if (primary === 'passing') {
    buildStatus = 'passing';
    buildStatusDescription =
      totalCheckCount > 0
        ? `All ${totalCheckCount} check${totalCheckCount === 1 ? '' : 's'} are green on \`${defaultBranch}\`.`
        : `Latest CI workflow on \`${defaultBranch}\` passed.`;
  } else if (!latestCommitSha) {
    buildStatus = 'unknown';
    buildStatusDescription = 'Could not read the default branch tip.';
  } else {
    buildStatus = 'no_ci';
    buildStatusDescription = `No CI checks or Actions runs found on \`${defaultBranch}\`.`;
  }

  // ── 5. Open bug-labeled issues ──────────────────────────────────────────
  let openBugCount = 0;
  let recentBugIssues: BugIssue[] = [];

  // GitHub search: OR across common bug label names
  const bugQuery =
    `repo:${owner}/${repo} is:issue is:open ` +
    `(label:bug OR label:bugfix OR label:"type:bug" OR label:"type: bug" ` +
    `OR label:defect OR label:crash OR label:regression OR label:"kind/bug")`;

  const bugSearch = await tryFetchGitHub(
    `/search/issues?q=${encodeURIComponent(bugQuery)}&sort=updated&order=desc&per_page=5`
  );

  if (bugSearch) {
    openBugCount = bugSearch.total_count || 0;
    recentBugIssues = mapBugIssues(bugSearch.items || []);
  } else {
    // Fallback: single common label if the OR query fails
    const simple = await tryFetchGitHub(
      `/search/issues?q=${encodeURIComponent(`repo:${owner}/${repo} is:issue is:open label:bug`)}&sort=updated&order=desc&per_page=5`
    );
    if (simple) {
      openBugCount = simple.total_count || 0;
      recentBugIssues = mapBugIssues(simple.items || []);
    }
  }

  // ── 6. Critical / high-severity open issues (subset signal) ─────────────
  let criticalBugCount = 0;
  const criticalQuery = `repo:${owner}/${repo} is:issue is:open (label:critical OR label:severity:critical OR label:"priority: high" OR label:P0 OR label:P1 OR label:blocker OR label:urgent)`;
  const criticalSearch = await tryFetchGitHub(
    `/search/issues?q=${encodeURIComponent(criticalQuery)}&per_page=1`
  );
  if (criticalSearch) {
    criticalBugCount = criticalSearch.total_count || 0;
  }

  return {
    buildStatus,
    buildStatusDescription,
    latestCommitSha: latestCommitSha ? latestCommitSha.slice(0, 7) : null,
    latestCommitMessage,
    latestCommitUrl,
    latestWorkflowName,
    latestWorkflowConclusion,
    latestWorkflowUrl,
    failingChecks,
    failingCheckCount,
    totalCheckCount,
    openBugCount,
    criticalBugCount,
    recentBugIssues,
  };
}

function mapBugIssues(items: any[]): BugIssue[] {
  return items.map((item: any) => ({
    title: item.title,
    url: item.html_url,
    number: item.number,
    labels: (item.labels || []).map((l: any) => (typeof l === 'string' ? l : l.name)),
    created_at: item.created_at,
  }));
}

export async function fetchRepoSignals(owner: string, repo: string): Promise<RepoSignals> {
  const repoPath = `/repos/${owner}/${repo}`;
  
  // 1. Core Repo Data
  const repoData = await fetchGitHub(repoPath);
  const defaultBranch = repoData.default_branch || 'main';
  
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

  // 8. Code health — is main broken? open bugs?
  let codeHealth: CodeHealthSignals;
  try {
    codeHealth = await fetchCodeHealth(owner, repo, defaultBranch);
  } catch (e) {
    console.warn("Failed to fetch code health signals", e);
    codeHealth = {
      buildStatus: 'unknown',
      buildStatusDescription: 'Code health scan unavailable.',
      latestCommitSha: null,
      latestCommitMessage: null,
      latestCommitUrl: null,
      latestWorkflowName: null,
      latestWorkflowConclusion: null,
      latestWorkflowUrl: null,
      failingChecks: [],
      failingCheckCount: 0,
      totalCheckCount: 0,
      openBugCount: 0,
      criticalBugCount: 0,
      recentBugIssues: [],
    };
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
    defaultBranch,
    commitActivityScore,
    averagePRMergeTimeDays: null, // Hard to calculate quickly without massive queries
    goodFirstIssueCount,
    startHereIssues,
    languages,
    contributorsCount,
    codeHealth,
  };
}

export async function generateAIAnalysis(signals: RepoSignals): Promise<AIAnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const ch = signals.codeHealth;
  const failingCheckNames = ch.failingChecks.map((c) => c.name).slice(0, 5).join(', ') || 'none';
  const sampleBugs = ch.recentBugIssues
    .slice(0, 3)
    .map((b) => `#${b.number}: ${b.title}`)
    .join(' | ') || 'none listed';

  const prompt = `
You are an expert open-source maintainer and advisor helping a potential contributor decide if they should invest time contributing to a specific repository.
We have extracted structured signals about this repository. You need to synthesize this into a "Contribution Readiness" scorecard — including whether the main codebase looks broken and if there are active bugs.

Repository: ${signals.owner}/${signals.repo}
Default branch: ${signals.defaultBranch}

Structured Signals:
- Stars: ${signals.stars}
- Forks: ${signals.forks}
- Open Issues: ${signals.openIssues}
- Has CONTRIBUTING.md: ${signals.hasContributing}
- Has Code of Conduct: ${signals.hasCodeOfConduct}
- License: ${signals.license || "None / Unknown"}
- Commit Activity Score (0-100, 100 is very active): ${signals.commitActivityScore}
- Good First Issues open: ${signals.goodFirstIssueCount}

Code Health / Breakage Signals:
- Build status on default branch: ${ch.buildStatus}
- Build status detail: ${ch.buildStatusDescription}
- Latest commit: ${ch.latestCommitSha || "unknown"} — ${ch.latestCommitMessage || "n/a"}
- Latest workflow: ${ch.latestWorkflowName || "n/a"} → ${ch.latestWorkflowConclusion || "n/a"}
- Failing checks: ${failingCheckNames}
- Open bug-labeled issues: ${ch.openBugCount}
- Critical/high-priority open issues: ${ch.criticalBugCount}
- Sample recent bugs: ${sampleBugs}

Task:
1. Provide an overall grade (A+, A, B, C, D, or F).
2. Provide an overall score (0-100). Factor code health in: a failing main branch or many critical bugs should pull Health (and overall) down.
3. Write a plain-English narrative (2-3 sentences) evaluating the health, activity, and beginner-friendliness of the repo.
4. If there are contradictions (e.g. 5000 stars but low commit activity, or lots of issues but no good-first-issues, or high stars but failing CI), point them out in a sentence. Otherwise, set contradictions to null.
5. Score the 4 categories (Activity, Friendliness, Health, Governance) out of 100, and assign a label ("Excellent", "Good", "Fair", or "Needs Improvement").
6. Provide a codeHealth assessment:
   - status: "healthy" if main looks fine and bugs are manageable; "at_risk" if many bugs or flaky CI; "broken" if default branch checks are failing; "unknown" if we lack CI data and little bug signal.
   - riskLevel: "low" | "medium" | "high"
   - summary: 1-2 sentences a contributor can trust about whether the main codebase is broken and what bug load looks like.
   - warnings: 0-4 short bullet strings (e.g. "CI is red on main", "12 open bug issues"). Empty array if nothing concerning.

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
  },
  "codeHealth": {
    "status": "healthy",
    "riskLevel": "low",
    "summary": "...",
    "warnings": []
  }
}
Do not include markdown blocks like \`\`\`json. Just the raw JSON object.
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();
  
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse AI output:", text);
    throw new Error("Failed to parse AI response into valid JSON");
  }

  // Deterministic fallback if the model omits codeHealth
  const fallbackCodeHealth = buildFallbackCodeHealth(signals);

  // Merge the startHereIssues into the final result
  return {
    ...parsed,
    startHere: signals.startHereIssues,
    codeHealth: {
      status: parsed.codeHealth?.status || fallbackCodeHealth.status,
      riskLevel: parsed.codeHealth?.riskLevel || fallbackCodeHealth.riskLevel,
      summary: parsed.codeHealth?.summary || fallbackCodeHealth.summary,
      warnings: Array.isArray(parsed.codeHealth?.warnings)
        ? parsed.codeHealth.warnings
        : fallbackCodeHealth.warnings,
    },
  };
}

/** Rule-based code health assessment used when AI omits the field */
function buildFallbackCodeHealth(signals: RepoSignals): AIAnalysisResult['codeHealth'] {
  const ch = signals.codeHealth;
  const warnings: string[] = [];

  if (ch.buildStatus === 'failing') {
    warnings.push(`Default branch (\`${signals.defaultBranch}\`) has failing CI checks.`);
  }
  if (ch.openBugCount > 0) {
    warnings.push(`${ch.openBugCount} open bug-labeled issue${ch.openBugCount === 1 ? '' : 's'}.`);
  }
  if (ch.criticalBugCount > 0) {
    warnings.push(`${ch.criticalBugCount} critical/high-priority open issue${ch.criticalBugCount === 1 ? '' : 's'}.`);
  }
  if (ch.failingChecks.length > 0) {
    warnings.push(
      `Failing: ${ch.failingChecks
        .slice(0, 3)
        .map((c) => c.name)
        .join(', ')}.`
    );
  }

  let status: AIAnalysisResult['codeHealth']['status'] = 'unknown';
  let riskLevel: AIAnalysisResult['codeHealth']['riskLevel'] = 'low';

  if (ch.buildStatus === 'failing') {
    status = 'broken';
    riskLevel = 'high';
  } else if (ch.buildStatus === 'passing' && ch.openBugCount === 0 && ch.criticalBugCount === 0) {
    status = 'healthy';
    riskLevel = 'low';
  } else if (
    ch.openBugCount >= 10 ||
    ch.criticalBugCount >= 3 ||
    (ch.buildStatus === 'passing' && ch.openBugCount >= 5)
  ) {
    status = 'at_risk';
    riskLevel = ch.criticalBugCount >= 3 ? 'high' : 'medium';
  } else if (ch.buildStatus === 'passing' || ch.buildStatus === 'no_ci') {
    status = ch.openBugCount > 0 ? 'at_risk' : ch.buildStatus === 'no_ci' ? 'unknown' : 'healthy';
    riskLevel = ch.openBugCount > 5 ? 'medium' : 'low';
  } else if (ch.buildStatus === 'pending') {
    status = 'unknown';
    riskLevel = 'low';
  }

  return {
    status,
    riskLevel,
    summary: ch.buildStatusDescription +
      (ch.openBugCount > 0
        ? ` There are ${ch.openBugCount} open bug-labeled issue${ch.openBugCount === 1 ? '' : 's'}.`
        : ' No open bug-labeled issues detected.'),
    warnings,
  };
}
