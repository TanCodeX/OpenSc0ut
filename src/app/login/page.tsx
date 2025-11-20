// src/app/login/page.tsx
"use client";

import { useState, useRef } from "react";
import { Header } from "../../components";
import Link from "next/link";
// Assuming you created and exported 'signIn' from src/lib/auth-client.ts
import { signIn } from "@/lib/auth-client"; 

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  
  const handleEmailScroll = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Use signIn.email for credentials login
      const { error: authError } = await signIn.email({ 
        email,
        password,
        callbackURL: "/", 
      });
      
      if (authError) {
        setError(authError.message || "Failed to sign in.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsGithubLoading(true);
    try {
      await signIn.social({
        provider: "github", //
        // Optional: callbackURL is usually handled by the provider flow
      });
    } finally {
      setIsGithubLoading(false); // In practice, redirect usually happens, but for fallback
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Section */}
          {/* ... */}

          {/* Login Form */}
          <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg p-8">
            
            {/* 💡 GitHub Sign In Button */}
            <button
              type="button"
              onClick={handleGitHubSignIn}
              className={`w-full mb-6 text-black font-semibold px-6 py-3 text-sm rounded-full transition-colors inline-flex items-center justify-center gap-2 ${isGithubLoading ? "bg-[#FF0B55] text-white cursor-not-allowed opacity-75" : "bg-white hover:bg-gray-100"}`}
              disabled={isGithubLoading}
            >
              {isGithubLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                "Sign In with GitHub"
              )}
            </button>
            
            <div className="relative flex justify-center text-xs uppercase mb-6">
                <button
                  type="button"
                  onClick={handleEmailScroll}
                  className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md px-2 text-gray-500 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0B55] rounded"
                  aria-label="Scroll to email sign in form"
                >
                    Or continue with email
                </button>
            </div>

            <form ref={formRef} onSubmit={handleEmailSignIn} className="space-y-6">
              {/* ... Email Input ... */}
              {/* ... Password Input ... */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF0B55] hover:bg-black hover:border-[#FF0B55] hover:border-2 hover:shadow-[0_0_15px_rgba(255,11,85,0.5)] text-black hover:text-white font-semibold px-6 py-3 text-sm rounded-full border-2 border-transparent transition-all duration-100 ease-out inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {error && (
                <div className="text-center text-red-400 text-sm">
                  ✗ {error}
                </div>
              )}

              <div className="text-center text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link
                  href="/signup" 
                  className="text-[#FF0B55] hover:text-[#e00a4c]"
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}