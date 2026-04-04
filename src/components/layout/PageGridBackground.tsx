"use client";

export default function PageGridBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 11, 85, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 11, 85, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#FF0B55]/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#FF0B55]/10 rounded-full blur-[128px] animate-pulse delay-1000" />
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#FF0B55]/30 rounded-tl-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#FF0B55]/30 rounded-br-3xl" />
    </div>
  );
}
