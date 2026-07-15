# Contributing to OpenSc0ut

First off, thank you for considering contributing to OpenSc0ut! It's people like you that make open source such a great community to learn, inspire, and create.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to tanmaypatwary@gmail.com.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for OpenSc0ut. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

*   Use a clear and descriptive title for the issue to identify the problem.
*   Describe the exact steps which reproduce the problem in as many details as possible.
*   Provide specific examples to demonstrate the steps. Include links to files or copy/paste snippets, which you use in those examples.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for OpenSc0ut, including completely new features and minor improvements to existing functionality.

*   Use a clear and descriptive title for the issue to identify the suggestion.
*   Provide a step-by-step description of the suggested enhancement in as many details as possible.
*   Explain why this enhancement would be useful to most OpenSc0ut users.

### Pull Requests

The process described here has several goals:
*   Maintain OpenSc0ut's quality
*   Fix problems that are important to users
*   Engage the community in working toward the best possible OpenSc0ut
*   Enable a sustainable system for OpenSc0ut's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1.  **Fork** the repo on GitHub.
2.  **Clone** the project to your own machine.
3.  **Create a branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-number`.
4.  **Install dependencies** and ensure you can run the project locally (see `README.md` for getting started instructions).
5.  **Commit** your changes with a descriptive commit message. 
    *   _Good:_ `feat: add new sorting option by issue count`
    *   _Bad:_ `fixed stuff`
6.  **Push** your work back up to your fork: `git push origin feature/your-feature-name`.
7.  **Submit a Pull Request** so that we can review your changes.

NOTE: Be sure to merge the latest from "upstream" before making a pull request!

## Local Development Setup

To get a local copy up and running, follow these simple example steps:

1.  Clone the repository.
2.  Install NPM packages via `npm install`.
3.  Setup your environment variables by copying `.env.example` (or creating `.env.local` based on the README) and filling in your API keys (GitHub & Gemini).
4.  Run `npm run dev` and open `http://localhost:3000` in your browser.

## Coding Style and Guidelines

*   **TypeScript:** We strictly use TypeScript. Ensure your code is properly typed.
*   **Styling:** We use Tailwind CSS for all styling. Try to reuse existing UI components and colors where possible.
*   **Linting/Formatting:** Ensure your code passes all lint checks (`npm run lint` if configured) and is formatted correctly.

Thank you for contributing!
