import Header from "../../components/Header";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            About GitHub India Repos
          </h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-lg mb-4">
              GitHub India Repos is a platform designed to help developers find
              open-source projects in India where they can contribute. Our
              mission is to connect developers with meaningful projects and
              foster collaboration within the Indian developer community.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">How It Works</h2>
            <p>
              We use the GitHub API to search for repositories that are
              associated with India. You can filter repositories by:
            </p>
            <ul className="list-disc pl-5 my-4 space-y-2">
              <li>Location (India)</li>
              <li>Programming language (JavaScript, Python, etc.)</li>
              <li>Issue labels (Good First Issue, Help Wanted, etc.)</li>
              <li>Sort by stars, forks, or recent activity</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              Why Contribute to Open Source?
            </h2>
            <p>
              Contributing to open source projects offers numerous benefits:
            </p>
            <ul className="list-disc pl-5 my-4 space-y-2">
              <li>Gain practical experience working on real-world projects</li>
              <li>
                Improve your coding skills and learn from experienced developers
              </li>
              <li>
                Build your portfolio and showcase your work to potential
                employers
              </li>
              <li>
                Network with other developers and become part of a community
              </li>
              <li>Help improve software that others rely on</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              GitHub API Usage
            </h2>
            <p>
              This project uses the GitHub API to fetch repository data. Please
              note that the GitHub API has rate limits:
            </p>
            <ul className="list-disc pl-5 my-4 space-y-2">
              <li>For unauthenticated requests: 60 requests per hour</li>
              <li>For authenticated requests: 5,000 requests per hour</li>
            </ul>
            <p>
              To avoid rate limiting, consider using a GitHub Personal Access
              Token.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
            <p>
              If you have any questions, suggestions, or feedback, please feel
              free to reach out or contribute to the project on GitHub.
            </p>

            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Built with Next.js and GitHub API. This project helps developers
            find open source projects in India.
          </p>
        </div>
      </footer>
    </div>
  );
}
