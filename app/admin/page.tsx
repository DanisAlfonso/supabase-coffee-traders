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
  Cell,
  Legend
} from 'recharts';

interface OrderItem {
  product_id: string;
  quantity: number;
  total_price: number;
  product: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  total_amount: number;
  status: keyof typeof statusColors;
  created_at: string;
  user_id: string;
  order_items?: OrderItem[];
}

interface Product {
  id: string;
  name: string;
  total_sold: number;
  revenue: number;
  image_url: string;
}

// Types
type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  recentOrders: Order[];
  ordersByStatus: { name: string; value: number }[];
  dailyRevenue: { date: string; revenue: number }[];
  topProducts: Product[];
  previousPeriod: {
    revenue: number;
    orders: number;
    customers: number;
    averageOrder: number;
  };
};

const COLORS = ['#FFB547', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'];

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
    ordersByStatus: [],
    dailyRevenue: [],
    topProducts: [],
    previousPeriod: {
      revenue: 0,
      orders: 0,
      customers: 0,
      averageOrder: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        // Get date ranges
        const now = new Date();
        const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const previousPeriodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);

        // Fetch current period orders
        const { data: currentOrders, error: currentOrdersError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(
              product_id,
              quantity,
              total_price,
              product:products(
                name,
                image_url
              )
            )
          `)
          .gte('created_at', currentPeriodStart.toISOString())
          .order('created_at', { ascending: false });

        if (currentOrdersError) throw currentOrdersError;

        // Fetch previous period orders
        const { data: previousPeriodOrders, error: previousOrdersError } = await supabase
          .from('orders')
          .select('*')
          .gte('created_at', previousPeriodStart.toISOString())
          .lt('created_at', currentPeriodStart.toISOString());

        if (previousOrdersError) throw previousOrdersError;

        // Calculate current period stats
        const totalRevenue = currentOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
        const totalOrders = currentOrders?.length || 0;
        const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

        // Calculate previous period stats
        const previousRevenue = previousPeriodOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
        const previousOrders = previousPeriodOrders?.length || 0;
        const previousCustomers = new Set(previousPeriodOrders?.map(order => order.user_id)).size;
        const previousAverageOrder = previousOrders ? previousRevenue / previousOrders : 0;

        // Get unique customers
        const uniqueCustomers = new Set(currentOrders?.map(order => order.user_id));

        // Calculate orders by status
        const ordersByStatus = Object.entries(
          currentOrders?.reduce((acc: Record<string, number>, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {}) || {}
        ).map(([name, value]) => ({ name, value }));

        // Calculate daily revenue
        const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const revenue = currentOrders?.reduce((sum, order) => {
            const orderDate = order.created_at.split('T')[0];
            return orderDate === dateStr ? sum + order.total_amount : sum;
          }, 0) || 0;

          return {
            date: dateStr,
            revenue,
          };
        }).reverse();

        // Calculate top products
        const productStats: Record<string, Product> = {};
        currentOrders?.forEach((order: Order) => {
          order.order_items?.forEach((item: OrderItem) => {
            if (!productStats[item.product_id]) {
              productStats[item.product_id] = {
                id: item.product_id,
                name: item.product.name,
                image_url: item.product.image_url,
                total_sold: 0,
                revenue: 0,
              };
            }
            productStats[item.product_id].total_sold += item.quantity;
            productStats[item.product_id].revenue += item.total_price;
          });
        });

        const topProducts = Object.values(productStats)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        setStats({
          totalRevenue,
          totalOrders,
          totalCustomers: uniqueCustomers.size,
          averageOrderValue,
          recentOrders: currentOrders?.slice(0, 5) || [],
          ordersByStatus,
          dailyRevenue,
          topProducts,
          previousPeriod: {
            revenue: previousRevenue,
            orders: previousOrders,
            customers: previousCustomers,
            averageOrder: previousAverageOrder,
          },
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

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
      trend: calculateTrend(stats.totalRevenue, stats.previousPeriod.revenue),
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      trend: calculateTrend(stats.totalOrders, stats.previousPeriod.orders),
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      trend: calculateTrend(stats.totalCustomers, stats.previousPeriod.customers),
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Average Order Value',
      value: `€${stats.averageOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      trend: calculateTrend(stats.averageOrderValue, stats.previousPeriod.averageOrder),
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
                    <span className="text-sm font-medium">{Math.abs(stat.trend).toFixed(1)}%</span>
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
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6">Order Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6">Recent Orders</h3>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => {
                const StatusIcon = statusIcons[order.status];
                return (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${statusColors[order.status]}`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{order.total_amount.toFixed(2)}</p>
                      <p className={`text-sm ${statusColors[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6">Top Selling Products</h3>
            <div className="space-y-4">
              {stats.topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.total_sold} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{product.revenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 