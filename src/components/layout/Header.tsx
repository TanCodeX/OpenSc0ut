"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

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
    <header className="fixed top-0 left-0 right-0 z-[100] pt-4 pb-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between rounded-full px-5 py-3 border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md transition-all duration-300"
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
              { href: "/gsoc", label: "GSOC" },
              { href: "/topics", label: "GSSOC" },
              { href: "contact-us", label: "Contact us" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavigation(link.href, e)}
                className={`relative transition-all duration-200 ${
                  pathname === link.href
                    ? "text-white text-base font-medium"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Login/Sign Up */}
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {/* Change this Link to use Better Auth's signIn for OAuth or link to custom login */}
              <button
                // Example: Trigger GitHub OAuth sign-in
                // onClick={() => authClient.signIn('github')}
                // Alternatively, link to your custom login page:
                onClick={(e) => handleNavigation('/login', e)}
                className="bg-[#FF0B55] hover:bg-black hover:border-[#FF0B55] hover:border-2 hover:shadow-[0_0_15px_rgba(255,11,85,0.5)] text-black hover:text-white font-semibold px-4 py-2 text-sm rounded-full border-2 border-transparent transition-all duration-100 ease-out inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Login
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
