// src/lib/auth-client.ts
"use client"; // Should be a client component file

import { createAuthClient } from 'better-auth/client';

const publicUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// The base URL should point to your API route: /api/auth
export const authClient = createAuthClient({
  baseURL: `${publicUrl}/api/auth`, 
});

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;

export function useSession(...args: any) {
  // @ts-ignore: This ensures the hook is always treated as a callable function
  return (authClient as any).useSession(...args);
}