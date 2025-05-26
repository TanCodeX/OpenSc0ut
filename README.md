# OpenSc0ut

A modern web application to discover and explore GitHub repositories from around the world.

## Features

- **Global Repository Search** with optional location filtering
- **Advanced Filtering Options**:
  - Multiple programming languages (JavaScript, Python, Java, TypeScript, etc.)
  - Extensive label filtering (Good First Issue, Help Wanted, Hacktoberfest, etc.)
  - Sort by stars, forks, recent updates, or creation date
  - Ascending/descending order options
- **Modern UI/UX**:
  - Responsive design with dark mode
  - Real-time search updates
  - Loading states and error handling
  - Pagination support
  - Beautiful glass-morphism design
- **Project Details Display**:
  - Repository stars, forks, and description
  - Last updated information
  - Language statistics
  - Issue labels and counts

## Tech Stack

- **Frontend**: Next.js 13.5, React 18, TypeScript
- **Styling**: Tailwind CSS with custom glass-morphism effects
- **API**: GitHub REST API
- **State Management**: React Hooks
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/opensc0ut.git
cd opensc0ut
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

The application provides a powerful interface to search GitHub repositories with multiple filtering options:

- Location-based filtering (optional)
- Multiple programming language selection
- Comprehensive label filtering
- Advanced sorting options
- Real-time search updates with pagination

The search results are presented in a modern, card-based layout with essential repository information and direct links to issues and the repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
