'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// This client should only be used in client components
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    cookies: {
      get(key: string) {
        if (typeof document === 'undefined') return '';
        const cookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${key}=`));
        return cookie ? cookie.split('=')[1] : '';
      },
      set(key: string, value: string, options?: { path?: string }) {
        if (typeof document === 'undefined') return;
        const path = options?.path ?? '/';
        document.cookie = `${key}=${value}; path=${path}`;
      },
      remove(key: string, options?: { path?: string }) {
        if (typeof document === 'undefined') return;
        const path = options?.path ?? '/';
        document.cookie = `${key}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    }
  }
);