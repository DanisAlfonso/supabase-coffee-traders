'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag,
  ClipboardList,
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: ShoppingBag, label: 'Products', href: '/admin/products' },
  { icon: ClipboardList, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

// List of admin emails - you can move this to an environment variable or database
const ADMIN_EMAILS = ['danny.ramrez7@gmail.com'];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminAccess() {
      if (!user) {
        router.push('/auth');
        return;
      }

      // First check if email is in admin list
      if (!ADMIN_EMAILS.includes(user.email || '')) {
        router.push('/');
        return;
      }

      try {
        // Then try to perform an admin action to verify permissions
        const { error } = await supabase
          .from('products')
          .select('id')
          .limit(1);

        // If there's no error, user has proper access
        if (!error) {
          setIsAdmin(true);
        } else {
          console.error('Admin access check failed:', error);
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/');
      }
    }

    checkAdminAccess();
  }, [user, router]);

  // Show nothing while checking admin status
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 lg:hidden z-20"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg lg:shadow-none"
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <Link href="/admin" className="flex items-center space-x-2">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                  <span className="text-xl font-bold">Admin Panel</span>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors"
                    >
                      <Icon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User Section */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 px-3 py-2.5">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user?.email?.[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`lg:ml-64 min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
} 