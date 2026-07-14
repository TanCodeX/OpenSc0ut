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

  // We keep the popularity_score but don't force a sort on it unless explicitly asked or by default
  // if custom sorting isn't applied (wait, we are passing sort and order to github so github will sort them, but we override it here!)
  // Instead of sorting here, we will just return items since github already sorted them based on params.
  // Although, if sort === 'popularity' we could sort it here, but github doesn't support 'popularity' natively.
  // Let's remove the hardcoded popularity sort so github's sorting works.

const formatResponse = (response: any) => {
  const formattedItems = response.data.items.map((item: any) => ({
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
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const location = searchParams.get('location');
    const labels = searchParams.get('labels');
    const page = searchParams.get('page') || '1';
    // The sort and order params are not used in the GitHub query, but we leave them
    const sort = searchParams.get('sort') || 'stars';
    const order = searchParams.get('order') || 'desc';

    // Build the query string
    let query = "is:public has:issues";
    if (language) {
      const languages = language.split(",");
      query += ` (${languages
        .map((lang) => `language:${lang.trim()}`)
        .join(" OR ")})`;
    }

    if (location) {
      const locations = location.split(",");
      query += ` (${locations
        .map((loc) => `location:"${loc.trim()}"`)
        .join(" OR ")})`;
    }

    if (labels) {
      const labelArray = labels.split(",");
      labelArray.forEach((label) => {
        const trimmed = label.trim().toLowerCase();
        if (trimmed === "good first issue" || trimmed === "good-first-issues") {
          query += " good-first-issues:>0";
        } else if (trimmed === "help wanted" || trimmed === "help-wanted-issues") {
          query += " help-wanted-issues:>0";
        } else {
          const topic = trimmed.replace(/\s+/g, "-");
          query += ` topic:${topic}`;
        }
      });
    }
    
    query += " stars:>50 forks:>5";

    console.log("Search Query:", query); // For debugging

    const githubParams = {
      q: query.trim(),
      sort: sort, 
      order: order, 
      per_page: 12,
      page: parseInt(page),
    };

    try {
      const response = await axiosInstance.get("/search/repositories", {
        params: githubParams,
      });
      return formatResponse(response);

    } catch (apiError: any) {
      
      // --- START: MODIFIED 401 ERROR HANDLING ---
      // Handle authentication errors
      if (apiError.response?.status === 401) {
        console.error("Authentication failed. Retrying without token.");
        
        // Remove the bad token from the instance
        delete axiosInstance.defaults.headers.common["Authorization"];

        // Re-try the request *once* without auth
        try {
          const retryResponse = await axiosInstance.get("/search/repositories", {
            params: githubParams,
          });
          return formatResponse(retryResponse);
        } catch (retryError: any) {
          // If the *retry* fails, re-assign apiError to be handled by the code below
          console.error("Unauthenticated retry failed:", retryError.message);
          apiError = retryError; // Let the generic handlers below take over
        }
      }
      // --- END: MODIFIED 401 ERROR HANDLING ---

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