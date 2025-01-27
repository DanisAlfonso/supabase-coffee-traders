'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        
        <p className="text-lg mb-8">
          Your payment was successful and your order has been confirmed. You will receive an email
          confirmation shortly with your order details.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/orders')}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors duration-200"
          >
            View Your Orders
          </button>
          
          <button
            onClick={() => router.push('/products')}
            className="w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/90 transition-colors duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </motion.div>
    </div>
  );
} 