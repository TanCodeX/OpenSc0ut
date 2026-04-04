"use client";

import { PageGridBackground } from "../../components";
import Link from "next/link";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        {/* Hero Section with Grid Background */}
        <div className="relative min-h-[60vh] flex items-center overflow-hidden">
          <PageGridBackground />

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
                <span className="w-2 h-2 bg-[#FF0B55] rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">About Us</span>
              </div>
              <h1 className="text-5xl md:text-7xl mb-6 font-extrabold">
                About <span className="text-[#FF0B55]">OpenSc0ut</span>
              </h1>
              <p className="text-2xl text-gray-300 mb-2 font-light">
                Discover. Contribute. Grow.
              </p>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Your gateway to meaningful open source contributions and developer growth.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF0B55]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#FF0B55]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">What is OpenSc0ut?</h2>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  OpenSc0ut is a platform designed to help developers find meaningful open-source projects
                  where they can contribute and grow their skills. Our mission is to connect developers with
                  projects that match their interests and skill levels, fostering collaboration within the
                  global developer community.
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#FF0B55]/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">How It Works</h3>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "Programming language filtering (JavaScript, Python, Java, etc.)",
                    "Sorting by stars, forks, or recent activity",
                    "Advanced search capabilities",
                    "Easy pagination through results"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#FF0B55]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-[#FF0B55]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF0B55]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#FF0B55]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white">Why Open Source?</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Gain Real-World Experience", desc: "Work on actual projects used by thousands of developers" },
                    { title: "Build Your Portfolio", desc: "Showcase your contributions to potential employers" },
                    { title: "Learn from Experts", desc: "Collaborate with experienced developers worldwide" },
                    { title: "Join a Community", desc: "Connect with like-minded developers globally" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF0B55] to-[#FF0B55]/60 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Technical Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="relative group mt-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0B55]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#FF0B55]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4a2 2 0 010-16 2 2 0 010 16z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white">Technical Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    GitHub API Integration
                  </h4>
                  <p className="text-gray-300 mb-4">
                    This project uses the GitHub API to fetch repository data. Rate limits:
                  </p>
                  <ul className="space-y-2">
                    {["Unauthenticated: 60 requests/hour", "Authenticated: 5,000 requests/hour"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-300">
                        <span className="w-2 h-2 bg-[#FF0B55] rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#FF0B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    Built With
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP"].map((tech) => (
                      <span key={tech} className="px-4 py-2 rounded-full bg-[#FF0B55]/10 border border-[#FF0B55]/30 text-[#FF0B55] text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF0B55] to-[#FF0B55]/80 hover:from-[#FF0B55]/90 hover:to-[#FF0B55]/70 text-white font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-[#FF0B55]/25 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Start Exploring Projects
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}