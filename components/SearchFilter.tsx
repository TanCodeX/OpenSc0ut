import { useState } from "react";
import { SearchParams, SortOption } from "../lib/types";

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

const LABELS = [
  { value: "good-first-issue", label: "Good First Issue" },
  { value: "help-wanted", label: "Help Wanted" },
  { value: "hacktoberfest", label: "Hacktoberfest" },
  { value: "bug", label: "Bug" },
  { value: "enhancement", label: "Enhancement" },
  { value: "documentation", label: "Documentation" },
  { value: "beginner-friendly", label: "Beginner Friendly" },
  { value: "up-for-grabs", label: "Up For Grabs" },
  { value: "easy", label: "Easy" },
  { value: "first-timers-only", label: "First Timers Only" },
  { value: "feature", label: "Feature" },
  { value: "high-priority", label: "High Priority" },
  { value: "low-hanging-fruit", label: "Low Hanging Fruit" },
  { value: "question", label: "Question" },
  { value: "needs-help", label: "Needs Help" },
  { value: "discussion", label: "Discussion" },
  { value: "security", label: "Security" },
  { value: "performance", label: "Performance" },
  { value: "ui", label: "UI" },
  { value: "ux", label: "UX" },
  { value: "testing", label: "Testing" },
  { value: "maintenance", label: "Maintenance" },
  { value: "bounty", label: "Bounty" },
  { value: "paid", label: "Paid" },
  { value: "funded", label: "Funded" },
  { value: "bounty-available", label: "Bounty Available" },
  { value: "reward", label: "Reward" },
  { value: "money", label: "Money" },
  { value: "sponsored", label: "Sponsored" },
  { value: "tip", label: "Tip" },
];

const SORT_OPTIONS = [
  { value: "stars", label: "Stars" },
  { value: "forks", label: "Forks" },
  { value: "updated", label: "Recently Updated" },
  { value: "created", label: "Recently Created" },
];

export default function SearchFilter({
  onSearch,
  initialParams = {},
}: SearchFilterProps) {
  const [location, setLocation] = useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [sort, setSort] = useState<string>(initialParams.sort || "stars");
  const [order, setOrder] = useState<"asc" | "desc">(
    initialParams.order || "desc"
  );
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isLabelDropdownOpen, setIsLabelDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create base params with required fields
    const searchParams: SearchParams = {
      sort,
      order,
      page: 1,
    };

    // Add optional fields only if they have values
    if (location.trim()) {
      searchParams.location = location.trim();
    }
    if (selectedLanguages.length > 0) {
      searchParams.language = selectedLanguages.join(",");
    }
    if (selectedLabels.length > 0) {
      searchParams.label = selectedLabels.join(",");
    }

    // Ensure we have some content in the query
    if (!location.trim()) {
      searchParams.location = "india";
    }

    onSearch(searchParams);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md p-6 rounded-lg border border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Row: Languages and Labels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Languages Filter */}
          <div className="flex-1 relative">
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
              <div className="absolute z-10 mt-1 w-full bg-[hsla(0, 1.30%, 15.50%, 0.98)] backdrop-blur-3xl backdrop-filter backdrop-brightness-50 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-md shadow-lg max-h-60 overflow-auto">
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
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Labels Filter */}
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Labels
            </label>
            <button
              type="button"
              onClick={() => setIsLabelDropdownOpen(!isLabelDropdownOpen)}
              className="w-full px-4 py-2 bg-[hsla(0,1.30%,15.50%,0.44)] border border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-md text-left text-white flex justify-between items-center"
              suppressHydrationWarning
            >
              {selectedLabels.length
                ? selectedLabels.join(", ")
                : "Select Labels"}
              <span>▼</span>
            </button>
            {isLabelDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-[hsla(0, 1.30%, 15.50%, 0.98)] backdrop-blur-3xl backdrop-filter backdrop-brightness-50 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="p-2 flex flex-wrap gap-2">
                  {LABELS.map((label) => (
                    <button
                      key={label.value}
                      type="button"
                      onClick={() => toggleLabel(label.value)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedLabels.includes(label.value)
                          ? "bg-[#FF0B55] text-white"
                          : "bg-[hsla(0,1.30%,20.50%,0.44)] text-gray-300 hover:bg-[hsla(0,1.30%,25.50%,0.44)]"
                      }`}
                    >
                      {label.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Second Row: Sort Options and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sort Options */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="w-full px-4 py-2 bg-[hsla(0,1.30%,15.50%,0.44)] border border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-md text-left text-white flex justify-between items-center"
                >
                  {SORT_OPTIONS.find((opt) => opt.value === sort)?.label ||
                    "Sort By"}
                  <span>▼</span>
                </button>
                {isSortDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-[hsla(0, 1.30%, 15.50%, 0.98)] backdrop-blur-3xl backdrop-filter backdrop-brightness-50 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-md shadow-lg">
                    <div className="p-2 flex flex-col gap-1">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSort(option.value);
                            setIsSortDropdownOpen(false);
                          }}
                          className={`px-3 py-1 rounded-md text-sm text-left ${
                            sort === option.value
                              ? "bg-[#FF0B55] text-white"
                              : "bg-[hsla(0,1.30%,20.50%,0.44)] text-gray-300 hover:bg-[hsla(0,1.30%,25.50%,0.44)]"
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
              <button
                type="button"
                onClick={() => setOrder(order === "desc" ? "asc" : "desc")}
                className="px-4 h-[42px] border border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] bg-[hsla(0,1.30%,15.50%,0.44)] rounded-md hover:bg-[hsla(0,1.30%,25.50%,0.44)] text-white"
                suppressHydrationWarning
              >
                {order === "desc" ? "↓" : "↑"}
              </button>
            </div>
          </div>

          {/* Location Input */}
          <div className="flex-1">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Location (optional)
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={handleLocationChange}
              placeholder="Leave empty to search globally"
              className="w-full px-4 py-2 bg-[hsla(0,1.30%,15.50%,0.44)] border border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF0B55] focus:border-[#FF0B55] text-white"
              aria-required="false"
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Search Button - Centered */}
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
