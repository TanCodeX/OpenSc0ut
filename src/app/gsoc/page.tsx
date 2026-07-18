"use client";

import React, { useMemo, useState, useRef } from "react";
import { SearchFilter, OrgList, PageGridBackground, GsocAIAdvisor } from "../../components";
import { ORGS } from "../../data/orgs";
import { SearchParams } from "../../types/types";
import { motion, useScroll, useTransform } from "framer-motion";

export default function GsocPage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    sort: "stars",
    order: "desc",
    page: 1,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  const filteredOrgs = useMemo(() => {
    let result = [...ORGS];

    const yearToFilter = searchParams.year ? parseInt(searchParams.year) : 2026;
    result = result.filter(org => org.years?.includes(yearToFilter));

    if (searchParams.language) {
      const query = searchParams.language.toLowerCase();
      result = result.filter(
        (org) =>
          org.name.toLowerCase().includes(query) ||
          org.category.toLowerCase().includes(query) ||
          org.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [searchParams]);

  const totalOrgs = ORGS.length;
  const orgs2026 = ORGS.filter(o => o.years?.includes(2026)).length;

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white transition-colors duration-300 overflow-x-hidden">
      <main>

        {/* ─── HERO ─── */}
        <div className="relative min-h-[75vh] flex items-center overflow-hidden">
          <PageGridBackground />

          {/* Radial glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] rounded-full bg-[#FF0B55]/10 blur-[120px] animate-pulse" />
          </div>

          {/* Floating orbs */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10vh] right-20 w-32 h-32 rounded-full bg-gradient-to-br from-[#FF0B55]/20 to-transparent border border-[#FF0B55]/20 blur-sm hidden lg:block"
          />
          <motion.div
            animate={{ y: [0, 16, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[55vh] left-16 w-20 h-20 rounded-full bg-gradient-to-br from-[#FF0B55]/15 to-transparent border border-[#FF0B55]/15 blur-sm hidden lg:block"
          />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-32">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-[#FF0B55]/30 backdrop-blur-sm mb-8 shadow-lg shadow-[#FF0B55]/10"
              >
                <span className="w-2 h-2 bg-[#FF0B55] rounded-full animate-ping" />
                <span className="w-2 h-2 bg-[#FF0B55] rounded-full absolute" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">GSoC Organisations</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 font-extrabold tracking-tight">
                <span className="text-white">Find Your </span>
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0B55] via-[#ff4d7d] to-[#FF0B55] bg-[length:200%] animate-[gradientShift_3s_ease_infinite]">
                    GSoC Org
                  </span>
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF0B55] to-transparent" />
                </span>
              </h1>

              <p className="text-2xl text-gray-600 dark:text-gray-300 mb-10 font-light tracking-wide">
                Discover. Filter. <span className="text-[#FF0B55] font-semibold">Contribute.</span>
              </p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex items-center justify-center gap-10 mb-6"
              >
                {[
                  { value: `${orgs2026}`, label: "Orgs in 2026" },
                  { value: `${totalOrgs}+`, label: "Total Orgs" },
                  { value: "5", label: "Years of Data" },
                ].map(({ value, label }, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-extrabold text-white">{value}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Scroll cue */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-12 flex flex-col items-center gap-2 text-gray-400"
              >
                <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-4 relative z-20">

          <GsocAIAdvisor />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#FF0B55] to-[#FF0B55]/30 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Browse Organizations</h2>
              <span className="ml-auto text-sm text-gray-500">{filteredOrgs.length} results</span>
            </div>
            <p className="text-gray-400 max-w-2xl pl-4">
              Search by organization name, category, or technologies to find the perfect match.
            </p>
          </motion.div>

          <div className="mb-8">
            <SearchFilter
              onSearch={handleSearch}
              initialParams={{ ...searchParams, year: searchParams.year || "2026" }}
              searchLabel="Search Organizations"
              searchPlaceholder="Organization Name, Category, or Tags..."
              hideSort={true}
              showYearFilter={true}
              hidePerPage={true}
            />
          </div>

          <OrgList orgs={filteredOrgs} />
        </div>
      </main>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}
