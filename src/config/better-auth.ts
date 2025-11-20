// config/better-auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/db/prisma";
import nodemailer from "nodemailer";

// TODO: Move to a proper utility like src/lib/services/email.ts if needed.
export async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  // You could reuse environment or put direct creds for demo
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}

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
    // Optional: require users verify their email first
    // requireEmailVerification: true,
    // Password reset handler
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your OpenSc0ut password",
        text: `Click here to reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }, request) => {
      // TODO: analytics/logging if needed
      console.log(`Password for user ${user.email} reset.`);
    },
    // minPasswordLength: 8,
    // maxPasswordLength: 128,
  },

     emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
         await sendEmail({
           to: user.email,
           subject: "Verify your OpenSc0ut email",
           text: `Please verify by clicking: ${url}`,
         });
       },
     },
  },
);