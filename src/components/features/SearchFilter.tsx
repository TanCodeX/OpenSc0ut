"use client";

import { useMemo, useState } from "react";
import { SearchParams } from "../../types/types";

interface SearchFilterProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: Partial<SearchParams>;
  searchLabel?: string;
  searchPlaceholder?: string;
}

const SORT_OPTIONS = [
  { value: "stars", label: "Stars", icon: "★" },
  { value: "forks", label: "Forks", icon: "⑂" },
  { value: "updated", label: "Recently Updated", icon: "↻" },
];

export default function SearchFilter({
  onSearch,
  initialParams = {},
  searchLabel = "Language",
  searchPlaceholder = "JavaScript, Python, Rust...",
}: SearchFilterProps) {
  const [languageInput, setLanguageInput] = useState<string>("");
  const [sort, setSort] = useState<string>(initialParams.sort || "stars");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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

  const hasCustomFilters = languageInput.trim() || sort !== "stars" || order !== "desc";

  return (
    <div className="relative group z-50 rounded-2xl">
      {/* Animated gradient border */}
      <div
        className={`absolute -inset-px rounded-2xl transition-opacity duration-500 ${
          isFocused ? "opacity-100" : "opacity-40 group-hover:opacity-70"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(255,11,85,0.6) 0%, rgba(139,92,246,0.4) 50%, rgba(255,11,85,0.2) 100%)",
          borderRadius: "inherit",
        }}
      />

      {/* Inner glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FF0B55]/20 via-purple-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

      <div className="relative bg-[#0d0d0d]/95 backdrop-blur-2xl border border-white/[0.06] rounded-2xl p-6 shadow-2xl">
        <form onSubmit={handleSubmit}>
          {/* Top strip: active filters + reset */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              {/* Filter icon */}
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF0B55]/20 to-[#FF0B55]/5 border border-[#FF0B55]/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
                {activeFiltersSummary}
              </span>
            </div>

            {hasCustomFilters && (
              <button
                type="button"
                onClick={() => {
                  setLanguageInput("");
                  setSort("stars");
                  setOrder("desc");
                  onSearch({ sort: "stars", order: "desc", page: 1 });
                }}
                className="text-[11px] text-[#FF0B55] hover:text-white font-semibold transition-all duration-200 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF0B55]/10 hover:bg-[#FF0B55]/20 border border-[#FF0B55]/20 hover:border-[#FF0B55]/40"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reset
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-6" />

          {/* Fields row */}
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Language Input */}
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-widest">
                {searchLabel}
              </label>
              <div className="relative rounded-xl">
                {/* Focus glow */}
                <div
                  className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${
                    isFocused ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    boxShadow: "0 0 0 1px rgba(255,11,85,0.4), 0 0 16px rgba(255,11,85,0.15)",
                    borderRadius: "inherit",
                  }}
                />
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <svg
                    className={`w-4 h-4 transition-colors duration-300 ${isFocused ? "text-[#FF0B55]" : "text-gray-600"}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-gray-200 placeholder-gray-700 focus:outline-none hover:border-white/15 focus:border-[#FF0B55]/40 transition-all duration-300 text-sm"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Sort + Order */}
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-widest">
                Sort By
              </label>
              <div className="flex gap-2">
                {/* Sort dropdown */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-left text-gray-200 flex justify-between items-center hover:border-white/15 focus:border-[#FF0B55]/40 transition-all duration-300 focus:outline-none text-sm"
                    suppressHydrationWarning
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                      <span className="text-gray-300">
                        {SORT_OPTIONS.find((o) => o.value === sort)?.label || "Sort option"}
                      </span>
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isSortDropdownOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isSortDropdownOpen && (
                    <div className="absolute z-[1000] mt-2 w-full bg-[#0d0d0d]/98 border border-white/[0.08] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl">
                      <div className="p-1.5 flex flex-col gap-0.5">
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setSort(option.value);
                              setIsSortDropdownOpen(false);
                            }}
                            className={`text-left px-3 py-2.5 text-sm rounded-lg transition-all flex items-center gap-3 ${
                              sort === option.value
                                ? "bg-[#FF0B55]/15 text-[#FF0B55] font-semibold border border-[#FF0B55]/20"
                                : "text-gray-500 hover:bg-white/[0.05] hover:text-gray-200"
                            }`}
                            suppressHydrationWarning
                          >
                            <span className="text-base leading-none">{option.icon}</span>
                            {option.label}
                            {sort === option.value && (
                              <svg className="ml-auto w-3.5 h-3.5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order toggle */}
                <button
                  type="button"
                  onClick={() => setOrder(order === "desc" ? "asc" : "desc")}
                  className={`px-3.5 py-3 rounded-xl border transition-all duration-300 focus:outline-none flex items-center justify-center group ${
                    order === "asc"
                      ? "bg-[#FF0B55]/10 border-[#FF0B55]/30 text-[#FF0B55]"
                      : "bg-white/[0.04] border-white/[0.08] text-gray-500 hover:text-gray-200 hover:border-white/15"
                  }`}
                  title={`Sort ${order === "desc" ? "Descending" : "Ascending"}`}
                  suppressHydrationWarning
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${order === "asc" ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
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
                className="w-full lg:w-auto relative overflow-hidden group/btn bg-gradient-to-r from-[#FF0B55] to-[#cc0944] text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(255,11,85,0.35)] hover:shadow-[0_0_36px_rgba(255,11,85,0.55)] hover:scale-[1.03] active:scale-[0.98] text-sm"
                suppressHydrationWarning
              >
                {/* Shine sweep */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
                <svg
                  className="w-4 h-4 relative z-10"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="relative z-10">Search</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
