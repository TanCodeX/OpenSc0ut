// src/lib/auth-client.ts
"use client";

import { createAuthClient } from "better-auth/react";
import { emailOTPClient, phoneNumberClient } from "better-auth/client/plugins";

const envBase =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL;

const normalizedBase =
  envBase && envBase.length > 0
    ? envBase.endsWith("/api/auth")
      ? envBase
      : `${envBase.replace(/\/+$/, "")}/api/auth`
    : "";

const clientPlugins = [emailOTPClient(), phoneNumberClient()];

export const authClient = createAuthClient(
  normalizedBase
    ? { baseURL: normalizedBase, plugins: clientPlugins }
    : { plugins: clientPlugins }
);

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;

/** Email OTP: sign-in / login */
export function sendEmailOtp(input: {
  email: string;
  type?: "sign-in" | "email-verification";
}) {
  return authClient.emailOtp.sendVerificationOtp({
    email: input.email,
    type: input.type ?? "sign-in",
  });
}

export function verifyEmailOtp(input: { email: string; code: string }) {
  return authClient.signIn.emailOtp({
    email: input.email,
    otp: input.code,
  });
}

/**
 * Email OTP: signup flow — checks code only (no session).
 * Uses the same base URL as the auth client.
 */
export async function checkEmailVerificationOtp(input: {
  email: string;
  code: string;
}): Promise<{ error: { message: string } | null }> {
  const base = normalizedBase || "/api/auth";
  try {
    const res = await fetch(`${base}/email-otp/check-verification-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: input.email,
        otp: input.code,
        type: "email-verification",
      }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };
    if (!res.ok) {
      return {
        error: {
          message: json.message ?? "Invalid OTP. Please try again.",
        },
      };
    }
    if (!json.success) {
      return {
        error: { message: "Invalid OTP. Please try again." },
      };
    }
    return { error: null };
  } catch {
    return { error: { message: "Invalid OTP. Please try again." } };
  }
}

export function sendPhoneOtp(input: { phoneNumber: string }) {
  return authClient.phoneNumber.sendOtp(input);
}

export function verifyPhoneOtp(input: {
  phoneNumber: string;
  code: string;
  disableSession?: boolean;
  updatePhoneNumber?: boolean;
}) {
  return authClient.phoneNumber.verify({
    phoneNumber: input.phoneNumber,
    code: input.code,
    disableSession: input.disableSession ?? true,
    updatePhoneNumber: input.updatePhoneNumber ?? false,
  });
}
