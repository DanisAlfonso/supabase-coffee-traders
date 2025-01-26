'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignInForm, SignUpForm } from '@/app/components/auth/AuthForms';
import { useAuth } from '@/lib/auth-context';

export default function AuthPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      console.log('User already logged in, redirecting...');
      router.push(redirect || '/');
    }
  }, [user, router, redirect]);

  // Debug logging
  useEffect(() => {
    console.log('Auth page - Current user:', user);
    console.log('Auth page - Error:', error);
    console.log('Auth page - Redirect:', redirect);
  }, [user, error, redirect]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Welcome to Selvas Coffee</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Sign In</h2>
          <SignInForm />
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-6">New Customer?</h2>
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}