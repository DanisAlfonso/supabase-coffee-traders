'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Types
type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  recentOrders: Order[];
  ordersByStatus: Record<string, number>;
  dailyRevenue: { date: string; revenue: number }[];
};

interface Order {
  id: string;
  customer_email: string;
  total_amount: number;
  status: keyof typeof statusColors;
  created_at: string;
  user_id: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    recentOrders: [],
    ordersByStatus: {},
    dailyRevenue: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        // Fetch orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Calculate stats
        const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
        const totalOrders = orders?.length || 0;
        const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

        // Get unique customers
        const uniqueCustomers = new Set(orders?.map(order => order.user_id));

        // Calculate orders by status
        const ordersByStatus = orders?.reduce((acc: Record<string, number>, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});

        // Calculate daily revenue for the last 7 days
        const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const revenue = orders?.reduce((sum, order) => {
            const orderDate = order.created_at.split('T')[0];
            return orderDate === dateStr ? sum + order.total_amount : sum;
          }, 0) || 0;

          return {
            date: dateStr,
            revenue,
          };
        }).reverse();

        setStats({
          totalRevenue,
          totalOrders,
          totalCustomers: uniqueCustomers.size,
          averageOrderValue,
          recentOrders: orders?.slice(0, 5) || [],
          ordersByStatus: ordersByStatus || {},
          dailyRevenue,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `€${stats.totalRevenue.toFixed(2)}`,
      icon: CreditCard,
      trend: 12.5,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      trend: 8.2,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      trend: 5.1,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Average Order Value',
      value: `€${stats.averageOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      trend: -2.3,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 ${
                    stat.trend > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.trend > 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{Math.abs(stat.trend)}%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `€${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`€${value}`, 'Revenue']}
                  labelFormatter={(label: string) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={{ fill: '#6366F1', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Orders by Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6">Orders by Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(stats.ordersByStatus).map(([status, count]) => ({
                    name: status,
                    value: count,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {Object.entries(stats.ordersByStatus).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {Object.entries(stats.ordersByStatus).map(([status, count], index) => (
                <div key={status} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm capitalize">{status}</span>
                  <span className="text-sm font-medium">({count})</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.recentOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                  return (
                    <tr key={order.id}>
                      <td className="py-4 font-mono text-sm">#{order.id.slice(0, 8)}</td>
                      <td className="py-4">{order.customer_email}</td>
                      <td className="py-4">€{order.total_amount.toFixed(2)}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[order.status as keyof typeof statusColors]
                        }`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 