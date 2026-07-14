import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PageTransition, Header, SiteFooter } from "@/components";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "OpenSc0ut - Repository Explorer",
  description: "Discover, analyze, and contribute to the most impactful open-source projects worldwide. OpenSc0ut is your ultimate destination for open-source exploration.",
  keywords: ["open source", "github repositories", "explore", "developer tools", "contribute"],
  authors: [{ name: "OpenSc0ut Team" }],
  openGraph: {
    title: "OpenSc0ut - Discover Open Source Projects",
    description: "Explore the most impactful open-source repositories from around the world. Find your next contribution opportunity.",
    url: "https://opensc0ut.app", // Adjust if actual URL is different
    siteName: "OpenSc0ut",
    images: [
      {
        url: "/og-image.png", // Assuming an image will exist or falls back gracefully
        width: 1200,
        height: 630,
        alt: "OpenSc0ut Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenSc0ut - Repository Explorer",
    description: "Discover and explore the most impactful open-source repositories.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} font-sans bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300`}
        suppressHydrationWarning
      >
        <Toaster position="bottom-right" toastOptions={{
          className: 'dark:bg-[#1a1a1a] dark:text-white',
          style: {
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
          },
        }} />
        <Header />
        <PageTransition>{children}</PageTransition>
        <SiteFooter />
      </body>
    </html>
  );
}