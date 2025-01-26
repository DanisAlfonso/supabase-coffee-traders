export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  origin: string;
  stock: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_fee: number;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  
  created_at: string;
  updated_at: string;
  
  // Virtual fields (not in database)
  items?: OrderItem[];
} 