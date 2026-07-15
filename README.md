<div align="center">
  <img src="https://raw.githubusercontent.com/TanCodeX/OpenSc0ut/main/src/app/icon.svg" alt="OpenSc0ut Logo" width="120" />
  <h1>OpenSc0ut</h1>
  
  <p>
    <strong>Your gateway to meaningful open source contributions and developer growth.</strong>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-13.5-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/github/license/TanCodeX/OpenSc0ut?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
  </p>
</div>

<hr />

## 🌟 About OpenSc0ut

OpenSc0ut is a modern web application designed to help developers seamlessly discover and explore GitHub repositories from around the world. Whether you're looking for your first open-source project to contribute to, exploring for GSOC, or looking for high-quality tools, OpenSc0ut makes finding the perfect match effortless.

---

## ✨ Features

- **Global Repository Search**: Find repositories by name, topic, or keyword.
- **Advanced Filtering Options**:
  - Filter by multiple programming languages (JavaScript, Python, Rust, Go, etc.)
  - Sort by stars, forks, recent updates, or creation date.
  - Ascending/descending order controls.
- **Repo Scout (AI Analysis)**: 
  - Analyze a GitHub repository's contribution readiness in seconds using advanced AI synthesis.
  - Get an instant score and grading on how welcoming the repository is for newcomers.
- **Modern, Premium UI/UX**:
  - Dark mode by default with stunning glass-morphism effects and neon accents.
  - Real-time search updates with smooth framer-motion animations.
  - Loading states, error handling, and robust pagination.
- **Rich Project Context**:
  - View repository stars, forks, detailed descriptions, and language statistics at a glance.
  - See active issue counts and "good first issue" links directly from the dashboard.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Fetching**: Axios / Next.js Native Fetch
- **APIs**: GitHub REST API, Google Gemini AI (for Repo Scout)
- **Deployment**: Vercel (Recommended)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18 or later recommended)
- **npm** or **yarn** or **pnpm**
- A GitHub Personal Access Token (to avoid rate limits).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TanCodeX/OpenSc0ut.git
   cd OpenSc0ut
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install
   ```

3. **Set up environment variables:**
   Create a `.env` or `.env.local` file in the root directory and add the following keys:
   ```env
   # Recommended to prevent GitHub API rate limiting
   NEXT_PUBLIC_GITHUB_TOKEN=your_github_personal_access_token

   # Required for the Repo Scout AI features
   GEMINI_API_KEY=your_gemini_api_key

   # Required for contact form emails (if using nodemailer)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or yarn dev
   ```

5. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 GitHub API Rate Limits

This project heavily relies on the GitHub API to fetch live repository data. 
- **Unauthenticated requests**: 60 requests per hour.
- **Authenticated requests (with Token)**: 5,000 requests per hour.

We **strongly advise** setting the `NEXT_PUBLIC_GITHUB_TOKEN` environment variable to ensure a smooth, uninterrupted experience.

---

## 🤝 Contributing

We believe in the power of open source and community collaboration! Contributions of any kind are welcome—whether it's fixing bugs, improving documentation, or proposing new features.

### How to Contribute
1. **Fork** the repository.
2. Create your **feature branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

Please ensure your code adheres to the existing styling conventions (Tailwind/Prettier) and is free of linting errors.

---

## 💬 Contact & Support

If you have questions, feedback, or want to say hi, feel free to reach out:

- **Maintainer**: Tanmay Patwary
- **GitHub**: [@TanCodeX](https://github.com/TanCodeX)
- **LinkedIn**: [Tanmay Patwary](https://www.linkedin.com/in/tanmaypatwary)

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

<div align="center">
  <p>Built with ❤️ by a dev, for devs.</p>
</div>
