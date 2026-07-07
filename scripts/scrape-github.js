const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_FILE = path.join(__dirname, '../src/data/gsoc-orgs.json');

const githubHeaders = {
  'User-Agent': 'OpenSc0ut-GSoC-Scraper',
};

if (process.env.GITHUB_TOKEN) {
  githubHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  console.log("✅ Using GITHUB_TOKEN for API requests");
} else {
  console.warn("⚠️ No GITHUB_TOKEN found. GitHub API requests will be severely rate-limited (60/hr).");
  console.warn("⚠️ Run with GITHUB_TOKEN=your_token node scrape-github.js for full results.");
}

const fetchJson = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: githubHeaders }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 403 || res.statusCode === 429) {
        return reject(new Error('Rate_Limited'));
      }
      if (res.statusCode >= 400) {
        return resolve(null);
      }
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        resolve(null);
      }
    });
  }).on('error', reject);
});

async function getTopRepoForOwner(owner) {
  try {
    const data = await fetchJson(`https://api.github.com/users/${owner}/repos?sort=stars&per_page=1`);
    if (data && data.length > 0) {
      return data[0].full_name;
    }
    return null;
  } catch (e) {
    if (e.message === 'Rate_Limited') {
      throw e; // Bubble up rate limit so we can stop making requests
    }
    return null;
  }
}

async function enrichOrgs() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  let updatedCount = 0;
  let apiRateLimited = false;

  for (let i = 0; i < data.length; i++) {
    const org = data[i];

    // If it already has a full owner/repo, skip
    if (org.githubRepo && org.githubRepo.includes('/')) {
      continue;
    }

    let owner = null;
    let explicitRepo = null;

    // 1. Try to extract from 'ideas' link
    if (org.ideas && org.ideas.includes('github.com')) {
      try {
        const url = new URL(org.ideas);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
          explicitRepo = `${parts[0]}/${parts[1]}`;
        } else if (parts.length === 1) {
          owner = parts[0];
        }
      } catch (e) {}
    }

    // 2. If no owner from ideas, guess owner from slug
    if (!owner && !explicitRepo) {
      owner = org.slug;
    }

    if (explicitRepo) {
      org.githubRepo = explicitRepo;
      updatedCount++;
      console.log(`✅ [${org.name}] Found repo from ideas link: ${explicitRepo}`);
    } else if (owner && !apiRateLimited) {
      // Need to fetch top repo from GitHub API
      try {
        process.stdout.write(`🔍 [${org.name}] Querying API for owner '${owner}'... `);
        const topRepo = await getTopRepoForOwner(owner);
        if (topRepo) {
          org.githubRepo = topRepo;
          updatedCount++;
          console.log(`Found top repo: ${topRepo}`);
        } else {
          console.log(`No public repos found.`);
        }
      } catch (e) {
        if (e.message === 'Rate_Limited') {
          console.log(`\n❌ GitHub API Rate Limit Reached. Skipping remaining API calls.`);
          apiRateLimited = true;
        } else {
          console.log(`Error: ${e.message}`);
        }
      }
    }
  }

  // Save the updated JSON
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4), 'utf8');
  console.log(`\n💾 Saved updated data to ${DATA_FILE}`);
  console.log(`📈 Successfully added/updated ${updatedCount} GitHub repositories.`);
}

enrichOrgs();
