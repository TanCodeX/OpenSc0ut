"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 pb-3">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-xl px-5 py-3 border border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md transition-all duration-300">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">OpenSc0ut</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10 text-sm">
            {/* Regular Links */}
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
            >
              About
            </Link>

            <Link
              href="/languages"
              className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
            >
              Languages
            </Link>

            <Link
              href="/topics"
              className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
            >
              Topics
            </Link>
          </nav>

          {/* Right Side - GitHub */}
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FF0B55] hover:bg-[#e00a4c] text-white px-3 py-2 text-sm rounded-lg transition-colors duration-200"
            >
              Open GitHub
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
