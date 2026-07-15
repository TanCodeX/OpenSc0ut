export interface StartHereIssue {
  title: string;
  url: string;
  number: number;
  labels: string[];
  created_at: string;
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
}

export interface AICategoryScore {
  score: number; // 0-100
  label: "Excellent" | "Good" | "Fair" | "Needs Improvement";
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
}
