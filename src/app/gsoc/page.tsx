"use client";

import React, { useMemo, useState } from "react";
import { SitePageHero, SearchFilter, OrgList } from "../../components";
import { ORGS } from "../../data/orgs";
import { SearchParams } from "../../types/types";

export default function GsocPage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    sort: "stars",
    order: "desc",
    page: 1,
  });

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  const filteredOrgs = useMemo(() => {
    let result = [...ORGS];

    // Filter by search term (using the 'language' field from SearchFilter as a general query)
    if (searchParams.language) {
      const query = searchParams.language.toLowerCase();
      result = result.filter(
        (org) =>
          org.name.toLowerCase().includes(query) ||
          org.category.toLowerCase().includes(query) ||
          org.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort the organizations (alphabetically by name as a fallback since stats are fetched client-side)
    // Realistically, sorting by stars/forks would require all stats to be pre-fetched, 
    // so we sort by name for now, or just reverse the array for 'desc' vs 'asc'.
    result.sort((a, b) => {
      // Prioritize organizations that have a githubRepo linked
      if (a.githubRepo && !b.githubRepo) return -1;
      if (!a.githubRepo && b.githubRepo) return 1;

      if (searchParams.order === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    return result;
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300">
      <main>
        <SitePageHero
          badge="GSoC Organisations"
          title={
            <>
              <span className="text-[#FF0B55]">Organizations</span>
            </>
          }
          description="Browse and filter GSoC 2026 organizations by tech stack, difficulty level, and interests to discover projects that match your skills and goals."
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-10">
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF0B55]/10 to-transparent blur-3xl -z-10" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-[#FF0B55] rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Browse Organizations</h2>
            </div>
            <p className="text-gray-400 max-w-2xl">
              Search by organization name, category, or technologies to find the perfect match.
            </p>
          </div>

          <div className="mb-10">
            <SearchFilter 
              onSearch={handleSearch} 
              initialParams={searchParams} 
              searchLabel="Search Organizations"
              searchPlaceholder="Organization Name, Category, or Tags..."
              hideSort={true}
            />
          </div>

          <OrgList orgs={filteredOrgs} />
        </div>
      </main>
    </div>
  );
}
