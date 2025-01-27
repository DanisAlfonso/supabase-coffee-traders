'use client';

import { useState, useEffect } from 'react';
import { getCustomersWithOrders } from '@/app/actions/admin';
import { 
  Search, 
  ArrowUpDown,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  X,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface Customer {
  id: string;
  email: string;
  created_at: string;
  metadata: {
    name?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      postal_code?: string;
      country?: string;
    };
  };
  orders: {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
  }[];
}

const CUSTOMERS_PER_PAGE = 10;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'email' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [sortField, sortDirection]);

  async function fetchCustomers() {
    try {
      const result = await getCustomersWithOrders(sortField, sortDirection);
      
      if ('error' in result) {
        throw new Error(result.error);
      }

      setCustomers(result.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (field: 'email' | 'created_at') => {
    setSortDirection(current => {
      if (sortField !== field) return 'asc';
      return current === 'asc' ? 'desc' : 'asc';
    });
    setSortField(field);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.metadata?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.metadata?.phone?.includes(searchQuery)
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * CUSTOMERS_PER_PAGE,
    currentPage * CUSTOMERS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE);

  const exportToCSV = () => {
    const headers = [
      'Email',
      'Name',
      'Phone',
      'Address',
      'Total Orders',
      'Total Spent',
      'Join Date'
    ];

    const csvData = filteredCustomers.map(customer => [
      customer.email,
      customer.metadata?.name || '',
      customer.metadata?.phone || '',
      customer.metadata?.address
        ? `${customer.metadata.address.line1}, ${customer.metadata.address.city}, ${customer.metadata.address.country}`
        : '',
      customer.orders.length,
      `€${customer.orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}`,
      new Date(customer.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_export_${new Date().toISOString()}.csv`);
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
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your customer base</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Spent
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Join Date</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedCustomers.map((customer) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsDetailsModalOpen(true);
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {customer.metadata?.name?.[0]?.toUpperCase() || customer.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">
                          {customer.metadata?.name || 'No name provided'}
                        </div>
                        {customer.metadata?.phone && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {customer.metadata.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {customer.orders.length} orders
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    €{customer.orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(customer.created_at), 'MMM d, yyyy')}
                  </td>
                </motion.tr>
              ))}
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
                    {(currentPage - 1) * CUSTOMERS_PER_PAGE + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * CUSTOMERS_PER_PAGE, filteredCustomers.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{filteredCustomers.length}</span>{' '}
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

      {/* Customer Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedCustomer && (
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
                    <h3 className="text-lg font-semibold">Customer Details</h3>
                    <button
                      onClick={() => setIsDetailsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary text-xl font-medium">
                            {selectedCustomer.metadata?.name?.[0]?.toUpperCase() || 
                             selectedCustomer.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xl font-medium">
                            {selectedCustomer.metadata?.name || 'No name provided'}
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400">
                            Customer since {format(new Date(selectedCustomer.created_at), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                      </div>
                      {selectedCustomer.metadata?.phone && (
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{selectedCustomer.metadata.phone}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    {selectedCustomer.metadata?.address && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>Shipping Address</span>
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <p>{selectedCustomer.metadata.address.line1}</p>
                          {selectedCustomer.metadata.address.line2 && (
                            <p>{selectedCustomer.metadata.address.line2}</p>
                          )}
                          <p>
                            {selectedCustomer.metadata.address.city}, {selectedCustomer.metadata.address.postal_code}
                          </p>
                          <p>{selectedCustomer.metadata.address.country}</p>
                        </div>
                      </div>
                    )}

                    {/* Order History */}
                    <div>
                      <h4 className="font-medium mb-4 flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4" />
                        <span>Order History</span>
                      </h4>
                      <div className="space-y-4">
                        {selectedCustomer.orders.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
                        ) : (
                          selectedCustomer.orders.map((order) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                            >
                              <div>
                                <p className="font-medium">#{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {format(new Date(order.created_at), 'MMM d, yyyy')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">€{order.total_amount.toFixed(2)}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                  {order.status}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Customer Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                        <p className="text-2xl font-bold">{selectedCustomer.orders.length}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                        <p className="text-2xl font-bold">
                          €{selectedCustomer.orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Order Value</p>
                        <p className="text-2xl font-bold">
                          €{(selectedCustomer.orders.reduce((sum, order) => sum + order.total_amount, 0) / 
                             (selectedCustomer.orders.length || 1)).toFixed(2)}
                        </p>
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