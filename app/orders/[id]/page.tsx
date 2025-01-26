'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/order';
import { format } from 'date-fns';
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import DownloadInvoiceButton from '@/app/components/orders/DownloadInvoiceButton';

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
  const { user } = useAuth();

  useEffect(() => {
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </div>

      <div className="bg-card rounded-lg shadow-sm border p-6">
        {/* Order Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8 pb-6 border-b">
          <div>
            <h1 className="text-2xl font-bold mb-2">Order Details</h1>
            <p className="text-sm text-muted-foreground">
              Placed on {format(new Date(order.created_at), 'MMMM d, yyyy')}
            </p>
            <p className="text-sm font-mono">#{order.id}</p>
          </div>
          <div className="flex items-center gap-4">
            <DownloadInvoiceButton order={order} />
            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${statusColors[order.status]}`}>
              <StatusIcon className="w-5 h-5" />
              <span className="font-medium capitalize">{order.status}</span>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
          <div className="relative">
            <div className="absolute left-2.5 top-0 h-full w-0.5 bg-border"></div>
            <div className="space-y-6">
              {order.status !== 'cancelled' && (
                <>
                  <div className="relative flex gap-4">
                    <div className={`w-5 h-5 rounded-full ${order.status === 'processing' ? 'bg-blue-500' : 'bg-green-500'} flex-shrink-0 mt-1`}></div>
                    <div>
                      <p className="font-medium">Order Confirmed</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.created_at), 'MMMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  {(order.status === 'shipped' || order.status === 'delivered') && (
                    <div className="relative flex gap-4">
                      <div className={`w-5 h-5 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'} flex-shrink-0 mt-1`}></div>
                      <div>
                        <p className="font-medium">Order Shipped</p>
                        <p className="text-sm text-muted-foreground">Your order is on its way</p>
                      </div>
                    </div>
                  )}
                  {order.status === 'delivered' && (
                    <div className="relative flex gap-4">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 mt-1"></div>
                      <div>
                        <p className="font-medium">Order Delivered</p>
                        <p className="text-sm text-muted-foreground">Package has been delivered</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              {order.status === 'cancelled' && (
                <div className="relative flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex-shrink-0 mt-1"></div>
                  <div>
                    <p className="font-medium">Order Cancelled</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.updated_at), 'MMMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="divide-y">
            {order.items?.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                <div className="relative h-24 w-24 flex-shrink-0">
                  {item.product && (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">
                    {item.product?.name || 'Product Unavailable'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm">
                    €{item.unit_price.toFixed(2)} each
                  </p>
                  <p className="font-medium mt-1">
                    Total: €{item.total_price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="font-medium">{order.customer_name}</p>
            <p>{order.shipping_address_line1}</p>
            {order.shipping_address_line2 && (
              <p>{order.shipping_address_line2}</p>
            )}
            <p>{order.shipping_city}, {order.shipping_postal_code}</p>
            <p>{order.shipping_country}</p>
            {order.customer_phone && (
              <p className="mt-2">Phone: {order.customer_phone}</p>
            )}
            <p className="mt-2">Email: {order.customer_email}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{(order.total_amount - order.shipping_fee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>€{order.shipping_fee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>€{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 