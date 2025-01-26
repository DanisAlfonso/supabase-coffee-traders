'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const router = useRouter();
  const cleared = useRef(false);

  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true;
      clearCart();
      console.log('Cart cleared on success page');
    }
    
    const timer = setTimeout(() => {
      router.push('/products');
    }, 3000);

    return () => clearTimeout(timer);
  }, [clearCart, router]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Thank you for your order!
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Your payment was successful and your order is being processed.
          </p>
          <p className="mt-2 text-gray-500">
            You will be redirected to the products page in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
} 