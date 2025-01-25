'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/lib/cart-context';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  origin: string;
  stock: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      setProducts(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Coffee Selection</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-muted-foreground mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">€{product.price.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">Origin: {product.origin}</span>
              </div>
              <button
                className="mt-4 w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}