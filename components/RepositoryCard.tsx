import { Repository } from "../lib/types";
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
    <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md rounded-lg border border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] overflow-hidden hover:border-gray-500 transition-all duration-300 flex flex-col h-full">
      <div className="p-5 flex-1">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 relative mr-3">
            <Image
              src={repository.owner.avatar_url}
              alt={`${repository.owner.login}'s avatar`}
              fill
              className="rounded-full object-cover"
              unoptimized
            />
          </div>
          <div>
            <a
              href={repository.owner.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-300 hover:text-[#FF0B55]"
            >
              {repository.owner.login}
            </a>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <h3 className="text-xl font-bold mb-2 text-white hover:text-[#FF0B55]">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {repository.name}
            </a>
          </h3>

          {repository.description && (
            <p className="text-gray-400 mb-4 line-clamp-2">
              {repository.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {repository.language && (
              <span className="px-2 py-1 bg-black/30 text-[#FF0B55] text-xs rounded-full">
                {repository.language}
              </span>
            )}

            {repository.topics &&
              repository.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-1 bg-black/30 text-gray-300 text-xs rounded-full"
                >
                  {topic}
                </span>
              ))}
          </div>

          <div className="flex justify-between text-sm text-gray-400 w-full mt-auto">
            <div className="flex space-x-4">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {repository.stargazers_count.toLocaleString()}
              </span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                {repository.forks_count.toLocaleString()}
              </span>
              {repository.open_issues_count > 0 && (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {repository.open_issues_count.toLocaleString()}
                </span>
              )}
            </div>
            <div>
              <span className="text-xs">
                Updated {formatDate(repository.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-black/30 border-t border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] text-center">
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
