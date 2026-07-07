const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/gsoc-orgs.json', 'utf8'));

let count = 0;
let githubCount = 0;

data.forEach(org => {
  if (!org.githubRepo && org.ideas && org.ideas.includes('github.com')) {
    try {
      const url = new URL(org.ideas);
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        org.githubRepo = `${parts[0]}/${parts[1]}`;
        githubCount++;
      } else if (parts.length === 1) {
        org.githubRepo = `${parts[0]}`; // just owner
        githubCount++;
      }
    } catch (e) {
      // invalid URL
    }
  }
  if (org.githubRepo) count++;
});

console.log(`Total orgs: ${data.length}`);
console.log(`Newly populated githubRepos: ${githubCount}`);
console.log(`Total populated githubRepos: ${count}`);
