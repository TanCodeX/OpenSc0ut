// src/app/reset-password/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SitePageHero } from "../../components";

export default function ResetPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <main>
      <SitePageHero
        badge="Account"
        title="Redirecting..."
        description="Password reset is not used for GitHub-only authentication. You are being sent to sign in."
        minHeightClass="min-h-[48vh]"
      />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-8 relative z-10 flex justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#FF0B55] border-t-transparent" />
      </div>
    </main>
  );
}
