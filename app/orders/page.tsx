'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Order } from '@/types/order';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Package, Truck, CheckCircle, XCircle, Clock, Search, SortAsc, SortDesc, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

const ORDERS_PER_PAGE = 5;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'created_at' | 'total_amount'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  // Order summary calculations
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

        console.log('Orders query result:', { ordersData, ordersError });

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          throw ordersError;
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

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'created_at') {
        return direction * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      }
      return direction * (a[sortField] - b[sortField]);
    });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

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

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
          <p className="text-2xl font-bold">€{totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Active Orders</h3>
          <p className="text-2xl font-bold">{statusCounts['processing'] || 0}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Delivered Orders</h3>
          <p className="text-2xl font-bold">{statusCounts['delivered'] || 0}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border bg-background"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-md border bg-background"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className="flex items-center gap-2">
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as 'created_at' | 'total_amount')}
            className="px-4 py-2 rounded-md border bg-background"
          >
            <option value="created_at">Sort by Date</option>
            <option value="total_amount">Sort by Amount</option>
          </select>
          <button
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-md border bg-background hover:bg-muted"
          >
            {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {paginatedOrders.map((order) => {
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

              <div className="mt-4 flex justify-between items-center border-t pt-4">
                <div className="font-medium">
                  Total: €{order.total_amount.toFixed(2)}
                </div>
                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-md hover:bg-primary/20 transition-colors"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Link>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md border bg-background hover:bg-muted disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  currentPage === i + 1
                    ? 'bg-primary text-primary-foreground'
                    : 'border bg-background hover:bg-muted'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md border bg-background hover:bg-muted disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 