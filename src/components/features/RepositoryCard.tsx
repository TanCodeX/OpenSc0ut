import { Repository } from "../../types/types";
import Link from "next/link";
import Image from "next/image";

interface RepositoryCardProps {
  repository: Repository;
}

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white/80 dark:bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md rounded-lg border-[0.5px] border-gray-200 dark:border-[hsla(0,1.10%,36.10%,0.44)] overflow-hidden hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col min-h-0">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 relative mr-3 shrink-0">
            <Image
              src={repository.owner.avatar_url}
              alt={`${repository.owner.login}'s avatar`}
              fill
              className="rounded-full object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <a
              href={repository.owner.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#FF0B55] truncate block"
            >
              {repository.owner.login}
            </a>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-[#FF0B55] line-clamp-1">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {repository.name}
            </a>
          </h3>

          {repository.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {repository.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {repository.language && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-black/30 text-[#FF0B55] text-xs rounded-full">
                {repository.language}
              </span>
            )}

            {repository.topics &&
              repository.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-1 bg-gray-100 dark:bg-black/30 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  {topic}
                </span>
              ))}
          </div>

          <div className="w-full mt-auto pt-3 flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-between gap-4 w-full">
              <span
                className="flex items-center gap-1 whitespace-nowrap"
                title="Stars"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="tabular-nums">
                  {repository.stargazers_count.toLocaleString()}
                </span>
              </span>
              <span
                className="flex items-center gap-1 whitespace-nowrap"
                title="Forks"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M5 5.372v.878c0 .192.168.1.5.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-10.20.0.5 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                </svg>
                <span className="tabular-nums">
                  {repository.forks_count.toLocaleString()}
                </span>
              </span>
              <span
                className="flex items-center gap-1 whitespace-nowrap"
                title="Open issues"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
                </svg>
                <span className="tabular-nums">
                  {repository.open_issues_count.toLocaleString()}
                </span>
              </span>
            </div>
            <div className="w-full text-right">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                Updated {formatDate(repository.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50 dark:bg-black/30 border-t border-[0.5px] border-gray-200 dark:border-[hsla(0,1.10%,36.10%,0.44)] text-center">
        <a
          href={`${repository.html_url}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF0B55] hover:text-[#e00a4c] text-sm font-medium"
        >
          View Issues
        </a>
      </div>
    </div>
  );
}
