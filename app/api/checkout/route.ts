import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Stripe from 'stripe';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

// Get the base URL for the application
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Check for explicit base URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  }
  // Fallback for local development
  return 'http://localhost:3000';
};

// Validate if a string is a valid URL
const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch (_) {
    return false;
  }
};

export async function POST(request: Request) {
  try {
    const { items, shippingInfo } = await request.json() as { 
      items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        image_url?: string;
      }>;
      shippingInfo: {
        name: string;
        phone: string;
        address: {
          line1: string;
          line2?: string;
          city: string;
          postal_code: string;
          country: string;
        };
      };
    };

    // Create Supabase server client
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name);
            return cookie?.value ?? '';
          },
          set(_name: string, _value: string, _options: CookieOptions) {
            // Implementation not needed for this route
          },
          remove(_name: string, _options: CookieOptions) {
            // Implementation not needed for this route
          },
        },
      }
    );

    // Get user data from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { message: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Create line items for Stripe with validated image URLs
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: item.image_url && isValidUrl(item.image_url) ? [item.image_url] : [],
          metadata: {
            product_id: item.id
          }
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const baseUrl = getBaseUrl();

    // Construct and validate URLs
    const successUrl = new URL('/orders/success', baseUrl).toString() + '?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = new URL('/checkout', baseUrl).toString() + '?canceled=true';

    try {
      // First, create or update a Stripe customer with shipping details
      const { data: customers } = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      let customerId: string;

      if (customers.length > 0) {
        // Update existing customer
        const customer = await stripe.customers.update(customers[0].id, {
          shipping: {
            name: shippingInfo.name,
            phone: shippingInfo.phone,
            address: {
              line1: shippingInfo.address.line1,
              line2: shippingInfo.address.line2 || undefined,
              city: shippingInfo.address.city,
              postal_code: shippingInfo.address.postal_code,
              country: shippingInfo.address.country,
            },
          },
        });
        customerId = customer.id;
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: shippingInfo.name,
          shipping: {
            name: shippingInfo.name,
            phone: shippingInfo.phone,
            address: {
              line1: shippingInfo.address.line1,
              line2: shippingInfo.address.line2 || undefined,
              city: shippingInfo.address.city,
              postal_code: shippingInfo.address.postal_code,
              country: shippingInfo.address.country,
            },
          },
        });
        customerId = customer.id;
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['ES', 'DE', 'FR', 'IT', 'GB', 'IE', 'BE', 'NL', 'AT', 'PL'],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 500,
                currency: 'eur',
              },
              display_name: 'Standard shipping',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 3,
                },
                maximum: {
                  unit: 'business_day',
                  value: 5,
                },
              },
            },
          },
        ],
        metadata: {
          user_id: user.id,
          customer_email: user.email || '',
          shipping_name: shippingInfo.name,
          shipping_phone: shippingInfo.phone,
          shipping_address: JSON.stringify(shippingInfo.address),
        },
      });

      return NextResponse.json({ sessionId: session.id });
    } catch (stripeError) {
      console.error('Stripe session creation error:', stripeError);
      return NextResponse.json(
        { 
          message: 'Failed to create checkout session',
          error: stripeError instanceof Error ? stripeError.message : 'Unknown error',
          urls: {
            success: successUrl,
            cancel: cancelUrl
          }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to process checkout request',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}