"use client";

import { useMemo, useState } from "react";
import { SearchParams } from "../../types/types";

interface SearchFilterProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: Partial<SearchParams>;
}


const SORT_OPTIONS = [
  { value: "stars", label: "Stars" },
  { value: "forks", label: "Forks" },
  { value: "updated", label: "Recently Updated" },
];


export default function SearchFilter({
  onSearch,
  initialParams = {},
}: SearchFilterProps) {
  const [languageInput, setLanguageInput] = useState<string>("");
  const [sort, setSort] = useState<string>(initialParams.sort || "stars");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      sort,
      order,
      page: 1,
      ...(languageInput.trim() && {
        language: languageInput.trim(),
      }),
    });
  };


  const activeFiltersSummary = useMemo(() => {
    const parts: string[] = [];
    if (languageInput.trim()) parts.push(`language: ${languageInput.trim()}`);
    if (sort) parts.push(`sort: ${SORT_OPTIONS.find((o) => o.value === sort)?.label || sort}`);
    parts.push(order === "desc" ? "desc" : "asc");
    return parts.join(" · ");
  }, [languageInput, sort, order]);


  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF0B55]/20 to-purple-500/20 rounded-2xl blur opacity-30" />

      <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Active Filters Summary */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>{activeFiltersSummary}</span>
            </div>
            {(languageInput.trim() || sort !== "stars" || order !== "desc") && (
              <button
                type="button"
                onClick={() => {
                  setLanguageInput("");
                  setSort("stars");
                  setOrder("desc");
                  onSearch({ sort: "stars", order: "desc", page: 1 });
                }}
                className="text-xs text-[#FF0B55] hover:text-white transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Input Fields Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Languages Input */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Language
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  placeholder="JavaScript, Python, Rust..."
                  className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-200 placeholder-gray-600 hover:border-white/20 transition-colors focus:outline-none focus:border-[#FF0B55]/50 focus:ring-2 focus:ring-[#FF0B55]/20"
                  suppressHydrationWarning
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Sort By
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-left text-gray-200 flex justify-between items-center hover:border-white/20 transition-colors"
                  suppressHydrationWarning
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    {SORT_OPTIONS.find((option) => option.value === sort)?.label ||
                      "Select sort option"}
                  </span>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isSortDropdownOpen && (
                  <div className="absolute z-[1000] mt-2 w-full bg-gray-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                    <div className="p-2 flex gap-2">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSort(option.value);
                            setIsSortDropdownOpen(false);
                          }}
                          className={`flex-1 text-center px-3 py-2.5 text-sm rounded-lg transition-all ${
                            sort === option.value
                              ? "bg-[#FF0B55] text-white font-medium"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                          }`}
                          suppressHydrationWarning
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="group bg-gradient-to-r from-[#FF0B55] to-[#FF0B55]/80 hover:from-[#FF0B55]/90 hover:to-[#FF0B55]/70 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 inline-flex items-center gap-2 hover:shadow-lg hover:shadow-[#FF0B55]/25 hover:scale-105"
              suppressHydrationWarning
            >
              <svg
                className="w-5 h-5 group-hover:rotate-12 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
