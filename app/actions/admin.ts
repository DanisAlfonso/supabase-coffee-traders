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