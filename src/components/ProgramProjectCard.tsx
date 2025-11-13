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
    <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md rounded-lg border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] overflow-hidden hover:border-gray-500 transition-all duration-300 flex flex-col h-full">
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs bg-gray-900/60 text-white px-2 py-1 rounded-full font-semibold">{project.program} {project.year}</span>
        </div>
        <h3 className="text-lg font-bold mb-1 text-white hover:text-[#FF0B55]">
          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
            {project.projectName}
          </a>
        </h3>
        <div className="mb-2 text-sm text-gray-300 font-medium">{project.organizationName}</div>
        {project.description && (
          <p className="text-gray-400 mb-4 line-clamp-3 text-sm">{project.description}</p>
        )}
        {project.topics && project.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.topics.slice(0, 5).map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 bg-black/30 text-gray-300 text-xs rounded-full"
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
