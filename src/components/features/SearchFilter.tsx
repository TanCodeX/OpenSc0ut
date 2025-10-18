"use client";

import { useMemo, useState } from "react";
import { SearchParams } from "../../types/types";

interface SearchFilterProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: Partial<SearchParams>;
}

const LANGUAGES = [
  "JavaScript",
  "Python",
  "Java",
  "TypeScript",
  "C#",
  "C++",
  "C",
  "Go",
  "Shell",
  "PHP",
  "HTML",
  "CSS",
  "React",
  "Ruby",
  "Rust",
];

const SORT_OPTIONS = [
  { value: "stars", label: "Stars" },
  { value: "forks", label: "Forks" },
  { value: "updated", label: "Recently Updated" },
];

const FILTER_TABS = [
  { id: "languages", label: "Languages" },
  { id: "sort", label: "Sort" },
  { id: "date", label: "Date" },
  { id: "contributors", label: "Contributors" },
];

export default function SearchFilter({
  onSearch,
  initialParams = {},
}: SearchFilterProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sort, setSort] = useState<string>(initialParams.sort || "stars");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("languages");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      sort,
      order,
      page: 1,
      ...(selectedLanguages.length > 0 && {
        language: selectedLanguages.join(","),
      }),
    });
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const activeFiltersSummary = useMemo(() => {
    const parts: string[] = [];
    if (selectedLanguages.length) parts.push(`${selectedLanguages.length} language${selectedLanguages.length > 1 ? "s" : ""}`);
    if (sort) parts.push(`sort: ${SORT_OPTIONS.find((o) => o.value === sort)?.label || sort}`);
    parts.push(order === "desc" ? "desc" : "asc");
    return parts.join(" · ");
  }, [selectedLanguages, sort, order]);


  return (
    <div className="bg-[hsla(0,1.30%,15.50%,0.44)] border border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Filter Category Tabs */}
        <div className="flex gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              suppressHydrationWarning
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input Fields Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Languages Input */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-black mb-2">
              Looking for
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-gray-500 flex justify-between items-center hover:border-gray-400 transition-colors"
                suppressHydrationWarning
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {selectedLanguages.length
                    ? selectedLanguages.join(", ")
                    : "What to look for?"}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <div className="p-3 flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          selectedLanguages.includes(lang)
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        suppressHydrationWarning
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-black mb-2">
              Sort by
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-gray-500 flex justify-between items-center hover:border-gray-400 transition-colors"
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
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
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
                            : "text-gray-700 hover:bg-gray-100"
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

          {/* Contributors Input */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-black mb-2">
              Contributors
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Select contributors"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                suppressHydrationWarning
              />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
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
