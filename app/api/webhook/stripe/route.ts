import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendOrderStatusEmail } from '@/lib/email';

interface OrderItem {
  order_id: string;
  product_id: string | undefined;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public'
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

      // Check if order already exists
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_session_id', session.id)
        .single();

      if (existingOrder) {
        console.log('Order already exists for session:', session.id);
        return NextResponse.json({ received: true });
      }

      // Get line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product']
      });

      console.log('Retrieved line items:', {
        sessionId: session.id,
        itemsCount: lineItems.data.length,
        items: lineItems.data.map(item => ({
          priceId: item.price?.id,
          productId: (item.price?.product as Stripe.Product)?.metadata?.product_id,
          quantity: item.quantity
        }))
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
        console.error('Error creating order:', {
          error: orderError,
          orderData: {
            user_id: userId,
            total_amount: session.amount_total ? session.amount_total / 100 : 0,
            status: 'processing',
            stripe_session_id: session.id,
          }
        });
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      // Create order items
      const orderItems: OrderItem[] = lineItems.data.map((item) => {
        const product = item.price?.product as Stripe.Product;
        const productId = product?.metadata?.product_id;
        
        console.log('Processing line item:', {
          stripeProductId: product?.id,
          productMetadata: JSON.stringify(product?.metadata),
          supabaseProductId: productId,
          quantity: item.quantity,
          productName: product?.name
        });
        
        if (!productId) {
          console.error('Missing product_id in metadata for product:', {
            stripeProductId: product?.id,
            productName: product?.name,
            metadata: JSON.stringify(product?.metadata)
          });
        }

        // Verify if productId is a valid UUID
        const isValidUUID = productId && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId);
        if (!isValidUUID) {
          console.error('Invalid UUID format for product_id:', {
            productId,
            productName: product?.name
          });
        }
        
        return {
          order_id: order.id,
          product_id: productId,
          quantity: item.quantity || 0,
          unit_price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          total_price: item.amount_total ? item.amount_total / 100 : 0,
        };
      });

      console.log('Created order items:', JSON.stringify(orderItems, null, 2));

      // First verify products exist in Supabase
      for (const item of orderItems) {
        if (!item.product_id) continue;

        const { data: product, error: productError } = await supabase
          .from('products')
          .select('id, name, stock')
          .eq('id', item.product_id)
          .single();

        if (productError || !product) {
          console.error('Product not found in Supabase:', {
            productId: item.product_id,
            error: productError?.message
          });
        } else {
          console.log('Found product in Supabase:', {
            productId: item.product_id,
            name: product.name,
            currentStock: product.stock
          });
        }
      }

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      console.log('Successfully inserted order items into database');

      // Update product stock levels
      for (const item of orderItems) {
        if (!item.product_id) {
          console.error('Skipping stock update for item without product_id:', item);
          continue;
        }

        console.log('Updating stock for product:', {
          productId: item.product_id,
          quantity: item.quantity
        });

        const { error: stockError } = await supabase.rpc('update_product_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });

        if (stockError) {
          console.error(`Failed to update stock for product ${item.product_id}:`, {
            error: stockError.message,
            details: stockError.details,
            hint: stockError.hint
          });
        } else {
          // Verify the stock was actually updated
          const { data: updatedProduct, error: verifyError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();

          if (verifyError) {
            console.error('Failed to verify stock update:', {
              productId: item.product_id,
              error: verifyError.message
            });
          } else {
            console.log(`Stock verification for product ${item.product_id}:`, {
              updatedStock: updatedProduct.stock
            });
          }
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