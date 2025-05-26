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
                className="bg-[#FF0B55] hover:bg-[#e00a4c] text-white px-3 py-2 text-sm rounded-lg transition-colors duration-200"
              >
                Open GitHub
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
