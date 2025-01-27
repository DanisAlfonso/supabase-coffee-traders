'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    }
  }
);

interface ProductStats {
  id: string;
  name: string;
  image_url: string;
  total_sold: number;
  revenue: number;
}

interface OrderItem {
  product_id: string;
  product: {
    name: string;
    image_url: string;
  };
  quantity: number;
  total_price: number;
}

interface Order {
  order_items?: OrderItem[];
}

export async function getCustomersWithOrders(sortField: string = 'created_at', sortDirection: 'asc' | 'desc' = 'desc') {
  try {
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .order(sortField, { ascending: sortDirection === 'asc' });

    if (usersError) throw usersError;

    // Fetch orders for each user
    const customersWithOrders = await Promise.all(
      (users || []).map(async (user) => {
        const { data: orders, error: ordersError } = await supabaseAdmin
          .from('orders')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            user_id
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error('Error fetching orders for user:', user.id, ordersError);
          return {
            ...user,
            orders: [],
          };
        }

        return {
          ...user,
          orders: orders || [],
        };
      })
    );

    return { customers: customersWithOrders };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return { error: 'Failed to fetch customers' };
  }
}

export async function getOrders() {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(
            name,
            image_url
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { orders };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { error: 'Failed to fetch orders' };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    // Get the current order to check the previous status
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(
            name,
            image_url
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    const previousStatus = order.status;

    // Update the order status
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (updateError) throw updateError;

    // Get the updated order
    const { data: updatedOrder, error: getUpdatedError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(
            name,
            image_url
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (getUpdatedError) throw getUpdatedError;

    // Send email notification about status change
    await import('@/lib/email')
      .then(({ sendOrderStatusEmail }) => sendOrderStatusEmail(updatedOrder, previousStatus));

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { error: 'Failed to update order status' };
  }
}

export async function getDashboardStats() {
  try {
    // Get date ranges
    const now = new Date();
    const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const previousPeriodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);

    // Fetch current period orders
    const { data: currentOrders, error: currentOrdersError } = await supabaseAdmin
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
    const { data: previousPeriodOrders, error: previousOrdersError } = await supabaseAdmin
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
    const productStats: Record<string, ProductStats> = {};
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

    return {
      stats: {
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
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { error: 'Failed to fetch dashboard stats' };
  }
} 