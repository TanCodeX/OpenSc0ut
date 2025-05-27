import axios from "axios";
import { Repository, SearchParams } from "./types";

const GITHUB_API_URL = "https://api.github.com";

// You would typically store this in an environment variable
// For production, use a server-side approach to protect your token
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Accept: "application/vnd.github.v3+json",
    // Use the token in the Authorization header if available
    ...(GITHUB_TOKEN && {
      Authorization: GITHUB_TOKEN.startsWith("github_pat_")
        ? `Bearer ${GITHUB_TOKEN}`
        : `token ${GITHUB_TOKEN}`,
    }),
  },
});

// Function to check if we can make authenticated requests
async function checkGitHubAuth(): Promise<boolean> {
  if (!GITHUB_TOKEN) return false;

  try {
    const response = await axiosInstance.get("/rate_limit");
    console.log("Rate limit info:", response.data); // Debug rate limit info
    return response.status === 200;
  } catch (error: any) {
    console.error("Auth check failed:", error?.response?.data || error);
    return false;
  }
}

export async function searchRepositories(
  params: SearchParams
): Promise<{ items: Repository[]; total_count: number }> {
  try {
    // Verify authentication first
    const isAuthenticated = await checkGitHubAuth();
    if (!isAuthenticated) {
      console.warn(
        "GitHub authentication failed or no token provided. Using unauthenticated requests (60 requests/hour limit)."
      );
    } else {
      console.log("Successfully authenticated with GitHub");
    }

    // Build the query string starting with finding repositories
    let query = "is:public has:issues";

    // Language filter - handle multiple languages
    if (params.language) {
      const languages = params.language.split(",");
      query += ` (${languages
        .map((lang) => `language:${lang.trim()}`)
        .join(" OR ")})`;
    }

    // Add stars and forks filters to get popular repositories
    query += " stars:>50 forks:>5";

    console.log("Search Query:", query); // For debugging

    try {
      const response = await axiosInstance.get("/search/repositories", {
        params: {
          q: query.trim(),
          sort: "stars", // Always sort by stars first
          order: "desc", // Always descending for popularity
          per_page: 12,
          page: params.page || 1,
        },
      });

      if (response.status === 200 && response.data) {
        // Sort the results by a combination of stars and forks
        const items = response.data.items.map((repo: any) => ({
          ...repo,
          popularity_score:
            repo.stargazers_count * 0.7 + repo.forks_count * 0.3, // Weight stars more than forks
        }));

        items.sort((a: any, b: any) => b.popularity_score - a.popularity_score);

        return {
          items: items.map((item: any) => ({
            id: item.id,
            name: item.name,
            full_name: item.full_name,
            html_url: item.html_url,
            description: item.description,
            owner: item.owner,
            stargazers_count: item.stargazers_count,
            forks_count: item.forks_count,
            open_issues_count: item.open_issues_count,
            language: item.language,
            topics: item.topics || [],
            updated_at: item.updated_at,
            created_at: item.created_at,
            has_issues: item.has_issues,
          })),
          total_count: response.data.total_count,
        };
      } else {
        throw new Error("Invalid response from GitHub API");
      }
    } catch (apiError: any) {
      // Handle authentication errors
      if (apiError.response?.status === 401) {
        console.error("Authentication failed:", apiError.response.data);
        // Try to continue without authentication
        axiosInstance.defaults.headers.common["Authorization"] = "";
        return searchRepositories(params);
      }
      // Handle rate limiting
      if (apiError.response?.status === 403) {
        const resetTime = apiError.response.headers["x-ratelimit-reset"];
        const resetDate = resetTime
          ? new Date(Number(resetTime) * 1000).toLocaleString()
          : "unknown time";
        const rateLimit = apiError.response.headers["x-ratelimit-limit"];
        const remaining = apiError.response.headers["x-ratelimit-remaining"];
        throw new Error(
          `GitHub API rate limit exceeded (${remaining}/${rateLimit} requests remaining). Resets at ${resetDate}.`
        );
      }
      // Handle bad queries
      if (apiError.response?.status === 422) {
        // If the query is too restrictive, try with lower thresholds
        if (query.includes("stars:>50")) {
          query = query.replace(" stars:>50 forks:>5", " stars:>10");
          return searchRepositories({
            ...params,
            page: 1,
          });
        }
        console.error("Search query:", query);
        throw new Error(
          "Invalid search query. Please try different search criteria."
        );
      }
      // Handle other API errors
      throw new Error(
        apiError.response?.data?.message ||
          "Failed to fetch repositories. Please try again."
      );
    }
  } catch (error: any) {
    console.error(
      "Error fetching repositories:",
      error?.response?.data || error.message || error
    );
    throw error;
  }
}

export async function getRepository(
  owner: string,
  repo: string
): Promise<Repository | null> {
  try {
    const response = await axiosInstance.get(`/repos/${owner}/${repo}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching repository details:", error);
    return null;
  }
}

export async function getRepositoryIssues(
  owner: string,
  repo: string,
  labels?: string
) {
  try {
    const response = await axiosInstance.get(`/repos/${owner}/${repo}/issues`, {
      params: {
        labels,
        state: "open",
        sort: "created",
        direction: "desc",
        per_page: 5,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching repository issues:", error);
    return [];
  }
}
