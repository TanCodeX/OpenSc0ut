"use client";

export default function PageGridBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>

      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#FF0B55]/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#FF0B55]/10 rounded-full blur-[128px] animate-pulse delay-1000" />

    </div>
  );
}
