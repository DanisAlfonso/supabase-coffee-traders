'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  origin: string;
}

const countryCodeMap: Record<string, string> = {
  'Colombia': 'co',
  'Ethiopia': 'et',
  'Guatemala': 'gt',
  'Costa Rica': 'cr',
  'Kenya': 'ke',
  'Brazil': 'br'
};

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const [activeProduct, setActiveProduct] = useState<number>(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem: addToCart } = useCart();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1
      });
    }
  };

  const nextProduct = () => {
    setActiveProduct((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setActiveProduct((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
  };

  // Auto-rotate products every 5 seconds if no interaction
  useEffect(() => {
    const timer = setInterval(nextProduct, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-secondary/30 to-transparent overflow-hidden">
      <div className="container">
        <motion.h2 
          className="text-4xl font-bold text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Featured Coffees
        </motion.h2>
        <motion.p 
          className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Experience the richness of Honduran highlands—where exceptional coffee meets ethical sourcing and artisanal craftsmanship
        </motion.p>

        <div 
          ref={containerRef}
          className="relative h-[600px] select-none"
          onMouseMove={handleMouseMove}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevProduct}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg hover:bg-background transition-all hover:scale-110"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={nextProduct}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg hover:bg-background transition-all hover:scale-110"
            aria-label="Next product"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Products Showcase */}
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              {products.map((product, index) => (
                index === activeProduct && (
                  <motion.div
                    key={product.id}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <div className="relative w-full max-w-5xl mx-auto grid grid-cols-2 gap-12 items-center">
                      {/* Product Image */}
                      <motion.div 
                        className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
                        style={{
                          transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        
                        {/* Origin Flag */}
                        <div className="absolute top-6 right-6 w-12 h-8 rounded-lg overflow-hidden shadow-lg">
                          <Image
                            src={`/flags/${countryCodeMap[product.origin]}.svg`}
                            alt={`${product.origin} flag`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </motion.div>

                      {/* Product Info */}
                      <div className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.7, delay: 0.3 }}
                        >
                          <h3 className="text-3xl font-bold mb-2">{product.name}</h3>
                          <p className="text-muted-foreground text-lg mb-4">{product.description}</p>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span>Origin:</span>
                            <span className="font-medium text-foreground">{product.origin}</span>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.5 }}
                          className="flex items-end justify-between pt-6 border-t border-border/50"
                        >
                          <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">Price</span>
                            <div className="text-3xl font-bold">€{product.price.toFixed(2)}</div>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="group btn btn-primary text-lg px-8 py-4 space-x-2"
                          >
                            <span>Add to Cart</span>
                            <Plus className="w-5 h-5 transition-transform group-hover:rotate-180" />
                          </button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Product Navigation Dots */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveProduct(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeProduct === index 
                    ? 'w-8 bg-primary' 
                    : 'bg-primary/30 hover:bg-primary/50'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 