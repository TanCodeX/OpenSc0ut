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
    <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Input Fields Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Languages Input */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-white mb-2">
              Languages
            </label>
            <div className="relative">
              <input
                type="text"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                placeholder="Enter language (e.g., JavaScript, Python, Java)"
                className="w-full pl-12 pr-4 py-3 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-lg text-gray-300 placeholder-gray-500 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                suppressHydrationWarning
              />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-white mb-2">
              Sort by
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="w-full px-4 py-3 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-lg text-left text-gray-300 flex justify-between items-center hover:border-gray-500 transition-colors"
                suppressHydrationWarning
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  {SORT_OPTIONS.find((option) => option.value === sort)?.label ||
                    "Select sort option"}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isSortDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-black/30 backdrop-blur-md border border-[hsla(0,1.10%,36.10%,0.44)] rounded-lg shadow-lg">
                  <div className="p-2">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSort(option.value);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                          sort === option.value
                            ? "bg-black text-white"
                            : "text-gray-300 hover:bg-black/50"
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
          <div className="flex items-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#FF0B55] text-white font-semibold rounded-lg hover:bg-[#e00a4c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50"
              suppressHydrationWarning
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
