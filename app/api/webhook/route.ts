import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendOrderStatusEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      persistSession: false,
    }
  }
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig || !endpointSecret) {
    return NextResponse.json(
      { message: 'Missing stripe signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { message: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;

      if (!userId) {
        throw new Error('No user ID in session metadata');
      }

      // Get line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product']
      });

      // Parse shipping address from metadata
      const shippingAddress = session.metadata?.shipping_address ? 
        JSON.parse(session.metadata.shipping_address) : null;

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: session.amount_total ? session.amount_total / 100 : 0,
          shipping_fee: session.total_details?.amount_shipping ? session.total_details.amount_shipping / 100 : 0,
          status: 'processing',
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          shipping_address_line1: shippingAddress.line1,
          shipping_address_line2: shippingAddress.line2 || null,
          shipping_city: shippingAddress.city,
          shipping_postal_code: shippingAddress.postal_code,
          shipping_country: shippingAddress.country,
          customer_email: session.metadata?.customer_email || '',
          customer_name: session.metadata?.shipping_name || '',
          customer_phone: session.metadata?.shipping_phone || null,
        })
        .select()
        .single();

      if (orderError) {
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      // Create order items
      const orderItems = lineItems.data.map((item) => {
        const product = item.price?.product as Stripe.Product;
        return {
          order_id: order.id,
          product_id: product.metadata?.product_id, // Get the actual product ID from metadata
          quantity: item.quantity,
          unit_price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          total_price: item.amount_total ? item.amount_total / 100 : 0,
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      // Update product stock levels
      for (const item of orderItems) {
        const { error: stockError } = await supabase.rpc('update_product_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });

        if (stockError) {
          console.error(`Failed to update stock for product ${item.product_id}:`, stockError);
        }
      }

      // Send order confirmation email
      try {
        console.log('Preparing order data for email:', {
          orderId: order.id,
          customerEmail: order.customer_email,
          itemsCount: orderItems.length
        });

        const orderWithItems = {
          ...order,
          items: orderItems.map(item => ({
            ...item,
            product: {
              name: (lineItems.data.find(li => 
                li.price?.product && 
                (li.price.product as Stripe.Product).metadata?.product_id === item.product_id
              )?.price?.product as Stripe.Product)?.name || 'Unknown Product'
            }
          }))
        };

        console.log('Prepared order data:', {
          orderId: orderWithItems.id,
          customerEmail: orderWithItems.customer_email,
          items: orderWithItems.items.map(item => ({
            productName: item.product.name,
            quantity: item.quantity,
            total: item.total_price
          }))
        });

        await sendOrderStatusEmail(orderWithItems, 'pending');
        console.log('Order confirmation email sent successfully');
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', {
          error: emailError,
          errorMessage: emailError instanceof Error ? emailError.message : 'Unknown error',
          order: {
            id: order.id,
            customerEmail: order.customer_email
          }
        });
        // Don't throw here, as the order was still created successfully
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { 
        message: 'Webhook handler failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 