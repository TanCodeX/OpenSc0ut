import axios from "axios";
import { Repository, SearchParams } from "./types";

// Create axios instance for our internal API
const apiInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function searchRepositories(
  params: SearchParams
): Promise<{ items: Repository[]; total_count: number }> {
  try {
    const response = await apiInstance.get("/github/search", {
      params: {
        language: params.language,
        page: params.page || 1,
        sort: params.sort || "stars",
        order: params.order || "desc",
      },
    });

    if (response.status === 200 && response.data) {
      return {
        items: response.data.items,
        total_count: response.data.total_count,
      };
    } else {
      throw new Error("Invalid response from API");
    }
  } catch (error: any) {
    console.error(
      "Error fetching repositories:",
      error?.response?.data || error.message || error
    );
    
    // Handle API errors
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw error;
  }
}

export async function getRepository(
  owner: string,
  repo: string
): Promise<Repository | null> {
  try {
    // For now, we'll return null since we don't have a specific API route for this
    // You can create one later if needed: /api/github/repos/[owner]/[repo]/route.ts
    console.warn("getRepository function not implemented with API route yet");
    return null;
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
    // For now, we'll return empty array since we don't have a specific API route for this
    // You can create one later if needed: /api/github/repos/[owner]/[repo]/issues/route.ts
    console.warn("getRepositoryIssues function not implemented with API route yet");
    return [];
  } catch (error) {
    console.error("Error fetching repository issues:", error);
    return [];
  }
}
