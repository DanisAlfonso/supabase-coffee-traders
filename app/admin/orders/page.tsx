'use client';

import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/app/actions/admin';
import { 
  Search, 
  ArrowUpDown,
  Clock,
  Package,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_fee: number;
  stripe_session_id: string | null;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
} as const;

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: TrendingUp,
  delivered: CheckCircle2,
  cancelled: XCircle,
} as const;

const ORDERS_PER_PAGE = 10;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { orders: fetchedOrders, error } = await getOrders();
      if (error) throw error;
      setOrders(fetchedOrders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    const matchesDate = 
      (!dateRange.start || new Date(order.created_at) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(order.created_at) <= new Date(dateRange.end));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await updateOrderStatus(orderId, newStatus);
      if (error) throw error;
      
      // Refresh orders list
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Order ID',
      'Customer',
      'Email',
      'Status',
      'Total Amount',
      'Date',
      'Shipping Address',
    ];

    const csvData = filteredOrders.map(order => [
      order.id,
      order.customer_name,
      order.customer_email,
      order.status,
      `€${order.total_amount.toFixed(2)}`,
      new Date(order.created_at).toLocaleDateString(),
      `${order.shipping_address_line1}, ${order.shipping_city}, ${order.shipping_postal_code}, ${order.shipping_country}`,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and track all orders</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center space-x-1">
                    <span>Order ID</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center space-x-1">
                    <span>Customer</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedOrders.map((order) => {
                const StatusIcon = statusIcons[order.status];
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDetailsModalOpen(true);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.customer_name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {order.customer_email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      €{order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[order.status]
                      }`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(order.created_at), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(order.id, e.target.value as Order['status']);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * ORDERS_PER_PAGE + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{filteredOrders.length}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-primary border-primary text-primary-foreground'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Order Details</h3>
                    <button
                      onClick={() => setIsDetailsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                        <p className="font-mono">{selectedOrder.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                        <p>{format(new Date(selectedOrder.created_at), 'PPP')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[selectedOrder.status]
                        }`}>
                          {(() => {
                            const StatusIcon = statusIcons[selectedOrder.status];
                            return <StatusIcon className="w-3 h-3 mr-1" />;
                          })()}
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                        <p className="font-medium">€{selectedOrder.total_amount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div>
                      <h4 className="font-medium mb-2">Customer Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                          <p>{selectedOrder.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                          <p>{selectedOrder.customer_email}</p>
                        </div>
                        {selectedOrder.customer_phone && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                            <p>{selectedOrder.customer_phone}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <p>{selectedOrder.shipping_address_line1}</p>
                      {selectedOrder.shipping_address_line2 && (
                        <p>{selectedOrder.shipping_address_line2}</p>
                      )}
                      <p>
                        {selectedOrder.shipping_city}, {selectedOrder.shipping_postal_code}
                      </p>
                      <p>{selectedOrder.shipping_country}</p>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-2">Order Items</h4>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                          >
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.product.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Quantity: {item.quantity} × €{item.unit_price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">€{item.total_price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
                          <p>€{(selectedOrder.total_amount - selectedOrder.shipping_fee).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-500 dark:text-gray-400">Shipping</p>
                          <p>€{selectedOrder.shipping_fee.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between font-medium text-lg pt-2">
                          <p>Total</p>
                          <p>€{selectedOrder.total_amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 