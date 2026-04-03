import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PageTransition } from "@/components"; // Removed GlobalCursor import
import "../styles/globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "OpenSc0ut - Repository Explorer",
  description: "Discover and explore repositories from around the world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} font-sans bg-black text-white`}
        suppressHydrationWarning
      >
        {/* <GlobalCursor />  <-- REMOVED FROM HERE */}
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}