// src/app/api/auth/[...auth]/route.ts

import { auth } from '@/config/better-auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth.handler);