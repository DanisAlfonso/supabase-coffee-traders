import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendOrderStatusEmail } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    const { id } = params;

    // Validate the status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid status' }),
        { status: 400 }
      );
    }

    // Get the current order with all necessary fields for email
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return new NextResponse(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404 }
      );
    }

    // Store previous status for email notification
    const previousStatus = order.status;

    // Validate status transition
    const allowedTransitions: Record<string, string[]> = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: [], // Final state
      cancelled: [], // Final state
    };

    if (!allowedTransitions[previousStatus]?.includes(status)) {
      return new NextResponse(
        JSON.stringify({ 
          error: `Cannot transition from ${previousStatus} to ${status}` 
        }),
        { status: 400 }
      );
    }

    // Update the order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to update order status' }),
        { status: 500 }
      );
    }

    // Send email notification
    try {
      await sendOrderStatusEmail({ ...order, status }, previousStatus);
    } catch (emailError) {
      console.error('Error sending status update email:', emailError);
      // Don't return error response here, as the status update was successful
    }

    return new NextResponse(
      JSON.stringify({ 
        message: 'Order status updated successfully',
        status 
      })
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 