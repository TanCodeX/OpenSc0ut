// src/config/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/db/prisma"; // Adjust path if needed

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    // Add other providers here if needed (e.g., Google, Email)
  ],
  // Optional: Add callbacks for customizing session, JWT, etc.
  // callbacks: {
  //   async session({ session, user }) {
  //     // Add user ID to session
  //     if (session.user) {
  //       session.user.id = user.id;
  //     }
  //     return session;
  //   },
  // },
  // Optional: Customize pages if needed
  // pages: {
  //   signIn: '/auth/signin',
  // },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set
};