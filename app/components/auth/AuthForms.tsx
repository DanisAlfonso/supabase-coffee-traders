'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-brown-500 dark:focus:border-brown-400 focus:ring-brown-500 dark:focus:ring-brown-400"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-brown-500 dark:focus:border-brown-400 focus:ring-brown-500 dark:focus:ring-brown-400"
          required
        />
      </div>
      {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-brown-600 text-white px-4 py-2 rounded-md hover:bg-brown-700 dark:bg-brown-700 dark:hover:bg-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-500 dark:focus:ring-brown-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
      >
        Sign In
      </button>
    </form>
  );
}

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-brown-500 dark:focus:border-brown-400 focus:ring-brown-500 dark:focus:ring-brown-400"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-brown-500 dark:focus:border-brown-400 focus:ring-brown-500 dark:focus:ring-brown-400"
          required
        />
      </div>
      {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-brown-600 text-white px-4 py-2 rounded-md hover:bg-brown-700 dark:bg-brown-700 dark:hover:bg-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-500 dark:focus:ring-brown-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
      >
        Sign Up
      </button>
    </form>
  );
}