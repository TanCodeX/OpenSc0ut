const fs = require('fs');
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ ERROR: GEMINI_API_KEY environment variable is missing.");
  console.error("Please run the script by passing your API key like this:");
  console.error("GEMINI_API_KEY='your_google_ai_studio_api_key' node scripts/enrich-orgs.js");
  process.exit(1);
}

const dataPath = path.join(__dirname, '../src/data/gsoc-orgs.json');
let orgs = [];
try {
  orgs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (e) {
  console.error("❌ Could not read src/data/gsoc-orgs.json. Ensure the file exists.");
  process.exit(1);
}

async function enrichOrg(org) {
  const prompt = `You are an expert open-source data enrichment assistant. 
Given the following Google Summer of Code organization:
- Name: ${org.name}
- Description: ${org.desc}
- Ideas List URL: ${org.ideas}

Please infer:
1. The most likely primary GitHub repository for this organization, in the exact format "owner/repo" (e.g. "facebook/react"). If you are completely unsure or if they don't use GitHub (e.g., they use GitLab or self-hosted Git), return an empty string "".
2. A single-word category for the project (e.g. "Infrastructure", "Web", "Science", "Security", "Tools", "Language", "Database", "AI", "Mobile", "Hardware", "Operating-System").
3. An array of 3 to 5 tech stack tags (e.g. ["python", "machine learning", "tensorflow"]).

Return ONLY a raw valid JSON object in this exact format. Do NOT include markdown code blocks or backticks:
{
  "githubRepo": "owner/repo",
  "cat": "Category",
  "tags": ["tag1", "tag2", "tag3"]
}`;

  try {
    let response;
    let retries = 3;
    while (retries > 0) {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (response.status === 429) {
          console.warn(`⚠️ Rate limited! Waiting 30 seconds before retrying (Retries left: ${retries - 1})...`);
          await new Promise(resolve => setTimeout(resolve, 30000));
          retries--;
          continue;
      }
      break;
    }

    if (!response || !response.ok) {
      throw new Error(`API returned HTTP ${response?.status}`);
    }

    const json = await response.json();
    const text = json.candidates[0].content.parts[0].text;
    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error(`Failed to enrich ${org.name}:`, error.message);
    return null;
  }
}

async function run() {
  console.log(`Found ${orgs.length} total organizations in dataset.`);
  
  let enrichedCount = 0;
  
  for (let i = 0; i < orgs.length; i++) {
    const org = orgs[i];
    
    // Skip if it already has a GitHub repo (like our curated ones!)
    if (org.githubRepo && org.githubRepo !== "") {
      continue;
    }

    console.log(`[${i + 1}/${orgs.length}] Enriching ${org.name}...`);
    
    // Add a 4-second delay to safely stay under the 15 RPM free-tier limit
    await new Promise(res => setTimeout(res, 4000));

    const enrichedData = await enrichOrg(org);
    
    if (enrichedData) {
      org.githubRepo = enrichedData.githubRepo || "";
      org.cat = enrichedData.cat || "Uncategorized";
      org.tags = enrichedData.tags || [];
      enrichedCount++;

      // Save incrementally! If the script stops, we don't lose progress.
      fs.writeFileSync(dataPath, JSON.stringify(orgs, null, 4));
    }
  }

  console.log(`\n✅ Finished! Successfully enriched ${enrichedCount} new organizations.`);
}

run();
