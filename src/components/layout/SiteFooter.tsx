"use client";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-gray-200 dark:border-white/10 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-950">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-[#FF0B55]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF0B55] to-[#ff6b9d] flex items-center justify-center shadow-lg shadow-[#FF0B55]/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <h3 className="text-[1.25rem] font-extrabold tracking-tight">
                <span className="text-gray-900 dark:text-white">
                  Open
                </span>
                <span className="bg-gradient-to-r from-[#FF0B55] via-[#ff4d85] to-[#ff9bc0] bg-clip-text text-transparent">
                  Sc0ut
                </span>
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-sm">
              Discover, contribute, and grow with open source projects from around the world.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/TanCodeX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-[#FF0B55] hover:text-[#FF0B55] transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/tanmaypatwary"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-[#FF0B55] hover:text-[#FF0B55] transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-[#FF0B55] dark:hover:text-[#FF0B55] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-[#FF0B55] dark:hover:text-[#FF0B55] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/gsoc" className="text-gray-600 dark:text-gray-400 hover:text-[#FF0B55] dark:hover:text-[#FF0B55] transition-colors">
                  GSOC
                </a>
              </li>
              <li>
                <a href="/ai-repo" className="text-gray-600 dark:text-gray-400 hover:text-[#FF0B55] dark:hover:text-[#FF0B55] transition-colors">
                  Repo Scout
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-5">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/contact-us" className="text-gray-600 dark:text-gray-400 hover:text-[#FF0B55] dark:hover:text-[#FF0B55] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-5">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                tanmaypatwary@gmail.com
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} OpenSc0ut. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
