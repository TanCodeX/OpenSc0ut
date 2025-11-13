import axios from 'axios';
import * as cheerio from 'cheerio';

export type ScrapedProject = {
  year: number;
  program: string;
  organizationName: string;
  projectName: string;
  projectUrl: string;
  topics: string[];
  description: string;
};

/**
 * Scrapes the HTML archive for the given program and year, extracting projects as structured data.
 * @param year Target year (e.g., 2024)
 * @param program Program name (e.g., "GSoC", "GSSoC")
 */
export async function scrapeProgramArchive(year: number, program: string): Promise<ScrapedProject[]> {
  // In real use, set correct base URL per archive source:
  const targetUrl = `https://example-archive.com/${program}/${year}`;
  const projects: ScrapedProject[] = [];

  let html: string;
  try {
    const res = await axios.get(targetUrl);
    html = res.data;
  } catch (err) {
    throw new Error(`Failed to fetch archive page for ${program} ${year}: ${(err as Error).message}`);
  }

  const $ = cheerio.load(html);
  const projectCardSelector = 'div.project-card-container';

  $(projectCardSelector).each((_i, el) => {
    const projectName = $(el).find('h3.project-title').text().trim();
    const organizationName = $(el).find('p.org-name').text().trim();
    const description = $(el).find('div.description').text().trim();
    const projectUrl = $(el).find('a.github-link').attr('href') || '';
    // Expand with more/other selectors if archive HTML differs

    if (projectName && organizationName && projectUrl) {
      projects.push({
        year,
        program,
        organizationName,
        projectName,
        projectUrl,
        topics: [], // Could be extended with tag scraping logic
        description,
      });
    } else {
      // Optionally log/collect parse errors for diagnostics
      // console.warn('Skipping project with missing required fields:', { program, year, projectName, organizationName, projectUrl });
    }
  });

  return projects;
}
