// config/better-auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP, phoneNumber } from "better-auth/plugins";
import { dash } from "@better-auth/infra";
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

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
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
  plugins: [
    dash(),
    nextCookies(),
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        const subject =
          type === "sign-in"
            ? "Your OpenSc0ut sign-in code"
            : "Your OpenSc0ut verification code";
        await sendEmail({
          to: email,
          subject,
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
      },
      expiresIn: 5 * 60,
      otpLength: 6,
    }),
    phoneNumber({
      sendOTP: async ({ phoneNumber: toPhone, code }) => {
        console.log(`[Phone Verification] Sending ${code} to ${toPhone}`);
        // In production, integrate with Twilio for SMS
        // await twilioClient.messages.create({
        //   body: `Your OpenSc0ut verification code is: ${code}`,
        //   from: process.env.TWILIO_PHONE_NUMBER,
        //   to: toPhone,
        // });
      },
      expiresIn: 5 * 60,
      otpLength: 6,
    }),
  ],
});
