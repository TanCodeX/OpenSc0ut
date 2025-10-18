"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string, e: React.MouseEvent) => {
    e.preventDefault();

    if (href === "/" && pathname === "/") {
      // If already on home page, just scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href === "/") {
      // If navigating to home from another page
      router.push(href);
      // Wait for navigation to complete then scroll to top
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      router.push(href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 pb-3">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between rounded-xl px-5 py-3 border border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md transition-all duration-300"
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleNavigation("/", e)}
            className="flex items-center group"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-xl font-bold"
            >
              OpenSc0ut
            </motion.span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10 text-sm">
            {/* Regular Links */}
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/languages", label: "Languages" },
              { href: "/topics", label: "Topics" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavigation(link.href, e)}
                className="relative text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                {link.label}
                {pathname === link.href && link.href !== "/" && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 top-full h-[2px] w-full bg-[#FF0B55]"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side - GitHub */}
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FF0B55] hover:bg-black hover:border-[#FF0B55] hover:border-2 hover:shadow-[0_0_15px_rgba(255,11,85,0.5)] text-black hover:text-white font-semibold px-4 py-2 text-sm rounded-full border-2 border-transparent transition-all duration-100 ease-out inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Open GitHub
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
