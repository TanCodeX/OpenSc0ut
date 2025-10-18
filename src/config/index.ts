// Application configuration
export const config = {
  app: {
    name: 'OpenSc0ut',
    description: 'Discover and explore repositories from around the world',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  api: {
    github: {
      baseUrl: 'https://api.github.com',
      timeout: 10000,
    },
  },
  ui: {
    theme: 'dark',
    itemsPerPage: 12,
    maxResults: 1000,
  },
} as const;

export type Config = typeof config;
