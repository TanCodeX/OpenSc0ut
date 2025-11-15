"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ProgramProjectCard } from "@/components/ProgramProjectCard";

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

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, idx) => CURRENT_YEAR - idx);

const SkeletonCard = () => (
  <div className="rounded-lg border border-white/10 bg-white/5 p-5 animate-pulse">
    <div className="mb-4 h-4 w-24 rounded bg-white/10" />
    <div className="mb-2 h-6 w-3/4 rounded bg-white/10" />
    <div className="mb-1 h-4 w-1/2 rounded bg-white/10" />
    <div className="mb-6 h-16 w-full rounded bg-white/10" />
    <div className="h-4 w-20 rounded bg-white/10" />
  </div>
);

export default function GsocPage() {
  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [projects, setProjects] = useState<ProgramProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        // API will automatically sync data if it doesn't exist for the requested year
        const res = await fetch(
          `/api/program-projects?program=GSoC&year=${year}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data: ProgramProject[] = await res.json();
        setProjects(data);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message ?? "Error fetching projects");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
    return () => controller.abort();
  }, [year, refreshIndex]);

  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;
    const query = searchTerm.toLowerCase();
    return projects.filter((project) => {
      return (
        project.projectName.toLowerCase().includes(query) ||
        project.organizationName.toLowerCase().includes(query) ||
        project.topics.some((topic) => topic.toLowerCase().includes(query))
      );
    });
  }, [projects, searchTerm]);

  const resultsLabel = `${filteredProjects.length} project${filteredProjects.length === 1 ? "" : "s"}`;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,11,85,0.2),_transparent_65%)]" />
      <div className="container mx-auto px-5 py-24">
        <header className="mb-12 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.25em] text-[#FF0B55]">
            Open Source Programs
          </span>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Discover Google Summer of Code Projects
          </h1>
          <p className="mt-4 text-base text-gray-300 sm:text-lg">
            Explore curated community projects sourced automatically from program archives. Filter by program, year, or keywords to find organizations and projects that match your interests.
          </p>
        </header>

        <section className="mb-10 max-w-5xl mx-auto flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-gray-300">
              <span className="font-medium text-white">Year</span>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="h-11 rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white shadow-sm outline-none focus:border-[#FF0B55] focus:ring-1 focus:ring-[#FF0B55]"
              >
                {YEARS.map((optionYear) => (
                  <option key={optionYear} value={optionYear}>
                    {optionYear}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-gray-300">
              <span className="font-medium text-white">Search</span>
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 pl-9 text-sm text-white shadow-sm outline-none focus:border-[#FF0B55] focus:ring-1 focus:ring-[#FF0B55]"
                  placeholder="Search by organization, project, or topics"
                />
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
                  />
                </svg>
              </div>
            </label>
          </div>

          <div className="flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-center sm:text-left">
              {loading ? (
                <span>Loading data for <span className="font-semibold text-white">GSoC</span> {year}...</span>
              ) : (
                <span>Showing {resultsLabel} for <span className="font-semibold text-white">GSoC</span> {year}</span>
              )}
            </span>
            {!loading && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="self-center rounded-full border border-transparent px-4 py-1 text-xs text-[#FF0B55] transition hover:border-[#FF0B55] hover:text-white sm:self-auto"
              >
                Clear search
              </button>
            )}
          </div>
        </section>

        {loading ? (
          <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={`skeleton-${idx}`} />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-3xl mx-auto rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-sm text-red-200">
            <h2 className="mb-2 text-lg font-semibold text-red-300">We hit a snag loading projects</h2>
            <p className="mb-6">{error}</p>
            <button
              className="rounded-full border border-red-400/40 px-5 py-2 text-xs uppercase tracking-widest text-red-200 transition hover:border-red-400 hover:text-white"
              onClick={() => {
                setError(null);
                setRefreshIndex((prev) => prev + 1);
              }}
            >
              Retry
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-gray-300">
            <h2 className="mb-2 text-xl font-semibold text-white">No projects found for your filters</h2>
            <p className="mb-6 text-gray-400">
              Try selecting a different year or clearing the search to discover more projects.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <button
                className="rounded-full border border-white/20 px-4 py-2 text-white transition hover:border-[#FF0B55] hover:text-[#FF0B55]"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
              <button
                className="rounded-full border border-white/20 px-4 py-2 text-white transition hover:border-[#FF0B55] hover:text-[#FF0B55]"
                onClick={() => {
                  setYear(CURRENT_YEAR);
                  setRefreshIndex((prev) => prev + 1);
                }}
              >
                Reset filters
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProgramProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
