import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PageTransition, GlobalCursor } from "../components";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-black text-white`}>
        <GlobalCursor />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
