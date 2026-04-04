// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { Header, SiteFooter, SitePageHero } from "../../components";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const handleGitHubSignIn = async () => {
    setIsGithubLoading(true);
    setError(null);
    try {
      const { error: authError } = await signIn.social({
        provider: "github",
        callbackURL: "/",
      });

      if (authError) {
        setError(authError.message || "GitHub sign in failed. Try again.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "GitHub sign in failed. Try again.";
      setError(message);
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <SitePageHero
          badge="Account"
          title={
            <>
              Sign in to <span className="text-[#FF0B55]">OpenSc0ut</span>
            </>
          }
          description="GitHub is the only sign-in method — built for contributors and API-backed flows."
          minHeightClass="min-h-[48vh]"
        />

        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-8 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0B55]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <button
                type="button"
                onClick={handleGitHubSignIn}
                disabled={isGithubLoading}
                className={`w-full rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                  isGithubLoading
                    ? "bg-[#FF0B55]/80 text-white cursor-not-allowed opacity-90"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {isGithubLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Redirecting to GitHub...
                  </>
                ) : (
                  "Sign in with GitHub"
                )}
              </button>

              {error && <p className="mt-6 text-center text-sm text-red-400">{error}</p>}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
