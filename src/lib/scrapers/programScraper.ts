// src/lib/scrapers/programScraper.ts

import axios from 'axios';

// This type definition is from your original file
export type ScrapedProject = {
  year: number;
  program: string;
  organizationName: string;
  projectName: string;
  projectUrl: string;
  topics: string[];
  description: string;
};

// This interface defines the structure of the API response
interface ApiProject {
  title: string;
  description: string;
  project_url: string;
  // Add other fields if needed, e.g., student_name
}

interface ApiOrganization {
  name: string;
  topics: string[];
  projects: ApiProject[];
  // Add other fields if needed, e.g., url
}

interface ApiResponse {
  organizations: ApiOrganization[];
}

/**
 * Fetches project data from the GSoC JSON API for the given year.
 * @param year Target year (e.g., 2024)
 * @param program Program name (e.g., "GSoC"). Note: This API is GSoC-specific.
 */
export async function scrapeProgramArchive(year: number, program: string): Promise<ScrapedProject[]> {
  // Use the GSoC Organizations API endpoint
  const targetUrl = `https://api.gsocorganizations.dev/${year}.json`;
  const projects: ScrapedProject[] = [];

  console.log(`Fetching GSoC projects for ${year} from ${targetUrl}...`);

  let response;
  try {
    response = await axios.get<ApiResponse>(targetUrl);
  } catch (err) {
    const errorMessage = err instanceof Error 
      ? err.message 
      : axios.isAxiosError(err)
      ? err.response?.data?.message || err.message || 'Unknown error'
      : String(err);
    throw new Error(`Failed to fetch API data for ${program} ${year}: ${errorMessage}`);
  }

  const apiData = response.data;

  if (!apiData || !apiData.organizations) {
    console.warn(`No organizations found in API response for ${year}.`);
    return [];
  }

  // Loop through each organization, then through each of its projects
  for (const org of apiData.organizations) {
    if (!org || !org.name) {
      continue; // Skip invalid organizations
    }

    const organizationName = org.name.trim();
    const topics = Array.isArray(org.topics) ? org.topics : [];

    if (!org.projects || !Array.isArray(org.projects) || org.projects.length === 0) {
      continue; // Skip organizations with no projects listed
    }

    for (const project of org.projects) {
      // Ensure the project has the minimum required data
      if (!project || !project.title || !project.project_url || !project.description) {
        continue;
      }

      // Trim and validate string fields
      const projectTitle = project.title.trim();
      const projectUrl = project.project_url.trim();
      const projectDescription = project.description.trim();

      if (!projectTitle || !projectUrl || !projectDescription) {
        continue; // Skip projects with empty required fields after trimming
      }

      // Format the data to match your ScrapedProject type
      const scrapedProject: ScrapedProject = {
        year: year,
        program: program, // Use the program name passed to the function (e.g., "GSoC")
        organizationName: organizationName,
        projectName: projectTitle,
        projectUrl: projectUrl,
        topics: topics,
        description: projectDescription,
      };

      projects.push(scrapedProject);
    }
  }

  console.log(`Successfully formatted ${projects.length} projects.`);
  return projects;
}