import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing STRIPE_WEBHOOK_SECRET');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia'
});

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

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('No Stripe signature found');
    return new NextResponse('No Stripe signature', { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Received webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Processing completed checkout session:', session.id);

      // Get the customer details
      const customer = {
        email: session.customer_details?.email || '',
        name: session.customer_details?.name || '',
      };

      // Get the line items with expanded price.product data
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          expand: ['data.price.product']
        }
      );

      // Get our database products by name
      const { data: dbProducts, error: productsError } = await supabase
        .from('products')
        .select('id, name');

      if (productsError) {
        console.error('Error fetching products:', productsError);
        return new NextResponse(JSON.stringify({ error: productsError }), { status: 500 });
      }

      // Create a map of product names to database IDs
      const productNameToId = Object.fromEntries(
        dbProducts.map(p => [p.name, p.id])
      );

      // Log for debugging
      console.log('Database products:', dbProducts);
      console.log('Product name to ID map:', productNameToId);

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.metadata?.userId,
          status: 'processing',
          total_amount: session.amount_total ? session.amount_total / 100 : 0,
          shipping_address_line1: session.shipping_details?.address?.line1 || '',
          shipping_address_line2: session.shipping_details?.address?.line2 || '',
          shipping_city: session.shipping_details?.address?.city || '',
          shipping_postal_code: session.shipping_details?.address?.postal_code || '',
          shipping_country: session.shipping_details?.address?.country || '',
          shipping_fee: 0,
          customer_name: customer.name,
          customer_email: customer.email,
          stripe_session_id: session.id
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        return new NextResponse(JSON.stringify({ error: orderError }), { status: 500 });
      }

      // Create order items using our database product IDs
      const orderItems = await Promise.all(
        lineItems.data.map(async (item) => {
          const stripeProduct = item.price?.product as Stripe.Product;
          const productName = stripeProduct.name;
          const dbProductId = productNameToId[productName];
          
          console.log('Processing line item:', {
            stripeName: productName,
            dbProductId,
            quantity: item.quantity,
            unitPrice: item.price?.unit_amount
          });
          
          if (!dbProductId) {
            console.error('Product not found:', productName);
          }
          
          return {
            order_id: order.id,
            product_id: dbProductId,
            quantity: item.quantity || 0,
            unit_price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
            total_price: item.amount_total ? item.amount_total / 100 : 0
          };
        })
      );

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        return new NextResponse(JSON.stringify({ error: itemsError }), { status: 500 });
      }

      console.log('Order created successfully:', order.id);
    }

    return new NextResponse(JSON.stringify({ received: true }));
  } catch (err) {
    console.error('Webhook error:', err);
    return new NextResponse(
      JSON.stringify({ error: 'Webhook handler failed' }),
      { status: 400 }
    );
  }
} 