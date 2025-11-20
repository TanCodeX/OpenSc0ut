// src/lib/auth-client.ts
"use client"; // Should be a client component file

import { createAuthClient } from 'better-auth/client';

const publicUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// The base URL should point to your API route: /api/auth
export const authClient = createAuthClient({
  baseURL: `${publicUrl}/api/auth`, 
});

// For easier usage in client components, export core methods:
export const { signIn, signUp, signOut, useSession } = authClient;