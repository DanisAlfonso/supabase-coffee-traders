'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price_eur: number;
  image_url: string;
  origin_country: string;
  origin_flag_url: string;
}

export default function ProductCard({
  id,
  name,
  description,
  price_eur,
  image_url,
  origin_country,
  origin_flag_url,
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id,
      name,
      price: price_eur,
      quantity: 1,
      image_url
    });
  };

  return (
    <div className="group">
      <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-xl border border-border/50">
        <div className="relative h-48 w-full bg-muted">
          {image_url ? (
            <Image
              src={image_url}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground">Image Coming Soon</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="relative w-6 h-4">
              {origin_flag_url ? (
                <Image
                  src={origin_flag_url}
                  alt={`${origin_country} flag`}
                  fill
                  className="object-cover rounded"
                />
              ) : (
                <div className="w-6 h-4 bg-gray-200 rounded" />
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">
              €{price_eur.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">{origin_country}</span>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary text-primary-foreground px-4 py-2 mt-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}