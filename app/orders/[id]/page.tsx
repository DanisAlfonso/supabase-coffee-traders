'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/order';
import { format } from 'date-fns';
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import DownloadInvoiceButton from '@/app/components/orders/DownloadInvoiceButton';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
} as const;

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
} as const;

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  async function fetchOrder() {
    if (!user || !id) {
      setLoading(false);
      return;
    }

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products(*)
          )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (orderError) {
        console.error('Error fetching order:', orderError);
        throw orderError;
      }

      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  }

  const updateOrderStatus = async (newStatus: string) => {
    if (!order || updating) return;

    try {
      setUpdating(true);
      setError(null);

      const response = await fetch(`/api/orders/${order.id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order status');
      }

      // Refresh order data
      await fetchOrder();
    } catch (error) {
      console.error('Error updating order status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [user, id]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground">
          You need to be signed in to view order details.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const StatusIcon = statusIcons[order.status];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background before:absolute before:inset-0 before:bg-[url('/noise.png')] before:opacity-[0.02] before:mix-blend-overlay relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="container mx-auto px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors group"
          >
            <motion.span
              initial={{ x: 0 }}
              animate={{ x: -3 }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.span>
            Back to Orders
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm p-8 relative overflow-hidden group"
        >
          {/* Order Header */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8 pb-6 border-b border-border/50">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Order Details
              </h1>
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Order #{order.order_number}
                  </h1>
                  <div className="flex items-center gap-4">
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    <p className="text-muted-foreground">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DownloadInvoiceButton order={order} />
              {(order.status === 'pending' || order.status === 'processing') && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateOrderStatus('cancelled')}
                  disabled={updating}
                  className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Cancel Order
                    </>
                  )}
                </motion.button>
              )}
              <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${statusColors[order.status]} bg-opacity-[0.15] backdrop-blur-sm`}>
                <StatusIcon className="w-5 h-5" />
                <span className="font-medium capitalize">{order.status}</span>
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 text-red-500 rounded-lg flex items-center gap-2 backdrop-blur-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {/* Order Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Order Timeline
            </h2>
            <div className="relative">
              <div className="absolute left-2.5 top-0 h-full w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent"></div>
              <div className="space-y-6">
                {order.status !== 'cancelled' && (
                  <>
                    <div className="relative flex gap-4">
                      <div className={`w-5 h-5 rounded-full ${order.status === 'processing' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-green-400 to-green-600'} flex-shrink-0 mt-1 shadow-lg`}></div>
                      <div>
                        <p className="font-medium text-foreground/90">Order Confirmed</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.created_at), 'MMMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                    {(order.status === 'shipped' || order.status === 'delivered') && (
                      <div className="relative flex gap-4">
                        <div className={`w-5 h-5 rounded-full ${order.status === 'delivered' ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'} flex-shrink-0 mt-1 shadow-lg`}></div>
                        <div>
                          <p className="font-medium text-foreground/90">Order Shipped</p>
                          <p className="text-sm text-muted-foreground">Your order is on its way</p>
                        </div>
                      </div>
                    )}
                    {order.status === 'delivered' && (
                      <div className="relative flex gap-4">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex-shrink-0 mt-1 shadow-lg"></div>
                        <div>
                          <p className="font-medium text-foreground/90">Order Delivered</p>
                          <p className="text-sm text-muted-foreground">Package has been delivered</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {order.status === 'cancelled' && (
                  <div className="relative flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex-shrink-0 mt-1 shadow-lg"></div>
                    <div>
                      <p className="font-medium text-foreground/90">Order Cancelled</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.updated_at), 'MMMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Order Items
            </h2>
            <div className="divide-y divide-border/50">
              {order.items?.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden group-hover:shadow-md transition-all duration-300">
                    {item.product && (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-foreground/90">
                      {item.product?.name || 'Product Unavailable'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-foreground/90">
                      €{item.unit_price.toFixed(2)} each
                    </p>
                    <p className="font-medium mt-1 text-foreground/90">
                      Total: €{item.total_price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Shipping Information
            </h2>
            <div className="bg-muted/30 backdrop-blur-sm rounded-lg p-6 border border-border/50">
              <p className="font-medium text-foreground/90">{order.customer_name}</p>
              <p className="text-muted-foreground">{order.shipping_address_line1}</p>
              {order.shipping_address_line2 && (
                <p className="text-muted-foreground">{order.shipping_address_line2}</p>
              )}
              <p className="text-muted-foreground">
                {order.shipping_city}, {order.shipping_postal_code}
              </p>
              <p className="text-muted-foreground">{order.shipping_country}</p>
              {order.customer_phone && (
                <p className="mt-2 text-muted-foreground">Phone: {order.customer_phone}</p>
              )}
              <p className="mt-2 text-muted-foreground">Email: {order.customer_email}</p>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Order Summary
            </h2>
            <div className="bg-muted/30 backdrop-blur-sm rounded-lg p-6 border border-border/50">
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>€{(order.total_amount - order.shipping_fee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>€{order.shipping_fee.toFixed(2)}</span>
                </div>
                <div className="border-t border-border/50 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg text-foreground/90">
                    <span>Total</span>
                    <span>€{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 