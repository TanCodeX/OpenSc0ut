// config/better-auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/db/prisma";

// NOTE: Based on the documentation, the providers are configured directly 
// within the main config object, not imported as separate 'plugins'.

export const auth = betterAuth({
  // 1. Database Adapter
  adapter: prismaAdapter(prisma, { provider: "postgresql" }),

  // 2. Secret Key
  secret: process.env.BETTER_AUTH_SECRET!,

  // 3. Social Providers (for GitHub Login)
  socialProviders: { //
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID!, //
      clientSecret: process.env.GITHUB_CLIENT_SECRET!, //
    },
  },

  // 4. Email & Password Configuration (for Sign Up/Sign In)
  emailAndPassword: { //
    enabled: true, //
  },

  // 5. Plugins (For Next.js App Router compatibility)
  plugins: [
    // The nextCookies() function takes 0 arguments.
    nextCookies(), 
  ],
});