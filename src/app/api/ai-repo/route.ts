// ==================== src/app/api/ai-repo/route.ts ====================
import { NextRequest, NextResponse } from 'next/server';

// NOTE: Replace this with the actual URL and PORT where your Python server is running
const PYTHON_API_URL = "http://127.0.0.1:8000/api/v1/analyze"; 

export async function POST(request: NextRequest) {
  try {
    const { repo_url } = await request.json();

    if (!repo_url) {
      return NextResponse.json({ success: false, error: 'Repository URL is required.' }, { status: 400 });
    }

    console.log(`Forwarding analysis request for: ${repo_url}`);

    // Forward the request to the Python API
    const pythonResponse = await fetch(PYTHON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the data the Python endpoint expects (a dictionary with 'repo_url')
      body: JSON.stringify({repo_url}),
    });

    // Check for non-200 responses from Python
    if (!pythonResponse.ok) {
        const pythonErrorBody = await pythonResponse.json().catch(() => ({}));
        console.error("Python API Error:", pythonErrorBody);
        return NextResponse.json(
            { success: false, error: pythonErrorBody.message || "Python API encountered an error." },
            { status: pythonResponse.status }
        );
    }
    
    const data = await pythonResponse.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Next.js Proxy Error:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal server error or Python API is offline." },
      { status: 500 }
    );
  }
}
// ===================================================================