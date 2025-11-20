// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { Header } from "../../components";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  // Removed email/password state and related handlers
  const [error, setError] = useState<string | null>(null);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  
  const handleGitHubSignIn = async () => {
    setIsGithubLoading(true);
    setError(null); // Clear previous errors
    try {
      // Use signIn.social directly
      const { error: authError } = await signIn.social({
        provider: "github",
        callbackURL: "/",
      });

      if (authError) {
        setError(authError.message || "GitHub sign in failed. Try again.");
      }
      // The better-auth library handles the redirect after successful sign-in
    } catch (err: any) {
      setError(err.message || "GitHub sign in failed. Try again.");
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Sign In to <span className="text-[#FF0B55]">OpenSc0ut</span>
            </h1>
            <p className="text-gray-400">
              Only GitHub login is supported for seamless open source contribution.
            </p>
          </div>
          
          <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg p-8">
            
            {/* 💡 GitHub Sign In Button - Now the only button */}
            <button
              type="button"
              onClick={handleGitHubSignIn}
              className={`w-full mb-6 text-black font-semibold px-6 py-3 text-sm rounded-full transition-colors inline-flex items-center justify-center gap-2 ${isGithubLoading ? "bg-[#FF0B55] text-white cursor-not-allowed opacity-75" : "bg-white hover:bg-gray-100"}`}
              disabled={isGithubLoading}
            >
              {isGithubLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Redirecting to GitHub...
                </>
              ) : (
                "Sign In with GitHub"
              )}
            </button>
            
            {error && (
              <div className="text-center text-red-400 text-sm mt-4">
                ✗ {error}
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}