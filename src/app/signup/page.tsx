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

  // ... (handleChange function remains the same)

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
    <main>
      <div className="bg-[hsla(0,1.30%,15.50%,0.44)] backdrop-blur-md border-[0.5px] border-[hsla(0,1.10%,36.10%,0.44)] rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... Name, Email, Password inputs ... */}
          <button
            type="submit"
            disabled={isSubmitting}
            // ...
          >
            {/* ... */}
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
    </main>
  );
}