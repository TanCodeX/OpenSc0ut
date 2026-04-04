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
  html?: string;
};

export async function sendEmail({ to, subject, text, html }: EmailPayload) {
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
    from: `"OpenSc0ut" <${user}>`,
    to,
    subject,
    text,
    html,
  });
}

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTPs in memory (in production, use Redis or database)
const otpStore = new Map<string, { code: string; expires: number; phone?: string }>();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    usePlural: true,
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  emailVerification: {
    sendOnSignUp: false,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email - OpenSc0ut",
        text: `Click here to verify your email: ${url}`,
        html: `<a href="${url}">Verify Email</a>`,
      });
    },
  },
  otp: {
    enabled: true,
    sendVerificationOnSignUp: true,
    sendOtp: async ({ email, otp, phone }) => {
      // Store OTP with 5 minute expiry
      otpStore.set(email, {
        code: otp,
        expires: Date.now() + 5 * 60 * 1000,
        phone,
      });

      if (phone) {
        // Send SMS OTP (using Twilio or similar - stub for now)
        console.log(`[SMS OTP] Sending ${otp} to ${phone}`);
        // In production, integrate with Twilio:
        // await twilioClient.messages.create({
        //   body: `Your OpenSc0ut verification code is: ${otp}`,
        //   from: process.env.TWILIO_PHONE_NUMBER,
        //   to: phone,
        // });
      } else {
        // Send Email OTP
        await sendEmail({
          to: email,
          subject: "Your OpenSc0ut Verification Code",
          text: `Your verification code is: ${otp}\n\nThis code expires in 5 minutes.`,
          html: `
            <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
              <h2 style="color: #FF0B55;">OpenSc0ut</h2>
              <p>Your verification code is:</p>
              <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 14px;">This code expires in 5 minutes.</p>
              <p style="color: #999; font-size: 12px; margin-top: 24px;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        });
      }
    },
    opts: {
      expiry: 5 * 60, // 5 minutes
      length: 6, // 6 digit OTP
    },
  },
  phoneNumber: {
    enabled: true,
    sendVerification: async ({ phoneNumber, code }) => {
      // Store phone OTP
      otpStore.set(phoneNumber, {
        code,
        expires: Date.now() + 5 * 60 * 1000,
      });

      console.log(`[Phone Verification] Sending ${code} to ${phoneNumber}`);
      // In production, integrate with Twilio for SMS
      // await twilioClient.messages.create({
      //   body: `Your OpenSc0ut verification code is: ${code}`,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: phoneNumber,
      // });
    },
  },
  plugins: [nextCookies()],
});