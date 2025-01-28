'use client';

import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

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

    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add some delicious coffee to your cart!</p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center bg-primary/10 backdrop-blur-sm text-primary font-semibold px-8 py-4 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 gap-2 group"
        >
          Browse Products
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: 3 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            →
          </motion.span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background before:absolute before:inset-0 before:bg-[url('/noise.png')] before:opacity-[0.02] before:mix-blend-overlay relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="container mx-auto px-4 py-8 relative">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-6 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="flex-grow relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-lg font-bold">€{item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card/80 backdrop-blur-sm">
                      <button
                        className="px-3 py-1 hover:bg-primary/10 transition-colors duration-200 text-primary"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="px-4 py-1 border-x border-border font-medium">{item.quantity}</span>
                      <button
                        className="px-3 py-1 hover:bg-primary/10 transition-colors duration-200 text-primary"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 text-sm font-medium"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-sm sticky top-24"
            >
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-medium text-foreground">€5.00</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>€{(total + 5).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:from-primary/95 hover:to-primary/85 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 group backdrop-blur-sm"
                onClick={handleCheckout}
              >
                {user ? (
                  <>
                    Proceed to Checkout
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: 3 }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    >
                      →
                    </motion.span>
                  </>
                ) : (
                  'Sign In to Checkout'
                )}
              </button>
              {!user && (
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  Please sign in to complete your purchase
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}