import React from "react";

interface ProgramProject {
  id: string;
  year: number;
  program: string;
  organizationName: string;
  projectName: string;
  projectUrl: string;
  topics: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ProgramProjectCardProps {
  project: ProgramProject;
}

export function ProgramProjectCard({ project }: ProgramProjectCardProps) {
  return (
    <div className="group relative rounded-2xl border border-gray-200 dark:border-white/10 bg-gradient-to-br from-gray-50 to-transparent dark:from-white/5 dark:to-transparent backdrop-blur-sm overflow-hidden hover:border-[#FF0B55]/50 transition-all duration-300 flex flex-col h-full">
      <div className="relative z-10 p-6 flex flex-col flex-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs bg-gray-100 dark:bg-gray-900/60 text-gray-900 dark:text-white px-2 py-1 rounded-full font-semibold">{project.program} {project.year}</span>
        </div>
        <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white hover:text-[#FF0B55]">
          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
            {project.projectName}
          </a>
        </h3>
        <div className="mb-2 text-sm text-gray-700 dark:text-gray-300 font-medium">{project.organizationName}</div>
        {project.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">{project.description}</p>
        )}
        {project.topics && project.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.topics.slice(0, 5).map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 bg-gray-100 dark:bg-black/30 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-2 text-right">
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF0B55] hover:text-[#e00a4c] text-xs font-medium"
          >
            View Project
          </a>
        </div>
      </div>
    </div>
  );
}
