import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Log all webhook events for debugging
    console.log('Webhook Event Type:', payload.type);
    console.log('Full Webhook Payload:', JSON.stringify(payload, null, 2));

    switch (payload.type) {
      case 'email.sent':
        console.log('Email sent:', {
          emailId: payload.data.email_id,
          to: payload.data.to,
          subject: payload.data.subject,
          timestamp: new Date(payload.data.created_at).toISOString()
        });
        break;

      case 'email.delivered':
        console.log('Email delivered:', {
          emailId: payload.data.email_id,
          to: payload.data.to,
          timestamp: new Date(payload.data.created_at).toISOString()
        });
        break;

      case 'email.delivery_delayed':
        console.error('Email delivery delayed:', {
          emailId: payload.data.email_id,
          to: payload.data.to,
          reason: payload.data.reason,
          timestamp: new Date(payload.data.created_at).toISOString()
        });
        break;

      case 'email.bounced':
        console.error('Email bounced:', {
          emailId: payload.data.email_id,
          to: payload.data.to,
          reason: payload.data.reason,
          timestamp: new Date(payload.data.created_at).toISOString()
        });
        break;

      case 'email.complained':
        console.error('Email complained:', {
          emailId: payload.data.email_id,
          to: payload.data.to,
          timestamp: new Date(payload.data.created_at).toISOString()
        });
        break;

      default:
        console.log('Unhandled webhook event:', payload.type);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error processing webhook' }),
      { status: 500 }
    );
  }
} 