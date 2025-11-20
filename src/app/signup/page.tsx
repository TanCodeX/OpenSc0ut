// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { Header } from "../../components"; 
import Link from "next/link";
// Assuming you created and exported 'signUp' from src/lib/auth-client.ts
import { signUp } from "@/lib/auth-client"; 

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  // Added missing handleChange function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitStatus("idle");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use signUp.email for user creation
      const { error: authError } = await signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        callbackURL: "/login", // Redirect to login after successful sign up
      });

      if (authError) {
        setError(authError.message || "Failed to create account.");
        setSubmitStatus("error");
      } else {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
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
              Create an <span className="text-[#FF0B55]">Account</span>
            </h1>
            <p className="text-gray-400">
              Join OpenSc0ut to find and contribute to open source projects.
            </p>
          </div>
          <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-full text-gray-300 placeholder-gray-500 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50 focus:border-transparent"
                  placeholder="Your full name"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-full text-gray-300 placeholder-gray-500 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50 focus:border-transparent"
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full px-4 py-2 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-full text-gray-300 placeholder-gray-500 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50 focus:border-transparent"
                  placeholder="Min 8 characters"
                  disabled={isSubmitting}
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black/30 border border-[hsla(0,1.10%,36.10%,0.44)] rounded-full text-gray-300 placeholder-gray-500 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0B55]/50 focus:border-transparent"
                  placeholder="Confirm your password"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF0B55] hover:bg-black hover:border-[#FF0B55] hover:border-2 hover:shadow-[0_0_15px_rgba(255,11,85,0.5)] text-black hover:text-white font-semibold px-6 py-3 text-sm rounded-full border-2 border-transparent transition-all duration-100 ease-out inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
              
              {submitStatus === "success" && (
                <div className="text-center text-green-400 text-sm">
                  ✓ Account created successfully! Please log in.
                </div>
              )}
              {submitStatus === "error" && error && (
                <div className="text-center text-red-400 text-sm">
                  ✗ {error}
                </div>
              )}
              
              <div className="text-center text-gray-400 text-sm">
                Already have an account?{" "}
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