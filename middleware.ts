import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Log for debugging
      console.log('Middleware auth check:', {
        path: request.nextUrl.pathname,
        hasSession: !!user,
        userEmail: user?.email,
      });

      // For API routes that require authentication
      if (request.nextUrl.pathname.startsWith('/api/') && !user) {
        console.log('API route accessed without authentication:', request.nextUrl.pathname);
      }
    } catch (authError) {
      console.error('Auth check error:', authError);
      // Continue without auth - let the route handle authentication if needed
    }

    return response;
  } catch (e) {
    console.error('Middleware error:', e);
    // Return a basic response if middleware fails
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 