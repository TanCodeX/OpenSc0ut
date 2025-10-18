// Application constants
export const APP_CONFIG = {
  name: 'OpenSc0ut',
  description: 'Repository Explorer',
  version: '0.1.0',
} as const;

// GitHub API constants
export const GITHUB_API = {
  baseUrl: 'https://api.github.com',
  maxResults: 1000,
  itemsPerPage: 12,
} as const;

// UI constants
export const UI_CONFIG = {
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;
