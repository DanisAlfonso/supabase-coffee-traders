export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: {
    name: string;
    image_url?: string;
  };
}

export interface Order {
  id: string;
  order_number: string;
  created_at: string;
  user_id: string;
  total_amount: number;
  shipping_fee: number;
  status: OrderStatus;
  stripe_session_id: string;
  stripe_payment_intent_id: string;
  shipping_address_line1: string;
  shipping_address_line2?: string | null;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string | null;
  items?: OrderItem[];
} 