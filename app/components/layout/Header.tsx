'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { 
  ShoppingCart, 
  Package, 
  User,
  ChevronDown,
  LogOut,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const { user, signOut } = useAuth();
  const { items } = useCart();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    async function fetchUserName() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('metadata')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data?.metadata?.name) {
          setUserName(data.metadata.name);
        } else {
          setUserName(user.email?.split('@')[0] || '');
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        setUserName(user.email?.split('@')[0] || '');
      }
    }

    fetchUserName();
  }, [user]);

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
            <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors duration-200">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span>{userName}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border dark:border-gray-700"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Package className="w-4 h-4" />
                        <span>Orders</span>
                      </Link>
                      {user.email === 'danny.ramrez7@gmail.com' && (
                        <Link
                          href="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
              <>
                <Link
                  href="/profile"
                  className="block text-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/orders"
                  className="block text-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </Link>
                {user.email === 'danny.ramrez7@gmail.com' && (
                  <Link
                    href="/admin"
                    className="block text-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </>
            )}
            {user ? (
              <button
                onClick={() => signOut()}
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
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