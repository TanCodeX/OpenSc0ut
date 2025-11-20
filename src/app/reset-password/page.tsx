// src/app/reset-password/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../components";

export default function ResetPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page as password reset is not applicable for GitHub-only authentication
    router.replace("/login"); 
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Redirecting...</h1>
          <p className="text-gray-400">
            Password reset is not required for GitHub-only authentication.
          </p>
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF0B55]"></div>
          </div>
        </div>
      </main>
    </div>
  );
}