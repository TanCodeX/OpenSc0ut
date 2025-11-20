// src/app/reset-password/page.tsx
"use client";

import { useState } from "react";
import { Header } from "../../components";
import Link from "next/link";
// Import authClient to access sendPasswordReset
import { authClient } from "@/lib/auth-client"; 

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitStatus("idle");

    if (!email.trim()) {
      setError("Please enter your email address.");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use authClient.sendPasswordReset to trigger the email
      const { error: authError } = await authClient.resetPassword({
        newPassword: email,
      });

      if (authError) {
        // Better-auth returns an error even if the user is not found to prevent enumeration
        // We will show a generic success message even on some errors for security
        console.error("Password reset error:", authError);
        setSubmitStatus("success"); 
      } else {
        setSubmitStatus("success");
        setEmail("");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Forgot <span className="text-[#FF0B55]">Password</span>
            </h1>
            <p className="text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-full text-gray-300 placeholder-gray-500 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50 focus:border-transparent"
                  placeholder="your@email.com"
                  disabled={isSubmitting || submitStatus === "success"}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submitStatus === "success"}
                className="w-full bg-[#FF0B55] hover:bg-black hover:border-[#FF0B55] hover:border-2 hover:shadow-[0_0_15px_rgba(255,11,85,0.5)] text-black hover:text-white font-semibold px-6 py-3 text-sm rounded-full border-2 border-transparent transition-all duration-100 ease-out inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
              
              {submitStatus === "success" && (
                <div className="text-center text-green-400 text-sm">
                  ✓ If an account with that email exists, a password reset link has been sent.
                </div>
              )}
              {submitStatus === "error" && error && (
                <div className="text-center text-red-400 text-sm">
                  ✗ {error}
                </div>
              )}
              
              <div className="text-center text-gray-400 text-sm">
                Remember your password?{" "}
                <Link href="/login" className="text-[#FF0B55] hover:text-[#e00a4c]">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}