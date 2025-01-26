import { Download } from 'lucide-react';
import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import OrderInvoice from './OrderInvoice';
import { Order } from '@/types/order';

interface DownloadInvoiceButtonProps {
  order: Order;
}

export default function DownloadInvoiceButton({ order }: DownloadInvoiceButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const blob = await pdf(<OrderInvoice order={order} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
    >
      {loading ? 'Generating...' : 'Download Invoice'}
      <Download className="w-4 h-4" />
    </button>
  );
} 