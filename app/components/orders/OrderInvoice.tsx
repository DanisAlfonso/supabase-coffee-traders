import { format } from 'date-fns';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Order } from '@/types/order';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logo: {
    width: 120,
  },
  companyInfo: {
    textAlign: 'right',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  col4: {
    width: '40%',
  },
  col2: {
    width: '20%',
  },
  col3: {
    width: '30%',
  },
  rightAlign: {
    textAlign: 'right',
  },
  bold: {
    fontWeight: 'bold',
  },
  summary: {
    marginTop: 30,
    alignItems: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  summaryLabel: {
    width: 100,
  },
  summaryValue: {
    width: 100,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
  },
});

interface OrderInvoiceProps {
  order: Order;
}

export default function OrderInvoice({ order }: OrderInvoiceProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Selvas Coffee</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text>Selvas Coffee Traders GmbH</Text>
            <Text>123 Coffee Street</Text>
            <Text>10115 Berlin, Germany</Text>
            <Text>contact@selvascoffee.com</Text>
          </View>
        </View>

        {/* Invoice Title */}
        <View style={styles.section}>
          <Text style={styles.title}>Invoice</Text>
          <Text>Order #{order.id}</Text>
          <Text>Date: {format(new Date(order.created_at), 'MMMM d, yyyy')}</Text>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text>{order.customer_name}</Text>
          <Text>{order.shipping_address_line1}</Text>
          {order.shipping_address_line2 && (
            <Text>{order.shipping_address_line2}</Text>
          )}
          <Text>{order.shipping_city}, {order.shipping_postal_code}</Text>
          <Text>{order.shipping_country}</Text>
          <Text>{order.customer_email}</Text>
          {order.customer_phone && <Text>{order.customer_phone}</Text>}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          
          {/* Table Header */}
          <View style={[styles.row, styles.bold]}>
            <Text style={styles.col4}>Product</Text>
            <Text style={styles.col2}>Quantity</Text>
            <Text style={[styles.col2, styles.rightAlign]}>Price</Text>
            <Text style={[styles.col2, styles.rightAlign]}>Total</Text>
          </View>

          {/* Table Body */}
          {order.items?.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.col4}>
                {item.product?.name || 'Product Unavailable'}
              </Text>
              <Text style={styles.col2}>{item.quantity}</Text>
              <Text style={[styles.col2, styles.rightAlign]}>
                €{item.unit_price.toFixed(2)}
              </Text>
              <Text style={[styles.col2, styles.rightAlign]}>
                €{item.total_price.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>
              €{(order.total_amount - order.shipping_fee).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping:</Text>
            <Text style={styles.summaryValue}>
              €{order.shipping_fee.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.bold]}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.summaryValue}>
              €{order.total_amount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for shopping with Selvas Coffee Traders!
        </Text>
      </Page>
    </Document>
  );
} 