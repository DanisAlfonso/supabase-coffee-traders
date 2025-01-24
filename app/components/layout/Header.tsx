'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-xl font-bold">Selvas Coffee</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-brown-600">Home</Link>
            <Link href="/products" className="hover:text-brown-600">Products</Link>
            <Link href="/about" className="hover:text-brown-600">About</Link>
            <Link href="/contact" className="hover:text-brown-600">Contact</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4">
            <Link href="/" className="block hover:text-brown-600">Home</Link>
            <Link href="/products" className="block hover:text-brown-600">Products</Link>
            <Link href="/about" className="block hover:text-brown-600">About</Link>
            <Link href="/contact" className="block hover:text-brown-600">Contact</Link>
          </nav>
        )}
      </div>
    </header>
  );
}