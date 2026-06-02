// src/app/signup/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SitePageHero } from "../../components";
import { createClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      }
    };
    checkSession();
  }, [router, supabase.auth]);

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (authError) setError(authError.message);
    } catch (err: any) {
      setError(err.message || "Google sign up failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGitHubSignUp = async () => {
    setIsGithubLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (authError) setError(authError.message);
    } catch (err: any) {
      setError(err.message || "GitHub sign up failed.");
    } finally {
      setIsGithubLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSigningUp(true);
    setError(null);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Sign up failed. Try again.");
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <main>
      <SitePageHero
        badge="Create Account"
        title={
          <>
            Join <span className="text-[#FF0B55]">OpenSc0ut</span>
          </>
        }
        description="Create your account using GitHub, Google, or Email."
        minHeightClass="min-h-[48vh]"
      />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-8 relative z-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF0B55]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-4">
            
            <button
              type="button"
              onClick={handleGitHubSignUp}
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
                  Redirecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.11.82-.26.82-.575v-2.16c-3.338.725-4.042-1.41-4.042-1.41-.545-1.385-1.332-1.75-1.332-1.75-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.235 1.84 1.235 1.07 1.835 2.805 1.305 3.495.995.105-.775.415-1.305.755-1.605-2.665-.3-5.465-1.33-5.465-5.93 0-1.31.465-2.38 1.235-3.22-.125-.305-.535-1.525.115-3.175 0 0 1.005-.32 3.3 1.23.955-.265 1.98-.4 3-.405 1.02.005 2.045.14 3 .405 2.29-1.55 3.295-1.23 3.295-1.23.655 1.65.245 2.87.12 3.175.77.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.425.37.81 1.1.81 2.22v3.29c0 .32.22.69.825.575C20.565 21.79 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Sign up with GitHub
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
              className={`w-full rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                isGoogleLoading
                  ? "bg-[#FF0B55]/80 text-white cursor-not-allowed opacity-90"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {isGoogleLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Redirecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign up with Google
                </>
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-500">Or sign up with email</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Password (min. 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/30 focus:border-transparent"
              />

              <button
                type="button"
                onClick={handleEmailSignUp}
                disabled={isSigningUp || !name || !email || !password || !confirmPassword}
                className="w-full rounded-full px-6 py-3 text-sm font-semibold bg-[#FF0B55] text-black hover:bg-[#FF0B55]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigningUp ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {error && <p className="text-center text-sm text-red-400">{error}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
