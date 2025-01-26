import { Resend } from 'resend';
import { renderAsync } from '@react-email/components';
import OrderStatusEmail from '@/app/components/emails/OrderStatusEmail';
import { Order } from '@/types/order';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderStatusEmail(order: Order, previousStatus: string) {
  if (!order.customer_email) {
    console.error('No customer email found for order:', order.id);
    return;
  }

  try {
    console.log('Rendering email template...');
    const html = await renderAsync(OrderStatusEmail({ order, previousStatus }));

    console.log('Sending email to:', order.customer_email);
    const { data, error } = await resend.emails.send({
      from: 'Selvas Coffee <onboarding@resend.dev>',
      to: [order.customer_email],
      subject: `Order Status Update - ${order.id}`,
      html: html,
      tags: [
        {
          name: 'order_id',
          value: order.id
        },
        {
          name: 'status',
          value: order.status
        }
      ]
    });

    if (error) {
      console.error('Resend API error:', error);
      throw error;
    }

    console.log('Email sent successfully:', {
      emailId: data?.id,
      orderId: order.id,
      to: order.customer_email,
      status: order.status
    });
    
    return data;
  } catch (error) {
    console.error('Error sending order status email:', {
      error,
      orderId: order.id,
      to: order.customer_email,
      status: order.status
    });
    throw error;
  }
} 