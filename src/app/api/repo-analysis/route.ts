import { NextRequest, NextResponse } from 'next/server';
import { fetchRepoSignals, generateAIAnalysis } from '../../../lib/analyzer';

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json();

    if (!repoUrl) {
      return NextResponse.json({ error: 'GitHub Repository URL or owner/repo is required' }, { status: 400 });
    }

    // Parse owner/repo from various formats:
    // https://github.com/facebook/react
    // github.com/facebook/react
    // facebook/react
    
    let owner = "";
    let repo = "";

    try {
      let cleanUrl = repoUrl.trim();
      // Remove trailing slash if present
      if (cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      
      if (cleanUrl.includes('github.com')) {
        const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
        const parts = urlObj.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
          owner = parts[0];
          repo = parts[1];
        }
      } else {
        const parts = cleanUrl.split('/').filter(Boolean);
        if (parts.length === 2) {
          owner = parts[0];
          repo = parts[1];
        }
      }
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL format. Provide owner/repo or full GitHub URL.' }, { status: 400 });
    }

    if (!owner || !repo) {
      return NextResponse.json({ error: 'Could not extract owner and repo from input.' }, { status: 400 });
    }

    // 1. Fetch Structured Signals from GitHub
    const signals = await fetchRepoSignals(owner, repo);

    // 2. Synthesize using AI
    const analysis = await generateAIAnalysis(signals);

    // 3. Return the payload
    return NextResponse.json({ result: analysis, signals });
  } catch (error: any) {
    console.error('Error in repo analysis:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during analysis' },
      { status: 500 }
    );
  }
}
