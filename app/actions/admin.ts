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