"use client";

import { useState, useEffect } from "react";
import { searchRepositories } from "../lib/github-api";
import { Repository, SearchParams } from "../lib/types";
import Header from "../components/Header";
import SearchFilter from "../components/SearchFilter";
import RepositoryCard from "../components/RepositoryCard";
import Pagination from "../components/Pagination";
import Link from "next/link";

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: "",
    language: "",
    label: "",
    sort: "stars",
    order: "desc",
    page: 1,
  });

  const fetchRepositories = async (params: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const { items, total_count } = await searchRepositories(params);
      setRepositories(items);
      setTotalCount(Math.min(total_count, 1000)); // GitHub API limits to 1000 results
    } catch (err) {
      setError("Failed to fetch repositories. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories(searchParams);
  }, [searchParams.page]);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    fetchRepositories(params);
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / 10); // 10 items per page

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-28">
        {/* Hero Section */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="bg-black bg-opacity-95 backdrop-blur-sm py-16 px-8 rounded-lg">
              <h1 className="text-5xl md:text-7xl text-center mb-8">
                Introducing <span className="font-extrabold">OpenSc0ut</span>
              </h1>

              {/* Subheading */}
              <p className="text-2xl text-center text-gray-300 mb-3">
                Find. Contribute. Repeat.
              </p>
              <p className="text-lg text-center text-gray-400 mb-16 whitespace-nowrap">
                Find your next project, make your first commit, and grow as a
                developer — all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SearchFilter onSearch={handleSearch} initialParams={searchParams} />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF0B55]"></div>
            </div>
          ) : error ? (
            <div className="bg-gray-900 border border-red-800 text-red-400 px-4 py-3 rounded-md">
              {error}
            </div>
          ) : repositories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-300 text-lg">
                No repositories found matching your criteria.
              </p>
              <p className="text-gray-400">
                Try adjusting your search filters.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-4">
                Showing {repositories.length} of {totalCount.toLocaleString()}{" "}
                repositories
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repositories.map((repo) => (
                  <RepositoryCard key={repo.id} repository={repo} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10">
                  <Pagination
                    currentPage={searchParams.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-t border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            Built with Next.js and GitHub API. OpenSc0ut helps developers find
            open source projects to contribute to.
          </p>
        </div>
      </footer>
    </div>
  );
}
