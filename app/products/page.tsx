import { Suspense } from 'react';
import ProductsClient from './products-client';
import { createClient } from '@supabase/supabase-js';
import { Coffee, Leaf, Globe2, Award } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

async function getProducts() {
  // Create an admin client for server-side operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    throw new Error('Missing required environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }

  return products || [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover Our Premium Coffee Collection
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Explore our carefully curated selection of exceptional coffee beans, sourced from the world&apos;s finest growing regions and roasted to perfection.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Coffee className="w-6 h-6" />
                </div>
                <h3 className="font-medium">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">Expertly selected beans</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-medium">Sustainable</h3>
                <p className="text-sm text-muted-foreground">Eco-friendly practices</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="font-medium">Global Origins</h3>
                <p className="text-sm text-muted-foreground">From finest regions</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-medium">Award Winning</h3>
                <p className="text-sm text-muted-foreground">Recognized quality</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Suspense fallback={
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          }>
            <ProductsClient initialProducts={products} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}