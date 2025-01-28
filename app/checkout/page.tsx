'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface ShippingInfo {
  name: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

export default function CheckoutPage() {
  const { items, total } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
    city: '',
      postal_code: '',
      country: 'DE'
    }
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    async function loadUserProfile() {
      try {
        if (!user?.id) return;
        
        const { data, error } = await supabase
          .from('users')
          .select('metadata')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data?.metadata) {
          setShippingInfo({
            name: data.metadata.name || '',
            phone: data.metadata.phone || '',
            address: {
              line1: data.metadata.address?.line1 || '',
              line2: data.metadata.address?.line2 || '',
              city: data.metadata.address?.city || '',
              postal_code: data.metadata.address?.postal_code || '',
              country: data.metadata.address?.country || 'DE'
            }
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [user, router, items.length]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setShippingInfo(prev => ({
      ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
    }));
    } else {
      setShippingInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Failed to initialize payment system');

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingInfo
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to process checkout');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your information...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Checkout Progress */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Checkout
            </h1>
            <p className="text-muted-foreground">
              Please fill in your shipping information to complete your order
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-grow space-y-6"
            >
              <div className="bg-card rounded-xl shadow-lg p-6 space-y-6 border border-border/50 backdrop-blur-sm">
                <h2 className="text-xl font-semibold">Shipping Information</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Full Name</label>
                    <input
                      type="text"
                      value={shippingInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Phone Number</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Address Line 1</label>
                    <input
                      type="text"
                      value={shippingInfo.address.line1}
                      onChange={(e) => handleInputChange('address.line1', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Address Line 2</label>
                    <input
                      type="text"
                      value={shippingInfo.address.line2}
                      onChange={(e) => handleInputChange('address.line2', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-muted-foreground">City</label>
                      <input
                        type="text"
                        value={shippingInfo.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-muted-foreground">Postal Code</label>
                      <input
                        type="text"
                        value={shippingInfo.address.postal_code}
                        onChange={(e) => handleInputChange('address.postal_code', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                        placeholder="Postal code"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">Country</label>
                    <select
                      value={shippingInfo.address.country}
                      onChange={(e) => handleInputChange('address.country', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                      required
                    >
                      <option value="DE">Germany</option>
                      <option value="AT">Austria</option>
                      <option value="FR">France</option>
                      <option value="IT">Italy</option>
                      <option value="ES">Spain</option>
                      <option value="GB">United Kingdom</option>
                      <option value="IE">Ireland</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:w-[400px]"
            >
              <div className="bg-card rounded-xl shadow-lg p-6 border border-border/50 backdrop-blur-sm sticky top-4">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex justify-between items-center py-2 border-b border-border/50"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                    </motion.div>
                  ))}
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>€5.00</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border/50">
                      <span>Total</span>
                      <span className="text-primary">€{(total + 5).toFixed(2)}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Continue to Payment'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 