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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(href);
      if (href === "/") {
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] pt-4 pb-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          suppressHydrationWarning
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between rounded-full px-5 py-3 border border-gray-600/40 bg-gray-900/40 backdrop-blur-md"
        >
          {/* Logo */}
          <div className="flex-1">
            <Link
              href="/"
              onClick={(e) => handleNavigation("/", e)}
              className="inline-flex items-center group"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold"
              >
                OpenSc0ut
              </motion.span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex flex-none items-center justify-center space-x-10 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/gsoc", label: "GSOC" },
              { href: "/ai-repo", label: "AI Analysis" },
              { href: "/contact-us", label: "Contact us" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavigation(link.href, e)}
                className={
                  pathname === link.href
                    ? "text-white font-medium text-base"
                    : "text-gray-400 hover:text-gray-300 transition"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Spacer for centering */}
          <div className="flex-1 hidden md:block"></div>
        </motion.div>
      </div>
    </header>
  );
}
