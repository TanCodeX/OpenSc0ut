const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../src/data/gsoc-orgs.json');

function updateLogos() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  let updatedCount = 0;

  for (let i = 0; i < data.length; i++) {
    const org = data[i];

    // Determine the best GitHub owner to use for the avatar
    let owner = null;

    if (org.githubRepo && org.githubRepo.includes('/')) {
      owner = org.githubRepo.split('/')[0];
    } else if (org.ideas && org.ideas.includes('github.com')) {
      try {
        const url = new URL(org.ideas);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          owner = parts[0];
        }
      } catch (e) {}
    } else {
      // Fallback to trying the slug as the GitHub organization
      owner = org.slug;
    }

    if (owner) {
      const newLogoUrl = `https://github.com/${owner}.png`;
      if (org.logoUrl !== newLogoUrl) {
        org.logoUrl = newLogoUrl;
        updatedCount++;
      }
    }
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4), 'utf8');
  console.log(`✅ Updated ${updatedCount} logos to use GitHub avatars.`);
}

updateLogos();
