import { useMemo, useState } from "react";
import { SearchParams } from "../lib/types";

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

export default function SearchFilter({
  onSearch,
  initialParams = {},
}: SearchFilterProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sort, setSort] = useState<string>(initialParams.sort || "stars");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

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
    <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md p-6 rounded-lg border border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] mb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-start justify-between">
          <h3 className="text-base font-semibold text-gray-200">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Languages Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Languages
            </label>
            <button
              type="button"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="w-full px-4 py-2 bg-[hsla(0,1.30%,15.50%,0.44)] border border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-md text-left text-white flex justify-between items-center"
              suppressHydrationWarning
            >
              {selectedLanguages.length
                ? selectedLanguages.join(", ")
                : "Select Languages"}
              <span>▼</span>
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-[hsla(0,1.30%,15.50%,0.98)] backdrop-blur-3xl border border-[hsla(0,1.10%,36.10%,0.44)] rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="p-2 flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedLanguages.includes(lang)
                          ? "bg-[#FF0B55] text-white"
                          : "bg-[hsla(0,1.30%,20.50%,0.44)] text-gray-300 hover:bg-[hsla(0,1.30%,25.50%,0.44)]"
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

          {/* Sort Options */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <button
              type="button"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="w-full px-4 py-2 bg-[hsla(0,1.30%,15.50%,0.44)] border border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-md text-left text-white flex justify-between items-center"
              suppressHydrationWarning
            >
              {SORT_OPTIONS.find((option) => option.value === sort)?.label ||
                "Sort By"}
              <span>▼</span>
            </button>
            {isSortDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-[hsla(0,1.30%,15.50%,0.98)] backdrop-blur-3xl border border-[hsla(0,1.10%,36.10%,0.44)] rounded-md shadow-lg">
                <div className="p-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSort(option.value);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm rounded-md ${
                        sort === option.value
                          ? "bg-[#FF0B55] text-white"
                          : "text-gray-300 hover:bg-[hsla(0,1.30%,20.50%,0.44)]"
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
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="px-8 py-2.5 bg-[#FF0B55] text-black font-semibold rounded-full border-2 border-transparent hover:bg-black hover:text-white hover:border-[#FF0B55] hover:shadow-[0_0_15px_rgba(255,11,85,0.5)] focus:outline-none transition-all duration-100 ease-out"
            suppressHydrationWarning
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
