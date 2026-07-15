"use client";

import { SearchParams } from "../types/types";
import { useRepositories, useScrollAnimation } from "../lib/hooks";
import {
  SearchFilter,
  RepositoryCard,
  Pagination,
  GlobalCursor,
} from "../components";
import AnimatedText from "../components/ui/AnimatedText";
import RateLimitTimer from "../components/ui/RateLimitTimer";
import HeroCards from "../components/ui/HeroCards";

export default function Home() {
  const initialParams: SearchParams = {
    sort: "stars",
    order: "desc",
    page: 1,
    per_page: 12,
  };

  const {
    repositories,
    loading,
    error,
    resetTime,
    totalCount,
    searchParams,
    handleSearch,
    handlePageChange,
  } = useRepositories(initialParams);

  // Use scroll animation hook
  const { heroRef, contentRef } = useScrollAnimation();

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / (searchParams.per_page || 12));

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <GlobalCursor targetRef={heroRef} />

      <main>
        {/* Hero Section - Modern Grid Design */}
        <div
          ref={heroRef}
          className="relative min-h-screen flex justify-center items-center overflow-hidden"
        >
          {/* Animated Grid Background */}
          <div className="absolute inset-0 z-0">
            {/* Main grid - more visible */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}
            />

            {/* Secondary finer grid */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 11, 85, 0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 11, 85, 0.08) 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px'
              }}
            />

            {/* Glowing gradient orbs */}
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#FF0B55]/25 rounded-full blur-[128px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#FF0B55]/15 rounded-full blur-[128px] animate-pulse delay-1000" />


            {/* Floating grid particles */}
            <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-[#FF0B55]/60 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-[#FF0B55]/60 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-black/20 dark:bg-white/40 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          </div>

          {/* Content Container */}
          <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-[#FF0B55]/30 backdrop-blur-sm shadow-lg shadow-[#FF0B55]/10">
                  <span className="w-2 h-2 bg-[#FF0B55] rounded-full animate-ping" />
                  <span className="w-2 h-2 bg-[#FF0B55] rounded-full absolute" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Now Live</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                  <span className="block text-gray-600 dark:text-gray-400 text-3xl md:text-4xl mb-2 font-light">Introducing</span>
                  <AnimatedText text="OpenSc0ut" className="text-gray-900 dark:text-white" />
                </h1>

                {/* Subheading */}
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">
                  Your ultimate destination for discovering, analyzing, and contributing to the most impactful open-source projects worldwide.
                </p>

                {/* Search Prompt Pill */}
                <div className="flex justify-center lg:justify-start">
                  <div className="rotating-border-glow">
                    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md border border-gray-200 dark:border-white/20 rounded-full px-5 py-3 flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-[#FF0B55] flex-shrink-0"
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
                      <span className="text-gray-900 dark:text-white text-sm font-medium">
                        Find. Contribute. Repeat.
                      </span>
                      <button
                        onClick={() => {
                          contentRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="ml-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FF0B55]/10 text-[#FF0B55] hover:bg-[#FF0B55]/20 transition-colors"
                      >
                        Explore Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Grid Cards (GSAP animated) */}
              <HeroCards />
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-gray-500 text-xs uppercase tracking-widest">Scroll to explore</span>
              <div className="w-6 h-10 border border-gray-700 rounded-full flex justify-center">
                <div className="w-1 h-2 bg-[#FF0B55] rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          ref={contentRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-24 relative z-10"
        >
          {/* Section Header */}
          <div className="mb-12 relative">
            {/* Ambient glow */}
            <div className="absolute -top-8 left-0 w-96 h-48 bg-[#FF0B55]/15 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute -top-4 left-40 w-64 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF0B55]/10 border border-[#FF0B55]/25 backdrop-blur-sm mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0B55] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF0B55]" />
              </span>
              <span className="text-xs font-semibold text-[#FF0B55] uppercase tracking-widest">Live Data</span>
            </div>

            <div className="flex items-end gap-4 mb-4">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">Trending&nbsp;</span>
                <span className="bg-gradient-to-r from-[#FF0B55] via-[#ff4d85] to-[#ff9bc0] bg-clip-text text-transparent">Repositories</span>
              </h2>
            </div>
            <p className="text-gray-500 max-w-xl text-sm leading-relaxed">
              Discover the most popular and actively maintained projects from the community
            </p>
          </div>

          {/* Search Filter */}
          <div className="mb-10">
            <SearchFilter onSearch={handleSearch} initialParams={searchParams} />
          </div>

          {/* Stats Bar */}
          {!loading && !error && repositories.length > 0 && (
            <div className="mb-8 relative group">
              {/* Subtle glow behind bar */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#FF0B55]/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative flex flex-wrap items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-[#0d0d0d]/80 border border-white/[0.07] backdrop-blur-sm">
                <div className="flex items-center gap-5">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">Showing</p>
                    <p className="text-2xl font-extrabold text-white tabular-nums">{repositories.length}</p>
                  </div>
                  <div className="w-px h-9 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
                  <div className="text-center">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">Total</p>
                    <p className="text-2xl font-extrabold bg-gradient-to-r from-[#FF0B55] to-[#ff9bc0] bg-clip-text text-transparent tabular-nums">{totalCount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="text-xs text-gray-500 tabular-nums">Page <span className="text-gray-300 font-semibold">{searchParams.page}</span> of <span className="text-gray-300 font-semibold">{totalPages}</span></span>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-white/10" />
                    <div className="w-20 h-6 rounded-full bg-gray-200 dark:bg-white/10" />
                  </div>
                  <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-white/10 mb-2" />
                  <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/10 mb-2" />
                  <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-white/10 mb-4" />
                  <div className="flex gap-2">
                    <div className="w-16 h-6 rounded bg-gray-200 dark:bg-white/10" />
                    <div className="w-16 h-6 rounded bg-gray-200 dark:bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-300 mb-2">Something went wrong</h3>
              <p className="text-red-500 dark:text-red-400/80 text-sm mb-4">{error}</p>
              
              {resetTime && <RateLimitTimer resetTime={resetTime} />}

              <button
                onClick={() => window.location.reload()}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 dark:border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors ${resetTime ? 'mt-6' : ''}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          ) : repositories.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No repositories found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
              <button
                onClick={() => handleSearch({ sort: "stars", order: "desc", page: 1, per_page: 12 })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF0B55] text-white font-medium hover:bg-[#FF0B55]/90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repositories.map((repo, index) => (
                  <div
                    key={repo.id}
                    className="group relative rounded-2xl border border-gray-200 dark:border-white/10 bg-gradient-to-br from-gray-50 dark:from-white/5 to-transparent p-6 backdrop-blur-sm hover:border-[#FF0B55]/50 hover:shadow-lg hover:shadow-[#FF0B55]/10 transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF0B55]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                    {/* Card Content */}
                    <div className="relative z-10">
                      <RepositoryCard repository={repo} />
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
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
    </div>
  );
}