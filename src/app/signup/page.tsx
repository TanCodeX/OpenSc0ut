// src/app/signup/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../components"; 

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page where GitHub sign-in handles sign-up/in automatically
    router.replace("/login"); 
  }, [router]);

  // Optionally show a loading screen while redirecting
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Redirecting...</h1>
          <p className="text-gray-400">
            Account creation is handled through GitHub Sign In.
          </p>
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF0B55]"></div>
          </div>
        </div>
      </main>
    </div>
  );
}