export interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
  };
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  has_issues: boolean;
}

export interface SearchParams {
  location?: string;
  language?: string;
  label?: string;
  sort: string;
  order: "asc" | "desc";
  page: number;
}

export type SortOption = "stars" | "forks" | "updated" | "created";
export type OrderOption = "asc" | "desc";
