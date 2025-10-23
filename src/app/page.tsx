"use client";

import { SearchParams } from "../types/types";
import { useRepositories, useScrollAnimation } from "../lib/hooks";
import {
  Header,
  SearchFilter,
  RepositoryCard,
  Pagination,
  GlobalCursor, // <-- 1. IMPORT IT HERE
} from "../components";
import AnimatedText from "../components/ui/AnimatedText";

export default function Home() {
  const initialParams: SearchParams = {
    sort: "stars",
    order: "desc",
    page: 1,
  };

  const {
    repositories,
    loading,
    error,
    totalCount,
    searchParams,
    handleSearch,
    handlePageChange,
  } = useRepositories(initialParams);

  // Use scroll animation hook
  const { heroRef, contentRef } = useScrollAnimation();

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / 12); // 12 items per page

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <GlobalCursor targetRef={heroRef} /> {/* <-- 2. ADD IT HERE */}

      <main>
        {/* Hero Section */}
        <div
          ref={heroRef} // <-- 3. THIS REF IS PASSED TO GLOBALCURSOR
          className="relative h-screen flex justify-center items-center overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pb-32">
            <div className="hero-content bg-black bg-opacity-95 backdrop-blur-sm py-12 px-8 rounded-lg flex flex-col items-center justify-center text-center">
              {/* Search Prompt */}
              <div className="flex justify-center mb-8 rotating-border-glow">
                <div className="bg-black bg-opacity-95 backdrop-blur-md border border-white border-opacity-20 rounded-full px-4 py-2 flex items-center space-x-3 max-w-sm ">
                  {/* ... (rest of hero content) ... */}
                  <svg
                    className="w-4 h-4 text-white flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {/* Text */}
                  <span className="text-white text-base font-extralight flex-1 text-center">
                    Find. Contribute. Repeat.
                  </span>
                  {/* Right arrow button */}
                  <button className="bg-white rounded-full p-1.5 flex-shrink-0 hover:bg-gray-100 transition-colors">
                    <svg
                      className="w-3 h-3 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl text-center mb-8 leading-tight">
                Introducing{" "}
                <AnimatedText text="OpenSc0ut" className="font-extrabold" />
              </h1>
              {/* Subheading */}
              <p className="text-lg text-center text-gray-400 mb-8 max-w-2xl">
                Find your next project, make your first commit, and grow as a
                developer — all in one place.
              </p>
            </div>
          </div>
          {/* Scroll Indicator */}
          <div className="scroll-indicator absolute bottom-24 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-gray-400 text-sm">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          ref={contentRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12"
        >
          {/* ... (rest of the page) ... */}
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

       <footer className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Information - Wider Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-white rounded-sm mr-3 flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">OpenSc0ut</h3>
              </div>
              <div className="text-gray-400 text-sm mb-6">
                <p>Find your next project, make your first commit,</p>
                <p>and grow as a developer — all in one place.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white">tanmaypatwary@gmail.com</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">GitHub</p>
                  <p className="text-white">github.com/TanCodeX</p>
                </div>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Quick links</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About us</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/contact-us" className="hover:text-white transition-colors">Contact us</a></li>
              </ul>
            </div>
            {/* Social */}
            <div>
              <h4 className="text-white font-semibold mb-6">Social</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="https://github.com/TanCodeX" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://x.com/TanCodeX" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="https://www.linkedin.com/in/tanmaypatwary" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of service</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy policy</a></li>
                <li><a href="/cookies" className="hover:text-white transition-colors">Cookie policy</a></li>
                <li><a href="/license" className="hover:text-white transition-colors">MIT License</a></li>
              </ul>
            </div>
          </div>
        </div> {/* <-- This </div> now closes the max-w-7xl container */}

        {/* Bottom Border is now outside the container, so it's full-width */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          {/* Re-add the container here to keep the text centered */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400 text-sm">
              © 2024 OpenSc0ut. Built with Next.js and GitHub API.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}