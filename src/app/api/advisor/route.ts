import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ORGS } from '../../../data/orgs';

// Format orgs to a minified string to save tokens (keep only essential fields for RAG)
const minifiedOrgs = ORGS.map(org => ({
  s: org.slug,
  n: org.name,
  c: org.category,
  t: org.tags,
  d: org.description,
  i: org.ideas
}));

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an expert advisor helping developers find the perfect Google Summer of Code (GSoC) organization to contribute to.

Below is a JSON array of all available GSoC organizations.
Fields: s=slug, n=name, c=category, t=tags, d=description, i=ideas.

Organizations:
${JSON.stringify(minifiedOrgs)}

User Query: "${query}"

Task: Based on the user query, identify the top 3 best-matching organizations from the list above.
Return ONLY a valid JSON array of objects. Do not include markdown code blocks (\`\`\`json) or any other text.
Format of each object in the array:
[
  {
    "slug": "organization-slug",
    "reason": "A 1-2 sentence explanation of why this organization matches their query."
  }
]
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
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

    return NextResponse.json({ results: parsedResult });
  } catch (error) {
    console.error('Error in AI Advisor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
