const fs = require('fs');
const path = require('path');

async function scrapeGSoCOrgs() {
  const url = 'https://summerofcode.withgoogle.com/api/program/2026/organizations/';
  console.log(`Fetching data from ${url}...`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data. HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    
    // The API usually returns an array directly, but we handle potential wrapping objects just in case.
    const orgs = Array.isArray(data) ? data : (data.organizations || data.results || []);

    if (!orgs || orgs.length === 0) {
      console.warn('⚠️ No organizations found in the response.');
      return;
    }

    const scaffoldedOrgs = orgs.map((org) => {
      // Safely extract fields, falling back to empty strings if the API structure varies
      return {
        name: org.name || '',
        slug: org.slug || org.id?.toString() || '',
        desc: org.tagline || org.description || '', // GSOC API often uses 'tagline'
        ideas: org.idea_list || org.ideas_link || org.ideas || '', // Varies slightly between years
        githubRepo: '',
        cat: '',
        tags: []
      };
    });

    const outputPath = path.join(process.cwd(), 'gsoc-orgs-scaffold.json');
    fs.writeFileSync(outputPath, JSON.stringify(scaffoldedOrgs, null, 4), 'utf-8');

    console.log(`\n✅ Success! Scraped ${scaffoldedOrgs.length} organizations.`);
    console.log(`💾 Saved beautifully formatted JSON to: ${outputPath}`);

  } catch (error) {
    console.error('\n❌ Error during scraping:', error.message);
    console.error('Please check your network connection or if the GSoC API endpoint has changed.');
  }
}

scrapeGSoCOrgs();
