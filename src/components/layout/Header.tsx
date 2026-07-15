"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gsoc", label: "GSOC" },
  { href: "/ai-repo", label: "Repo Scout" },
  { href: "/contact-us", label: "Contact us" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigation = (href: string, e: React.MouseEvent) => {
    setMobileOpen(false);
    if (href === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href === "/") {
      // Allow Link to navigate, but add scroll delay
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] pt-4 pb-3">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#FF0B55]/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          suppressHydrationWarning
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between rounded-2xl px-5 py-3
                     border border-white/[0.08]
                     bg-[#0a0a0a]/70 backdrop-blur-xl
                     shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          {/* ── Logo ── */}
          <div className="flex-1 flex items-center">
            <Link
              href="/"
              onClick={(e) => handleNavigation("/", e)}
              className="inline-flex items-center gap-2 group"
            >
              {/* Icon mark */}
              <motion.div
                whileHover={{ scale: 1.12, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF0B55] to-[#ff6b9d] flex items-center justify-center shadow-lg shadow-[#FF0B55]/30"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </motion.div>

              {/* Wordmark */}
              <motion.span
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="text-[1.15rem] font-extrabold tracking-tight"
              >
                <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                  Open
                </span>
                <span className="bg-gradient-to-r from-[#FF0B55] via-[#ff4d85] to-[#ff9bc0] bg-clip-text text-transparent">
                  Sc0ut
                </span>
              </motion.span>
            </Link>
          </div>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex flex-none items-center justify-center gap-1 text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavigation(link.href, e)}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 outline-none"
                >
                  {/* Hover pill */}
                  {hoveredLink === link.href && !isActive && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}

                  {/* Active pill */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-[#FF0B55]/15 border border-[#FF0B55]/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span className={`relative z-10 transition-colors duration-200 ${
                    isActive
                      ? "text-[#FF0B55]"
                      : hoveredLink === link.href
                        ? "text-white"
                        : "text-gray-400"
                  }`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* ── Right CTA ── */}
          <div className="flex-1 hidden md:flex items-center justify-end gap-3">
            <motion.a
              href="https://github.com/TanCodeX/OpenSc0ut"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-2
                         bg-gradient-to-r from-[#FF0B55]/90 to-[#cc0944]/90
                         hover:from-[#FF0B55] hover:to-[#e00b4d]
                         text-white px-5 py-2 rounded-full text-sm font-semibold
                         shadow-[0_0_20px_rgba(255,11,85,0.35)] hover:shadow-[0_0_28px_rgba(255,11,85,0.55)]
                         transition-all duration-300 border border-[#FF0B55]/30"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Star &amp; Contribute
            </motion.a>
          </div>

          {/* ── Mobile Burger ── */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <motion.svg
              width="20" height="20" viewBox="0 0 20 20" fill="currentColor"
              animate={mobileOpen ? "open" : "closed"}
            >
              <motion.rect
                x="2" y="5" width="16" height="1.5" rx="1"
                variants={{ open: { rotate: 45, y: 4.5 }, closed: { rotate: 0, y: 0 } }}
                transition={{ duration: 0.25 }}
              />
              <motion.rect
                x="2" y="9.25" width="16" height="1.5" rx="1"
                variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
                transition={{ duration: 0.15 }}
              />
              <motion.rect
                x="2" y="13.5" width="16" height="1.5" rx="1"
                variants={{ open: { rotate: -45, y: -4.5 }, closed: { rotate: 0, y: 0 } }}
                transition={{ duration: 0.25 }}
              />
            </motion.svg>
          </button>
        </motion.div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-2 rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/90 backdrop-blur-xl
                         shadow-[0_12px_48px_rgba(0,0,0,0.6)] p-3 flex flex-col gap-1"
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavigation(link.href, e)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#FF0B55]/15 text-[#FF0B55] border border-[#FF0B55]/25"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-1 border-t border-white/[0.06] mt-1">
                <a
                  href="https://github.com/TanCodeX/OpenSc0ut"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                             text-white bg-gradient-to-r from-[#FF0B55]/80 to-[#cc0944]/80
                             border border-[#FF0B55]/30"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  Star &amp; Contribute
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
