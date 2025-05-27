import axios from "axios";
import { Repository, SearchParams } from "./types";

const GITHUB_API_URL = "https://api.github.com";

// You would typically store this in an environment variable
// For production, use a server-side approach to protect your token
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";

const axiosInstance = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Accept: "application/vnd.github.v3+json",
    ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
  },
});

export async function searchRepositories(
  params: SearchParams
): Promise<{ items: Repository[]; total_count: number }> {
  try {
    // Build the query string
    let query = "";

    // Location filter
    if (params.location) {
      query += `location:${params.location.replace(/\s+/g, "")} `;
    }

    // Language filter - handle multiple languages
    if (params.language) {
      const languages = params.language.split(",");
      query +=
        languages.map((lang) => `language:${lang.trim()}`).join(" OR ") + " ";
    }

    // Label filter - handle multiple labels with proper GitHub search syntax
    if (params.label) {
      const labels = params.label.split(",");
      query += labels.map((label) => `label:"${label.trim()}"`).join(" ") + " ";
    }

    // Ensure we have some content in the query
    if (!query.trim()) {
      query = "stars:>0";
    }

    // Add a minimum stars filter to get more relevant results
    if (!query.includes("stars:")) {
      query += " stars:>0";
    }

    console.log("Search Query:", query); // For debugging

    const response = await axiosInstance.get("/search/repositories", {
      params: {
        q: query.trim(),
        sort: params.sort || "stars",
        order: params.order || "desc",
        per_page: 12,
        page: params.page || 1,
      },
    });

    return {
      items: response.data.items,
      total_count: response.data.total_count,
    };
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return { items: [], total_count: 0 };
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
