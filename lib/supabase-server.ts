import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean }) {
          // In Next.js Server Actions and Route Handlers, you cannot set cookies
          // This will be handled by the client-side auth callback
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          // In Next.js Server Actions and Route Handlers, you cannot remove cookies
          // This will be handled by the client-side auth callback
        },
      },
    }
  );
}; 