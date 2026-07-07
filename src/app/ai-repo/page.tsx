"use client";

import { SitePageHero } from "../../components";

export default function AIRepoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <main>
        <SitePageHero
          badge="AI tools"
          title={
            <>
              <span className="text-[#FF0B55]">AI</span> repository scout
            </>
          }
          description="Paste a GitHub URL and get a structured health and quality snapshot — same visual language as the rest of OpenSc0ut."
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-8 relative z-10 flex flex-col items-center text-center">
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF0B55]/10 to-transparent blur-3xl -z-10 rounded-3xl" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Under Development 🚧
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
              We are currently working hard to bring you the best AI repository analysis tools. Please check back later!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
