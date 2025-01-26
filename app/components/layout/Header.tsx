'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Package } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { items } = useCart();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-primary/10 rounded-md"></div>
            <span className="text-xl font-bold text-foreground hover:text-primary transition-colors duration-200">Selvas Coffee</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors duration-200">Home</Link>
            <Link href="/products" className="text-foreground hover:text-primary transition-colors duration-200">Products</Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors duration-200">About</Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors duration-200">Contact</Link>
            {user && (
              <Link 
                href="/orders" 
                className="text-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
              >
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </Link>
            )}
            <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors duration-200">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <button
                onClick={() => signOut()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors duration-200">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="p-2 text-foreground hover:text-primary transition-colors duration-200"
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
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4">
            <Link href="/" className="block text-foreground hover:text-primary transition-colors duration-200">Home</Link>
            <Link href="/products" className="block text-foreground hover:text-primary transition-colors duration-200">Products</Link>
            <Link href="/about" className="block text-foreground hover:text-primary transition-colors duration-200">About</Link>
            <Link href="/contact" className="block text-foreground hover:text-primary transition-colors duration-200">Contact</Link>
            {user && (
              <Link 
                href="/orders" 
                className="block text-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
              >
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </Link>
            )}
            {user ? (
              <button
                onClick={() => signOut()}
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                className="block w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 text-center"
              >
                Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}