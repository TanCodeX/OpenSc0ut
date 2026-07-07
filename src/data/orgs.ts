import scaffoldData from './gsoc-orgs.json';

export interface Organization {
  name: string;
  slug: string;
  logoUrl?: string;
  category: string;
  githubRepo: string; // e.g. "owner/repo"
  tags: string[];
  description: string;
  ideas?: string;
  years?: number[];
}

export const ORGS: Organization[] = scaffoldData.map((org) => ({
  name: org.name,
  slug: org.slug,
  logoUrl: org.logoUrl || '',
  category: org.cat || 'Uncategorized',
  githubRepo: org.githubRepo,
  tags: org.tags || [],
  description: org.desc || 'No description provided.',
  ideas: org.ideas || '',
  years: org.years || [2026],
}));
