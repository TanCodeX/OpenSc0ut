"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ProgramProjectCard } from "@/components/ProgramProjectCard";
import { SitePageHero } from "@/components";

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
  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse backdrop-blur-sm">
    <div className="mb-4 h-4 w-24 rounded-full bg-white/10" />
    <div className="mb-2 h-6 w-3/4 rounded-lg bg-white/10" />
    <div className="mb-1 h-4 w-1/2 rounded-lg bg-white/10" />
    <div className="mb-6 h-16 w-full rounded-lg bg-white/10" />
    <div className="h-4 w-20 rounded-full bg-white/10" />
  </div>
);

export default function GsocPage() {
  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [projects, setProjects] = useState<ProgramProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isYearDropdownOpen && !target.closest('.year-dropdown-container')) {
        setIsYearDropdownOpen(false);
      }
    };

    if (isYearDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isYearDropdownOpen]);

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
    <div className="min-h-screen bg-black text-white">
      <main>
        <SitePageHero
          badge="Open source programs"
          title={
            <>
              Google Summer of <span className="text-[#FF0B55]">Code</span>
            </>
          }
          description="Explore curated community projects sourced from program archives. Filter by year or keywords to find organizations and projects that match your interests."
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-8 relative z-10">
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF0B55]/10 to-transparent blur-3xl -z-10 rounded-3xl" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-[#FF0B55] rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Browse projects</h2>
            </div>
            <p className="text-gray-400 max-w-2xl">
              Pick a year and search by organization, project name, or topics.
            </p>
          </div>

        <section className="relative z-50 mb-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-gray-300">
              <span className="font-medium text-white">Year</span>
              <div className="relative year-dropdown-container">
                <button
                  type="button"
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="w-full h-11 px-4 py-2 bg-black/40 border border-white/15 rounded-full text-left text-gray-300 flex justify-between items-center hover:border-[#FF0B55]/40 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {year}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isYearDropdownOpen && (
                  <div className="absolute z-[1000] mt-1 w-full bg-gray-950/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50">
                    <div className="p-2 flex flex-col gap-1">
                      {YEARS.map((optionYear) => (
                        <button
                          key={optionYear}
                          type="button"
                          onClick={() => {
                            setYear(optionYear);
                            setIsYearDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            year === optionYear
                              ? "bg-black text-white"
                              : "text-gray-300 hover:bg-black/50"
                          }`}
                        >
                          {optionYear}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </label>

            <label className="flex flex-col gap-2 text-sm text-gray-300">
              <span className="font-medium text-white">Search</span>
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full rounded-full border border-white/15 bg-black/40 px-3 pl-9 text-sm text-gray-300 placeholder-gray-500 hover:border-[#FF0B55]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent"
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

          <div className=" z-20 flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-center sm:text-left">
              {loading ? (
                <span>Loading data for <span className="font-medium text-white">GSoC</span> {year}...</span>
              ) : (
                <span>Showing {resultsLabel} for <span className="font-medium text-white">GSoC</span> {year}</span>
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
          <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={`skeleton-${idx}`} />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-3xl mx-auto rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-red-300">We hit a snag loading projects</h2>
            <p className="mb-6 text-sm text-red-200/90">{error}</p>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/20 px-5 py-2 text-sm text-red-200 transition hover:border-red-400 hover:bg-red-500/30 hover:text-white"
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
          <div className="relative z-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProgramProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
