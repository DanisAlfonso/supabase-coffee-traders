'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../../../lib/cart-context';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('No session ID found');
      setIsLoading(false);
      return;
    }

    // Clear the cart after successful payment
    clearCart();
    setIsLoading(false);
  }, [searchParams, clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="text-green-500 mb-6">
        <CheckCircle size={64} />
      </div>
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Your payment was successful and your order has been confirmed. You will receive an email with your order details shortly.
      </p>
      <div className="flex gap-4">
        <Link
          href="/products"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
} 