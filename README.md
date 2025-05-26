# GitHub India Repos

A web application to discover GitHub repositories in India where developers can contribute.

## Features

- **Search/filter by location** (India)
- **Filter by tech stack** (e.g., JavaScript, Python, etc.)
- **Filter by "Good First Issue" / "Help Wanted" labels**
- **Sort by stars, forks, or recent activity**
- **Show project details** – stars, description, last updated
- **Contributor guidelines / link to issues**

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **API**: GitHub REST API
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/github-india-repos.git
cd github-india-repos
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your GitHub Personal Access Token (optional, but recommended to avoid rate limiting):

```
NEXT_PUBLIC_GITHUB_TOKEN=your_github_personal_access_token
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## GitHub API Usage

This project uses the GitHub API to search for repositories. The GitHub API has rate limits:

- For unauthenticated requests: 60 requests per hour
- For authenticated requests: 5,000 requests per hour

To avoid rate limiting, it's recommended to use a GitHub Personal Access Token.

## How It Works

The application uses the GitHub API to search for repositories associated with India. You can filter repositories by:

- Location (India)
- Programming language
- Issue labels (Good First Issue, Help Wanted, etc.)
- Sort by stars, forks, or recent activity

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
