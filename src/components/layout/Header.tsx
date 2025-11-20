"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";

/* Profile Avatar Component */
function ProfileAvatar({ user }: any) {
  const isSocialUser = !!user.image;
  const initial =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "?";

  return (
    <div className="relative group cursor-pointer">
      <div className="w-10 h-10 rounded-full border-2 border-[#FF0B55] bg-gray-800 flex items-center justify-center overflow-hidden hover:scale-105 transition-all">
        {isSocialUser ? (
          <img
            src={user.image}
            alt="avatar"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-bold text-lg">{initial}</span>
        )}
      </div>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="p-3 border-b border-gray-700">
          <p className="text-sm font-medium text-white line-clamp-1">
            {user.name || user.email}
          </p>
          <p className="text-xs text-[#FF0B55] mt-1">Logged In</p>
        </div>

        <button
          suppressHydrationWarning
          onClick={() =>
            authClient.signOut().then(() => (window.location.href = "/"))
          }
          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#FF0B55] hover:text-black rounded-b-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ Correct: Better Auth session hook
  const { data: session, isLoading } = useSession();
  const user = session?.user;

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
          <Link
            href="/"
            onClick={(e) => handleNavigation("/", e)}
            className="flex items-center group"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold"
            >
              OpenSc0ut
            </motion.span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/gsoc", label: "GSOC" },
              { href: "/topics", label: "GSSOC" },
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

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {!isLoading && user ? (
              <ProfileAvatar user={user} />
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  suppressHydrationWarning
                  onClick={(e) => handleNavigation("/login", e)}
                  className="bg-[#FF0B55] hover:bg-black hover:border-[#FF0B55] hover:border-2 hover:shadow-[0_0_15px_rgba(255,11,85,0.5)] text-black hover:text-white px-4 py-2 rounded-full font-semibold text-sm"
                >
                  Login
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
