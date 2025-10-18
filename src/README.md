# OpenSc0ut - Industrial File Structure

This document outlines the industrial-grade file structure for the OpenSc0ut application.

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── about/             # About page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── common/           # Shared/common components
│   ├── features/         # Feature-specific components
│   ├── layout/           # Layout components
│   ├── ui/               # UI components
│   └── index.ts          # Component exports
├── lib/                  # Library code
│   ├── api/              # API client code
│   ├── constants/        # Application constants
│   ├── hooks/            # Custom React hooks
│   ├── store/            # State management
│   ├── utils/            # Utility functions
│   └── index.ts          # Library exports
├── types/                # TypeScript type definitions
├── styles/               # Global styles
├── assets/               # Static assets
└── config/               # Configuration files
```

## Component Organization

### Layout Components (`src/components/layout/`)
- `Header.tsx` - Main navigation header
- `PageTransition.tsx` - Page transition animations
- `GlobalCursor.tsx` - Custom cursor component

### Feature Components (`src/components/features/`)
- `RepositoryCard.tsx` - Repository display card
- `SearchFilter.tsx` - Search and filter interface

### UI Components (`src/components/ui/`)
- `Pagination.tsx` - Pagination component
- `ui-collection-layout.tsx` - UI collection layout

### Common Components (`src/components/common/`)
- `Credit.tsx` - Credit/attribution component

## Library Organization

### API (`src/lib/api/`)
- `github-api.ts` - GitHub API client

### Hooks (`src/lib/hooks/`)
- `useDebounce.ts` - Debounce hook
- `useRepositories.ts` - Repository data management hook

### Utils (`src/lib/utils/`)
- `index.ts` - Utility functions (formatting, debounce, etc.)

### Constants (`src/lib/constants/`)
- `index.ts` - Application constants

## Best Practices

1. **Separation of Concerns**: Each directory has a specific purpose
2. **Barrel Exports**: Use index.ts files for clean imports
3. **Type Safety**: All components and functions are properly typed
4. **Reusability**: Components are designed to be reusable
5. **Maintainability**: Clear structure makes code easy to maintain

## Import Patterns

```typescript
// Component imports
import { Header, RepositoryCard } from '@/components';

// Library imports
import { useRepositories, formatNumber } from '@/lib';

// Type imports
import { Repository, SearchParams } from '@/types/types';
```

## Configuration

- `tsconfig.json` - TypeScript configuration with path mapping
- `next.config.js` - Next.js configuration with webpack aliases
- `src/config/` - Application configuration files
