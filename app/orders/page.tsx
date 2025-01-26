'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Order } from '@/types/order';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        console.log('No user found in fetchOrders');
        setLoading(false);
        return;
      }

      console.log('Fetching orders for user:', user.id);
      try {
        console.log('Making Supabase query...');
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(
              *,
              product:products(*)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          throw ordersError;
        }
        
        console.log('Orders data:', ordersData);
        console.log('Number of orders:', ordersData?.length || 0);
        if (ordersData && ordersData.length > 0) {
          console.log('First order:', ordersData[0]);
        }
        
        setOrders(ordersData || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground">
          You need to be signed in to view your orders.
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

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-muted-foreground mb-8">
          You haven&apos;t placed any orders yet.
        </p>
        <a
          href="/products"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const StatusIcon = statusIcons[order.status];
          return (
            <div
              key={order.id}
              className="bg-card rounded-lg shadow-sm border p-6"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Order placed{' '}
                    {format(new Date(order.created_at), 'MMMM d, yyyy')}
                  </p>
                  <p className="text-sm font-mono">#{order.id}</p>
                </div>
                <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${statusColors[order.status]}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>

              <div className="divide-y">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      {item.product && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="object-cover rounded"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {item.product?.name || 'Product Unavailable'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        €{item.unit_price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">
                    €{order.total_amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Shipping: €{order.shipping_fee.toFixed(2)}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <p className="text-sm text-muted-foreground">
                  {order.shipping_address_line1}
                  {order.shipping_address_line2 && (
                    <>
                      <br />
                      {order.shipping_address_line2}
                    </>
                  )}
                  <br />
                  {order.shipping_city}, {order.shipping_postal_code}
                  <br />
                  {order.shipping_country}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 