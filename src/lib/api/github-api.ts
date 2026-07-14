import axios from "axios";
import { Repository, SearchParams } from "../../types/types";

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
        location: params.location,
        labels: params.labels,
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
      const apiError = new Error(error.response.data.error);
      if (error.response.data.resetTime) {
        (apiError as any).resetTime = error.response.data.resetTime;
      }
      throw apiError;
    }
    
    throw error;
  }
}
