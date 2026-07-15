<div align="center">

# 🛠️ Contributing to `OpenSc0ut`

**Thank you for considering a contribution!**

<sub>Every bug fix, feature, and typo correction helps make OpenSc0ut better for everyone.</sub>

<br />

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/TanCodeX/OpenSc0ut/pulls)
[![Code of Conduct](https://img.shields.io/badge/Contributor_Covenant-2.1-4baaaa.svg?style=for-the-badge)](CODE_OF_CONDUCT.md)

</div>

<br />

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
  - [Reporting Bugs](#-reporting-bugs)
  - [Suggesting Enhancements](#-suggesting-enhancements)
  - [Pull Requests](#-pull-requests)
- [Local Development Setup](#-local-development-setup)
- [Coding Standards](#-coding-standards)

<br />

---

## 🧭 Code of Conduct

By participating in this project, you are expected to uphold our [**Code of Conduct**](CODE_OF_CONDUCT.md).

Please report unacceptable behavior to **tanmaypatwary@gmail.com**.

<br />

---

## 💡 How Can I Contribute?

### 🐛 Reporting Bugs

> [!IMPORTANT]
> Before submitting a bug report, please check if the issue already exists to avoid duplicates.

A great bug report includes:

- ✅ A **clear, descriptive title** that identifies the problem
- ✅ **Exact steps to reproduce** the behavior
- ✅ What you **expected** to happen vs. what **actually** happened
- ✅ Screenshots, error logs, or code snippets that illustrate the issue

[→ Open a Bug Report](https://github.com/TanCodeX/OpenSc0ut/issues/new)

<br />

### 💬 Suggesting Enhancements

Have an idea that would make OpenSc0ut better? We'd love to hear it!

A great enhancement proposal includes:

- ✅ A **clear, descriptive title** for the suggestion
- ✅ A **step-by-step description** of the proposed feature
- ✅ An explanation of **why this would benefit** most users
- ✅ Any relevant mockups, diagrams, or examples

[→ Open a Feature Request](https://github.com/TanCodeX/OpenSc0ut/issues/new)

<br />

### 🔀 Pull Requests

> [!NOTE]
> Please ensure there is an open issue for the work you're doing before starting. This avoids duplicate effort.

**Follow these steps:**

| Step | Action |
|------|--------|
| **1** | **Fork** the repository |
| **2** | **Create** a feature or bugfix branch |
| **3** | **Write** your code following our [coding standards](#-coding-standards) |
| **4** | **Commit** with a clear, descriptive message |
| **5** | **Push** to your fork and open a Pull Request |

**Branch Naming Convention:**
```
feature/your-feature-name
bugfix/issue-number-short-description
docs/update-readme
```

**Commit Message Convention:**
```bash
# ✅ Good
feat: add sorting by open issue count
fix: correct API rate limit handling on GitHub endpoint
docs: update environment variable instructions

# ❌ Bad
fixed stuff
update
wip
```

> [!WARNING]
> Always merge the latest changes from `upstream/main` into your branch before opening a PR to avoid merge conflicts.

<br />

---

## 💻 Local Development Setup

**1. Fork & Clone**
```bash
git clone https://github.com/YOUR_USERNAME/OpenSc0ut.git
cd OpenSc0ut
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**4. Start the dev server**
```bash
npm run dev
```

Visit <kbd>http://localhost:3000</kbd> and you're ready to go! 🚀

<br />

---

## 📐 Coding Standards

| Category | Standard |
|----------|----------|
| **Language** | TypeScript — strict typing required |
| **Styling** | Tailwind CSS — reuse existing tokens and components |
| **Linting** | Code must pass `npm run lint` with no errors |
| **Formatting** | Follow the existing Prettier config |
| **Components** | Keep components focused, reusable, and well-named |
| **Animations** | Use Framer Motion consistently with the existing patterns |

<br />

---

<div align="center">

<sub>Thank you for helping make <b>OpenSc0ut</b> better. You're awesome. 🌟</sub>

</div>
