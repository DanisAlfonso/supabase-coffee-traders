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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Shipping Information */}
          <div className="flex-grow space-y-6">
            <h1 className="text-2xl font-bold">Shipping Information</h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={shippingInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address Line 1</label>
                <input
                  type="text"
                  value={shippingInfo.address.line1}
                  onChange={(e) => handleInputChange('address.line1', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Street address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address Line 2</label>
                <input
                  type="text"
                  value={shippingInfo.address.line2}
                  onChange={(e) => handleInputChange('address.line2', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={shippingInfo.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code</label>
                  <input
                    type="text"
                    value={shippingInfo.address.postal_code}
                    onChange={(e) => handleInputChange('address.postal_code', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Postal code"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <select
                  value={shippingInfo.address.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="DE">Germany</option>
                  <option value="AT">Austria</option>
                  <option value="FR">France</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="GB">United Kingdom</option>
                  <option value="IE">Ireland</option>
                  <option value="BE">Belgium</option>
                  <option value="NL">Netherlands</option>
                  <option value="LU">Luxembourg</option>
                </select>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>€5.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>€{(total + 5).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={saving || !shippingInfo.name || !shippingInfo.address.line1}
                className="w-full mt-6 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 