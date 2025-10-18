import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const GITHUB_API_URL = "https://api.github.com";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Accept: "application/vnd.github.v3+json",
    // Use the token in the Authorization header if available
    ...(process.env.GITHUB_TOKEN && {
      Authorization: process.env.GITHUB_TOKEN.startsWith("github_pat_")
        ? `Bearer ${process.env.GITHUB_TOKEN}`
        : `token ${process.env.GITHUB_TOKEN}`,
    }),
  },
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const page = searchParams.get('page') || '1';
    const sort = searchParams.get('sort') || 'stars';
    const order = searchParams.get('order') || 'desc';

    // Build the query string starting with finding repositories
    let query = "is:public has:issues";

    // Language filter - handle multiple languages
    if (language) {
      const languages = language.split(",");
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
          page: parseInt(page),
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

        const formattedItems = items.map((item: any) => ({
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
        }));

        return NextResponse.json({
          items: formattedItems,
          total_count: response.data.total_count,
        });
      } else {
        throw new Error("Invalid response from GitHub API");
      }
    } catch (apiError: any) {
      // Handle authentication errors
      if (apiError.response?.status === 401) {
        console.error("Authentication failed:", apiError.response.data);
        // Try to continue without authentication
        axiosInstance.defaults.headers.common["Authorization"] = "";
        return GET(request); // Retry without auth
      }
      // Handle rate limiting
      if (apiError.response?.status === 403) {
        const resetTime = apiError.response.headers["x-ratelimit-reset"];
        const resetDate = resetTime
          ? new Date(Number(resetTime) * 1000).toLocaleString()
          : "unknown time";
        const rateLimit = apiError.response.headers["x-ratelimit-limit"];
        const remaining = apiError.response.headers["x-ratelimit-remaining"];
        return NextResponse.json(
          {
            error: `GitHub API rate limit exceeded (${remaining}/${rateLimit} requests remaining). Resets at ${resetDate}.`,
          },
          { status: 429 }
        );
      }
      // Handle bad queries
      if (apiError.response?.status === 422) {
        console.error("Search query:", query);
        return NextResponse.json(
          {
            error: "Invalid search query. Please try different search criteria.",
          },
          { status: 422 }
        );
      }
      // Handle other API errors
      return NextResponse.json(
        {
          error:
            apiError.response?.data?.message ||
            "Failed to fetch repositories. Please try again.",
        },
        { status: apiError.response?.status || 500 }
      );
    }
  } catch (error: any) {
    console.error(
      "Error fetching repositories:",
      error?.response?.data || error.message || error
    );
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
