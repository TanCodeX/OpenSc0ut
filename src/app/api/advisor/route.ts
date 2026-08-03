import { NextRequest, NextResponse } from 'next/server';
import { ORGS } from '../../../data/orgs';

// Format orgs to a minified string to save tokens (keep only essential fields for RAG)
const minifiedOrgs = ORGS.map(org => ({
  s: org.slug,
  t: org.tags
}));

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ API key is not configured' }, { status: 500 });
    }

    const prompt = `
You are an expert advisor helping developers find the perfect Google Summer of Code (GSoC) organization to contribute to.

Below is a JSON array of all available GSoC organizations.
Fields: s=slug, t=tags.

Organizations:
${JSON.stringify(minifiedOrgs)}

User Query: "${query}"

Task: Based on the user query, identify the top 3 best-matching organizations from the list above.
Return ONLY a valid JSON object containing a "results" array. Do not include markdown code blocks (\`\`\`json) or any other text.
Format of the JSON object:
{
  "results": [
    {
      "slug": "organization-slug",
      "reason": "A 1-2 sentence explanation of why this organization matches their query."
    }
  ]
}
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', response.status, errText);
      return NextResponse.json({ error: 'AI API Error' }, { status: 500 });
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content || "";
    
    // Clean up potential markdown formatting if the model still includes it
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('\`\`\`json')) {
      cleanedText = cleanedText.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    } else if (cleanedText.startsWith('\`\`\`')) {
      cleanedText = cleanedText.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse JSON response:", cleanedText);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const resultsArray = Array.isArray(parsedResult) ? parsedResult : parsedResult.results || [];
    return NextResponse.json({ results: resultsArray });
  } catch (error) {
    console.error('Error in AI Advisor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
