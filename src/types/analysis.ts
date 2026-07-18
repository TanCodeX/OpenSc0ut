export interface StartHereIssue {
  title: string;
  url: string;
  number: number;
  labels: string[];
  created_at: string;
}

/** CI / check status of the default branch HEAD */
export type BuildStatus = "passing" | "failing" | "pending" | "unknown" | "no_ci";

export interface BugIssue {
  title: string;
  url: string;
  number: number;
  labels: string[];
  created_at: string;
}

export interface FailingCheck {
  name: string;
  conclusion: string;
  url: string | null;
}

export interface CodeHealthSignals {
  /** Aggregated build status for the default branch tip */
  buildStatus: BuildStatus;
  /** Human-readable explanation of how status was derived */
  buildStatusDescription: string;
  latestCommitSha: string | null;
  latestCommitMessage: string | null;
  latestCommitUrl: string | null;
  latestWorkflowName: string | null;
  latestWorkflowConclusion: string | null;
  latestWorkflowUrl: string | null;
  failingChecks: FailingCheck[];
  /** Total number of failing checks (may exceed failingChecks.length which is capped for display) */
  failingCheckCount: number;
  totalCheckCount: number;
  openBugCount: number;
  criticalBugCount: number;
  recentBugIssues: BugIssue[];
}

export interface RepoSignals {
  owner: string;
  repo: string;
  stars: number;
  forks: number;
  openIssues: number;
  openPRs: number;
  closedPRs: number;
  hasContributing: boolean;
  hasCodeOfConduct: boolean;
  license: string | null;
  defaultBranch: string;
  commitActivityScore: number; // 0-100 based on recent commits
  averagePRMergeTimeDays: number | null;
  goodFirstIssueCount: number;
  startHereIssues: StartHereIssue[];
  languages: string[];
  contributorsCount: number;
  /** Whether main/default branch looks broken + open bugs */
  codeHealth: CodeHealthSignals;
}

export interface AICategoryScore {
  score: number; // 0-100
  label: "Excellent" | "Good" | "Fair" | "Needs Improvement";
}

export interface CodeHealthAssessment {
  /** Overall verdict for contributors */
  status: "healthy" | "at_risk" | "broken" | "unknown";
  riskLevel: "low" | "medium" | "high";
  /** 1-2 sentence plain-English summary of build + bugs */
  summary: string;
  /** Concrete things a contributor should know before diving in */
  warnings: string[];
}

export interface AIAnalysisResult {
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  overallScore: number; // 0-100
  narrative: string;
  contradictions: string | null;
  categories: {
    activity: AICategoryScore;
    friendliness: AICategoryScore;
    health: AICategoryScore;
    governance: AICategoryScore;
  };
  startHere: StartHereIssue[];
  /** AI-synthesized view of whether the main codebase is broken / bugged */
  codeHealth: CodeHealthAssessment;
}
