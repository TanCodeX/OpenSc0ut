const fs = require('fs');
const path = require('path');

async function scrapeGSoCOrgs() {
  const existingPath = path.join(process.cwd(), 'src/data/gsoc-orgs.json');
  let orgMap = new Map();

  // Load existing data to preserve enriched fields (githubRepo, cat, tags)
  if (fs.existsSync(existingPath)) {
    const existingData = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
    existingData.forEach(org => {
      orgMap.set(org.slug, { ...org, years: org.years || [] });
    });
  }

  const years = [2022, 2023, 2024, 2025, 2026];

  for (const year of years) {
    const url = `https://summerofcode.withgoogle.com/api/program/${year}/organizations/`;
    console.log(`Fetching data for ${year} from ${url}...`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`⚠️ Failed to fetch ${year}. HTTP Status: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const orgs = Array.isArray(data) ? data : (data.organizations || data.results || []);

      orgs.forEach((org) => {
        const slug = org.slug || org.id?.toString() || '';
        if (!slug) return;

        if (orgMap.has(slug)) {
          const existing = orgMap.get(slug);
          if (!existing.years.includes(year)) {
            existing.years.push(year);
          }
          // Update ideas link if the newer year has one and the old one didn't
          if (!existing.ideas && (org.idea_list || org.ideas_link || org.ideas)) {
             existing.ideas = org.idea_list || org.ideas_link || org.ideas;
          }
          // Update logoUrl
          if (!existing.logoUrl && org.logo_url) {
             existing.logoUrl = org.logo_url;
          }
          // Update tags (topics) and cat (technologies)
          const newTags = org.topic_tags || [];
          existing.tags = Array.from(new Set([...(existing.tags || []), ...newTags]));
          
          const newTechs = org.tech_tags || [];
          const existingCatArray = existing.cat ? existing.cat.split(', ') : [];
          existing.cat = Array.from(new Set([...existingCatArray, ...newTechs])).filter(Boolean).join(', ');
        } else {
          orgMap.set(slug, {
            name: org.name || '',
            slug: slug,
            logoUrl: org.logo_url || '',
            desc: org.tagline || org.description || '',
            ideas: org.idea_list || org.ideas_link || org.ideas || '',
            githubRepo: '',
            cat: (org.tech_tags || []).join(', '),
            tags: org.topic_tags || [],
            years: [year]
          });
        }
      });
    } catch (error) {
      console.error(`\n❌ Error during scraping ${year}:`, error.message);
    }
  }

  // Convert map to array and sort by latest year, then alphabetically
  const finalOrgs = Array.from(orgMap.values());
  
  // Sort years array descending for each org
  finalOrgs.forEach(org => org.years.sort((a, b) => b - a));

  fs.writeFileSync(existingPath, JSON.stringify(finalOrgs, null, 4), 'utf-8');

  console.log(`\n✅ Success! Merged ${finalOrgs.length} organizations across multiple years.`);
  console.log(`💾 Saved dynamically to: ${existingPath}`);
}

scrapeGSoCOrgs();
