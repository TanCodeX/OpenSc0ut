import { NextRequest, NextResponse } from 'next/server';
const GITHUB_API_URL = "https://api.github.com";

  // We keep the popularity_score but don't force a sort on it unless explicitly asked or by default
  // if custom sorting isn't applied (wait, we are passing sort and order to github so github will sort them, but we override it here!)
  // Instead of sorting here, we will just return items since github already sorted them based on params.
  // Although, if sort === 'popularity' we could sort it here, but github doesn't support 'popularity' natively.
  // Let's remove the hardcoded popularity sort so github's sorting works.

const getOpenPRCount = async (owner: string, repo: string, headers: Record<string, string>): Promise<number> => {
  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/pulls?state=open&per_page=1`;
  try {
    const res = await fetch(url, { headers, next: { revalidate: 3600 } });
    if (!res.ok) return 0;
    
    const linkHeader = res.headers.get('link');
    if (!linkHeader) {
      const data = await res.json();
      return Array.isArray(data) ? data.length : 0;
    }
    
    const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 0;
  } catch (e) {
    return 0;
  }
};

const formatResponse = async (data: any, headers: Record<string, string>) => {
  const formattedItems = await Promise.all(data.items.map(async (item: any) => {
    // GitHub's open_issues_count includes both issues and PRs.
    // Fetch the PR count to calculate true open issues.
    const prCount = await getOpenPRCount(item.owner.login, item.name, headers);
    const trueOpenIssuesCount = Math.max(0, item.open_issues_count - prCount);

    return {
      id: item.id,
      name: item.name,
      full_name: item.full_name,
      html_url: item.html_url,
      description: item.description,
      owner: item.owner,
      stargazers_count: item.stargazers_count,
      forks_count: item.forks_count,
      open_issues_count: trueOpenIssuesCount,
      language: item.language,
      topics: item.topics || [],
      updated_at: item.updated_at,
      created_at: item.created_at,
      has_issues: item.has_issues,
    };
  }));

  return NextResponse.json({
    items: formattedItems,
    total_count: data.total_count,
  });
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '12';
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
    
    query += " stars:>50 forks:>5";

    console.log("Search Query:", query); // For debugging

    const queryParams = new URLSearchParams({
      q: query.trim(),
      sort: sort,
      order: order,
      per_page: perPage,
      page: page.toString(),
    });

    const url = `${GITHUB_API_URL}/search/repositories?${queryParams.toString()}`;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = process.env.GITHUB_TOKEN.startsWith("github_pat_")
        ? `Bearer ${process.env.GITHUB_TOKEN}`
        : `token ${process.env.GITHUB_TOKEN}`;
    }

    try {
      let response = await fetch(url, {
        headers,
        next: { revalidate: 3600 }, // Cache successful responses for 1 hour
      });

      // Handle authentication errors by retrying without token
      if (response.status === 401) {
        console.error("Authentication failed. Retrying without token.");
        delete headers["Authorization"];
        response = await fetch(url, {
          headers,
          next: { revalidate: 3600 },
        });
      }

      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          const resetTime = response.headers.get("x-ratelimit-reset");
          const resetDate = resetTime
            ? new Date(Number(resetTime) * 1000).toLocaleString()
            : "unknown time";
          const rateLimit = response.headers.get("x-ratelimit-limit");
          const remaining = response.headers.get("x-ratelimit-remaining");
          return NextResponse.json(
            {
              error: `GitHub API rate limit exceeded (${remaining}/${rateLimit} requests remaining). Resets at ${resetDate}.`,
              resetTime: resetTime,
            },
            { status: 429 }
          );
        }

        if (response.status === 422) {
          return NextResponse.json(
            {
              error: "Invalid search query. Please try different search criteria.",
            },
            { status: 422 }
          );
        }

        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          {
            error: errorData.message || "Failed to fetch repositories. Please try again.",
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      return await formatResponse(data, headers);
    } catch (apiError: any) {
      console.error("API error:", apiError);
      return NextResponse.json(
        {
          error: "Failed to fetch repositories.",
        },
        { status: 500 }
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