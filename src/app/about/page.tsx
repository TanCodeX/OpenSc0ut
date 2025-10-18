"use client";

import { Header } from "../../components";
import Link from "next/link";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-28">
        {/* Hero Section */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg py-16 px-8"
            >
              <h1 className="text-5xl md:text-7xl text-center mb-8 font-extrabold">
                About <span className="text-[#FF0B55]">OpenSc0ut</span>
              </h1>
              <p className="text-2xl text-center text-gray-300 mb-3">
                Discover. Contribute. Grow.
              </p>
              <p className="text-lg text-center text-gray-400 mb-2">
                Your gateway to meaningful open source contributions and developer growth.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                What is OpenSc0ut?
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                OpenSc0ut is a platform designed to help developers find meaningful open-source projects 
                where they can contribute and grow their skills. Our mission is to connect developers with 
                projects that match their interests and skill levels, fostering collaboration within the 
                global developer community.
              </p>

              <h3 className="text-2xl font-semibold text-white mt-8 mb-4">
                How It Works
              </h3>
              <p className="text-gray-300 mb-4">
                We use the GitHub API to search for repositories and help you discover projects by:
              </p>
              <ul className="list-none space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-[#FF0B55] mr-3 mt-1">•</span>
                  <span className="text-gray-300">Programming language filtering (JavaScript, Python, Java, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF0B55] mr-3 mt-1">•</span>
                  <span className="text-gray-300">Sorting by stars, forks, or recent activity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF0B55] mr-3 mt-1">•</span>
                  <span className="text-gray-300">Advanced search capabilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF0B55] mr-3 mt-1">•</span>
                  <span className="text-gray-300">Easy pagination through results</span>
                </li>
              </ul>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-semibold text-white mb-6">
                Why Contribute to Open Source?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#FF0B55] rounded-full p-2 mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Gain Real-World Experience</h4>
                    <p className="text-gray-300 text-sm">Work on actual projects used by thousands of developers</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#FF0B55] rounded-full p-2 mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Build Your Portfolio</h4>
                    <p className="text-gray-300 text-sm">Showcase your contributions to potential employers</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#FF0B55] rounded-full p-2 mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Learn from Experts</h4>
                    <p className="text-gray-300 text-sm">Collaborate with experienced developers and learn best practices</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#FF0B55] rounded-full p-2 mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Join a Community</h4>
                    <p className="text-gray-300 text-sm">Connect with like-minded developers worldwide</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Technical Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg p-8 mt-8"
          >
            <h3 className="text-2xl font-semibold text-white mb-6">
              Technical Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">GitHub API Integration</h4>
                <p className="text-gray-300 mb-4">
                  This project uses the GitHub API to fetch repository data. Please note the rate limits:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-[#FF0B55] mr-2">•</span>
                    <span className="text-gray-300">Unauthenticated: 60 requests/hour</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#FF0B55] mr-2">•</span>
                    <span className="text-gray-300">Authenticated: 5,000 requests/hour</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Built With</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#FF0B55] text-white px-3 py-1 rounded-full text-sm">Next.js</span>
                  <span className="bg-[#FF0B55] text-white px-3 py-1 rounded-full text-sm">TypeScript</span>
                  <span className="bg-[#FF0B55] text-white px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
                  <span className="bg-[#FF0B55] text-white px-3 py-1 rounded-full text-sm">Framer Motion</span>
                  <span className="bg-[#FF0B55] text-white px-3 py-1 rounded-full text-sm">GSAP</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-[#FF0B55] hover:bg-[#e00a4c] text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Start Exploring Projects
            </Link>
          </motion.div>
        </div>
      </main>

      <footer className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-t border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] py-8 mt-8">
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
