'use client';

import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Debug logging
  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  const handleCheckout = async () => {
    console.log('Starting checkout process');
    console.log('User state:', user);

    if (!user) {
      console.log('No user found, redirecting to auth');
      router.push(`/auth?redirect=${encodeURIComponent('/cart')}`);
      return;
    }

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripe failed to initialize - missing publishable key');
        alert('Payment system is not properly configured. Please contact support.');
        return;
      }

      // Default shipping details from user's email
      const shippingDetails = {
        email: user.email || '',
        name: user.user_metadata?.full_name || '',
        phone: user.phone || '',
        address: '',
        city: '',
        postalCode: '',
        country: 'DE', // Default to Germany
      };

      console.log('Making checkout request with details:', { items, shippingDetails });

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include credentials for auth
        body: JSON.stringify({ 
          items,
          shippingDetails,
        }),
      });

      console.log('Checkout response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout error response:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId, error } = await response.json();
      if (error) throw new Error(error);

      console.log('Got session ID:', sessionId);

      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to checkout. Please try again.');
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-8">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add some delicious coffee to your cart!</p>
        <Link
          href="/products"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors duration-200"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 mb-6 bg-card p-4 rounded-lg">
              <div className="relative h-24 w-24 flex-shrink-0">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-lg font-bold">€{item.price.toFixed(2)}</p>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center border rounded">
                    <button
                      className="px-3 py-1 border-r hover:bg-muted transition-colors duration-200"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button
                      className="px-3 py-1 border-l hover:bg-muted transition-colors duration-200"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>€5.00</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>€{(total + 5).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
              onClick={handleCheckout}
            >
              {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </button>
            {!user && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Please sign in to complete your purchase
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}