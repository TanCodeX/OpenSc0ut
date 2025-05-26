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
      query += `location:${params.location} `;
    }

    // Language filter
    if (params.language) {
      query += `language:${params.language} `;
    }

    // Label filter (good first issue, help wanted)
    if (params.label) {
      query += `${params.label} `;
    }

    // Ensure we have some content in the query
    // If no filters are provided, search for repositories with more than 0 stars
    if (!query.trim()) {
      query = "stars:>0";
    }

    const response = await axiosInstance.get("/search/repositories", {
      params: {
        q: query.trim(),
        sort: params.sort || "stars",
        order: params.order || "desc",
        per_page: 10,
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
