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
    <div className="relative group z-50">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF0B55]/30 to-purple-500/30 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition duration-500" />

      <div className="relative bg-gray-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Active Filters Summary */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="p-1.5 rounded-full bg-[#FF0B55]/10 text-[#FF0B55]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <span className="font-medium tracking-wide uppercase">{activeFiltersSummary}</span>
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
                className="text-xs text-[#FF0B55] hover:text-[#ff477c] font-medium transition-colors underline-offset-4 hover:underline flex items-center gap-1"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Input Fields Row */}
          <div className="flex flex-col lg:flex-row gap-5 items-end">
            {/* Languages Input */}
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Language
              </label>
              <div className="relative group/input">
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  placeholder="JavaScript, Python..."
                  className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#FF0B55]/50 focus:ring-1 focus:ring-[#FF0B55]/50 transition-all duration-300 group-hover/input:border-white/20"
                  suppressHydrationWarning
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 group-hover/input:text-[#FF0B55]/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort Options with Order Toggle */}
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Sort By
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-left text-gray-200 flex justify-between items-center hover:border-white/20 transition-all duration-300 focus:outline-none focus:border-[#FF0B55]/50 focus:ring-1 focus:ring-[#FF0B55]/50"
                    suppressHydrationWarning
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                      {SORT_OPTIONS.find((option) => option.value === sort)?.label || "Select sort option"}
                    </span>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isSortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isSortDropdownOpen && (
                    <div className="absolute z-[1000] mt-2 w-full bg-gray-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2 flex flex-col gap-1">
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setSort(option.value);
                              setIsSortDropdownOpen(false);
                            }}
                            className={`text-left px-3 py-2.5 text-sm rounded-lg transition-all ${
                              sort === option.value
                                ? "bg-[#FF0B55]/20 text-[#FF0B55] font-semibold"
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

                {/* Order Toggle Button */}
                <button
                  type="button"
                  onClick={() => setOrder(order === "desc" ? "asc" : "desc")}
                  className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-200 hover:border-white/20 hover:bg-white/5 transition-all duration-300 focus:outline-none focus:border-[#FF0B55]/50 focus:ring-1 focus:ring-[#FF0B55]/50 flex items-center justify-center group"
                  title={`Sort ${order === "desc" ? "Descending" : "Ascending"}`}
                  suppressHydrationWarning
                >
                  <svg 
                    className={`w-5 h-5 text-gray-500 group-hover:text-[#FF0B55] transition-transform duration-300 ${order === "asc" ? "rotate-180" : ""}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full lg:w-auto">
              <button
                type="submit"
                className="w-full lg:w-auto group bg-gradient-to-r from-[#FF0B55] to-[#ff477c] hover:from-[#e50a4c] hover:to-[#ff336a] text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,11,85,0.3)] hover:shadow-[0_0_30px_rgba(255,11,85,0.5)] hover:scale-105 active:scale-95"
                suppressHydrationWarning
              >
                <svg
                  className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
