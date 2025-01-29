import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Order } from '@/types/order';
import { format } from 'date-fns';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface OrderStatusEmailProps {
  order: Order;
  previousStatus: string;
}

export default function OrderStatusEmail({ order, previousStatus }: OrderStatusEmailProps) {
  const statusMessages = {
    processing: 'Your order is being processed',
    shipped: 'Your order has been shipped',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled',
  };

  const statusDescriptions = {
    processing: 'We\'re preparing your coffee with care.',
    shipped: 'Your coffee is on its way to you!',
    delivered: 'Your coffee has arrived. Enjoy!',
    cancelled: 'Your order has been cancelled as requested.',
  };

  const getTransitionMessage = (from: string, to: string) => {
    if (to === 'cancelled') {
      return `Your order has been cancelled from status "${from}".`;
    }
    return `Your order status has been updated from "${from}" to "${to}".`;
  };

  return (
    <Html>
      <Head />
      <Preview>
        {statusMessages[order.status as keyof typeof statusMessages]}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            Order Status Update
          </Heading>
          
          <Section style={section}>
            <Text style={text}>
              Dear {order.customer_name},
            </Text>
            
            <Text style={text}>
              {getTransitionMessage(previousStatus, order.status)}
            </Text>

            <Text style={text}>
              {statusDescriptions[order.status as keyof typeof statusDescriptions]}
            </Text>
          </Section>

          <Section style={section}>
            <Heading style={h2}>Order Details</Heading>
            <Text style={orderNumber}>
              Order #{order.display_order_number}
            </Text>
            <Text style={text}>
              Placed on {format(new Date(order.created_at), 'MMMM d, yyyy')}
            </Text>
          </Section>

          <Section style={section}>
            <Heading style={h2}>Items</Heading>
            {order.items?.map((item) => (
              <Text key={item.id} style={text}>
                {item.quantity}x {item.product?.name} - €{item.total_price.toFixed(2)}
              </Text>
            ))}
          </Section>

          <Section style={section}>
            <Text style={text}>
              <strong>Subtotal:</strong> €{(order.total_amount - order.shipping_fee).toFixed(2)}
            </Text>
            <Text style={text}>
              <strong>Shipping:</strong> €{order.shipping_fee.toFixed(2)}
            </Text>
            <Text style={total}>
              <strong>Total:</strong> €{order.total_amount.toFixed(2)}
            </Text>
          </Section>

          <Section style={section}>
            <Heading style={h2}>Shipping Address</Heading>
            <Text style={text}>
              {order.shipping_address_line1}
              {order.shipping_address_line2 && <><br />{order.shipping_address_line2}</>}
              <br />
              {order.shipping_city}, {order.shipping_postal_code}
              <br />
              {order.shipping_country}
            </Text>
          </Section>

          <Section style={section}>
            <Link
              style={button}
              href={`${baseUrl}/orders/${order.id}`}
            >
              View Order Details
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Thank you for shopping with Selvas Coffee Traders!
            If you have any questions, please contact us at{' '}
            <Link href="mailto:support@selvascoffee.com">
              support@selvascoffee.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0 0 20px',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0 0 10px',
};

const section = {
  margin: '0 0 30px',
};

const text = {
  color: '#4c4c4c',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 10px',
};

const orderNumber = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 10px',
  fontFamily: 'monospace',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '4px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '1',
  padding: '12px 20px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  width: '100%',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
};

const total = {
  fontSize: '16px',
  margin: '10px 0',
  color: '#1a1a1a',
}; 