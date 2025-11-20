// config/better-auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/db/prisma";
import nodemailer from "nodemailer";

// TODO: Move to a proper utility like src/lib/services/email.ts if needed.
type EmailPayload = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail({ to, subject, text }: EmailPayload) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn(
      "[better-auth] EMAIL_USER or EMAIL_PASS is missing. Skipping transactional email."
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: user,
    to,
    subject,
    text,
  });
}

// NOTE: Based on the documentation, the providers are configured directly 
// within the main config object, not imported as separate 'plugins'.

export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  emailAndPassword: { // Disabled email and password login
    enabled: false,
  },
  emailVerification: {
    sendOnSignUp: false, // Disabled email verification
    sendVerificationEmail: async ({ user, url }) => {
      // Stub function to prevent errors, as it will never be called
      console.log(`Skipping email verification for ${user.email}`);
    },
  },
  plugins: [nextCookies()],
});