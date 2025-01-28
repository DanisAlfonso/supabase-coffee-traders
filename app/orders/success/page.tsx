'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Package, ShoppingBag, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      router.replace('/');
      return;
    }

    // Clear the cart after successful payment
    clearCart();
    setLoading(false);
  }, [searchParams, router, clearCart]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Processing your order...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          {/* Success Icon */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2 
                }}
                className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </motion.div>
              <motion.div
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full"
              />
            </div>
          </motion.div>
          
          {/* Success Message */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been successfully processed and confirmed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Order confirmation sent to your email</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Track your order in your account</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="grid gap-4 max-w-md mx-auto"
          >
            <Link 
              href="/orders"
              className="group relative bg-card hover:bg-card/80 border border-border/50 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">View Your Orders</h3>
                  <p className="text-sm text-muted-foreground">Track your order status and history</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>

            <Link 
              href="/products"
              className="group relative bg-card hover:bg-card/80 border border-border/50 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Continue Shopping</h3>
                  <p className="text-sm text-muted-foreground">Explore more of our products</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>

            <Link 
              href="/"
              className="group relative bg-card/50 hover:bg-card/30 border border-border/50 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Return Home</h3>
                  <p className="text-sm text-muted-foreground">Back to homepage</p>
                </div>
                <Home className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 