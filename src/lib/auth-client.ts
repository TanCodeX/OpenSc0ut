// src/lib/auth-client.ts
"use client"; // Should be a client component file

import { createAuthClient } from "better-auth/react";

const envBase =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL;

const normalizedBase =
  envBase && envBase.length > 0
    ? envBase.endsWith("/api/auth")
      ? envBase
      : `${envBase.replace(/\/+$/, "")}/api/auth`
    : undefined;

export const authClient = createAuthClient(
  normalizedBase ? { baseURL: normalizedBase } : undefined
);

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;