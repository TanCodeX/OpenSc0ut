import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get('repo');
  const gfi = searchParams.get('gfi');

  if (!repo) {
    return NextResponse.json({ error: 'Repo parameter is required' }, { status: 400 });
  }

  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const fetchOptions: RequestInit = {
    headers,
    next: { revalidate: 3600 }, // Cache for 1 hour
  };

  // --- GFI Mode ---
  if (gfi === '1') {
    try {
      const gfiRes = await fetch(
        `https://api.github.com/search/issues?q=repo:${repo}+label:"good first issue"+state:open&per_page=5`,
        fetchOptions
      );

      if (!gfiRes.ok) {
        throw new Error('Failed to fetch GFI');
      }

      const data = await gfiRes.json();
      return NextResponse.json({
        total_count: data.total_count || 0,
        issues: (data.items || []).map((issue: any) => ({
          title: issue.title,
          url: issue.html_url,
          created_at: issue.created_at,
        })),
      });
    } catch (error) {
      console.error('Error fetching GFI for', repo, error);
      return NextResponse.json({ total_count: 0, issues: [] });
    }
  }

  // --- Default Mode ---
  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repo}`, fetchOptions),
      fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, fetchOptions),
    ]);

    if (!repoRes.ok) {
      throw new Error(`Repo fetch failed with status ${repoRes.status}`);
    }

    const repoData = await repoRes.json();
    
    let activity = 'unknown';
    
    if (commitsRes.ok) {
      const commitsData = await commitsRes.json();
      if (commitsData && commitsData.length > 0) {
        const lastCommitDate = new Date(commitsData[0].commit.committer.date);
        const daysSinceLastCommit = (Date.now() - lastCommitDate.getTime()) / (1000 * 3600 * 24);
        
        if (daysSinceLastCommit < 14) {
          activity = 'active';
        } else if (daysSinceLastCommit < 60) {
          activity = 'moderate';
        } else {
          activity = 'low';
        }
      }
    }

    return NextResponse.json({
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      issues: repoData.open_issues_count || 0,
      activity,
    });
  } catch (error) {
    console.error('Error fetching stats for', repo, error);
    // Return fallback values on error
    return NextResponse.json({
      stars: 0,
      forks: 0,
      issues: 0,
      activity: 'unknown',
    });
  }
}
