<div align="center">

<img src="https://raw.githubusercontent.com/TanCodeX/OpenSc0ut/main/src/app/icon.svg" alt="OpenSc0ut Logo" width="100" />

<br />

# `OpenSc0ut`

**Your gateway to meaningful open source contributions and developer growth.**

<sub>Built for devs, by a dev.</sub>

<br />

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animated-EF4088?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

<br />

[![License](https://img.shields.io/github/license/TanCodeX/OpenSc0ut?style=flat-square&color=FF0B55)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/Contributor_Covenant-2.1-4baaaa.svg?style=flat-square)](CODE_OF_CONDUCT.md)

<br />

[**Features**](#-features) · [**Getting Started**](#-getting-started) · [**Tech Stack**](#️-tech-stack) · [**Contributing**](#-contributing) · [**License**](#-license)

</div>

<br />

---

## 🌟 About OpenSc0ut

> *Discover. Contribute. Grow.*

**OpenSc0ut** is a modern, beautifully designed web application that helps developers seamlessly discover, evaluate, and contribute to open-source GitHub repositories from around the world.

Whether you're hunting for your very **first contribution**, preparing for **Google Summer of Code**, or searching for high-quality tools — OpenSc0ut cuts through the noise and puts the right projects right in front of you.

<br />

---

## ✨ Features

<details>
<summary><b>🔍 Global Repository Search</b></summary>
<br />

Find repositories by name, topic, or keyword in real-time with a powerful search interface.

</details>

<details>
<summary><b>⚙️ Advanced Filtering & Sorting</b></summary>
<br />

- Filter by multiple programming languages — JavaScript, Python, Rust, Go, and more.
- Sort by stars, forks, recent updates, or creation date.
- Ascending / descending order controls.

</details>

<details open>
<summary><b>🤖 Repo Scout — AI-Powered Analysis</b></summary>
<br />

Analyze any GitHub repository's **contribution readiness** in seconds using Google Gemini AI.

- Instant letter grade (A → F) with an overall score out of 100.
- AI-synthesized narrative on the project's health and community.
- Direct links to **"good first issues"** so you know exactly where to start.

> 🎥 **Demo**:  
> <video src="https://github.com/user-attachments/assets/e96ed2c6-0f3f-4a54-b4ac-63d126e63565" controls width="100%"></video>


</details>

<details>
<summary><b>🎨 Premium UI / UX</b></summary>
<br />

- Dark mode by default with stunning glass-morphism effects and neon accents.
- Smooth Framer Motion animations throughout.
- Fully responsive, with skeleton loading states and robust error handling.

</details>

<br />

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **AI** | [Google Gemini API](https://deepmind.google/technologies/gemini/) |
| **Data** | [GitHub REST API](https://docs.github.com/en/rest) |
| **Email** | Nodemailer (via Gmail SMTP) |
| **Deployment** | [Vercel](https://vercel.com/) *(Recommended)* |

<br />

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- <kbd>Node.js</kbd> v18 or later
- <kbd>npm</kbd> / <kbd>yarn</kbd> / <kbd>pnpm</kbd>
- A GitHub Personal Access Token *(strongly recommended to avoid rate limits)*

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/TanCodeX/OpenSc0ut.git
cd OpenSc0ut
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**

Create a `.env.local` file in the root directory:
```env
# GitHub — prevents rate limiting (5,000 req/hr vs 60/hr unauthenticated)
NEXT_PUBLIC_GITHUB_TOKEN=your_github_personal_access_token

# Gemini AI — powers the Repo Scout feature
GEMINI_API_KEY=your_gemini_api_key

# Nodemailer — powers the contact form
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

**4. Run the development server**
```bash
npm run dev
```

**5. Open in your browser**

Navigate to [http://localhost:3000](http://localhost:3000) and start exploring! 🎉

<br />

---

## 💡 GitHub API Rate Limits

> [!NOTE]
> This project relies heavily on the GitHub API for live repository data.

| Request Type | Rate Limit |
|---|---|
| Unauthenticated | 60 requests / hour |
| Authenticated (with token) | **5,000 requests / hour** |

Setting `NEXT_PUBLIC_GITHUB_TOKEN` is **strongly recommended** for a smooth experience.

<br />

---

## 🤝 Contributing

We believe in the power of community! Every contribution, no matter how small, makes a difference.

> [!TIP]
> Read the [**Contributing Guidelines**](CONTRIBUTING.md) for a detailed walkthrough of the process, branch naming conventions, and coding standards.

> [!IMPORTANT]
> This project is released with a [**Code of Conduct**](CODE_OF_CONDUCT.md). By participating, you agree to uphold its terms.

<br />

---

## 💬 Contact & Support

Have questions, feedback, or just want to say hi?

| Platform | Link |
|---|---|
| **GitHub** | [@TanCodeX](https://github.com/TanCodeX) |
| **LinkedIn** | [Tanmay Patwary](https://www.linkedin.com/in/tanmaypatwary) |
| **Email** | tanmaypatwary@gmail.com |

<br />

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

<br />

---

<div align="center">

<sub>Built with ❤️ by <a href="https://github.com/TanCodeX">Tanmay</a> — for devs, by a dev.</sub>

</div>
