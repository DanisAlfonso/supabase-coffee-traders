import FeaturedProducts from './components/FeaturedProducts';

// Dummy product data
const dummyProducts = [
  {
    id: '1',
    name: 'Colombian Supremo',
    description: 'A rich and full-bodied coffee with caramel sweetness and a smooth finish.',
    price: 14.99,
    image_url: '/products/colombian-supremo.jpg',
    origin: 'Colombia'
  },
  {
    id: '2',
    name: 'Ethiopian Yirgacheffe',
    description: 'Delicate floral and citrus notes with a wine-like acidity.',
    price: 16.99,
    image_url: '/products/ethiopian.jpg',
    origin: 'Ethiopia'
  },
  {
    id: '3',
    name: 'Guatemala Antigua',
    description: 'Complex spiciness with a subtle chocolate undertone.',
    price: 15.99,
    image_url: '/products/guatemala-antigua.jpg',
    origin: 'Guatemala'
  },
  {
    id: '4',
    name: 'Costa Rica Tarrazu',
    description: 'Bright acidity with hints of citrus and dark chocolate.',
    price: 15.49,
    image_url: '/products/costa-rica-tarrazu.jpg',
    origin: 'Costa Rica'
  },
  {
    id: '5',
    name: 'Kenya AA',
    description: 'Bold, full-bodied with wine-like acidity and berry notes.',
    price: 17.99,
    image_url: '/products/kenya-aa.jpg',
    origin: 'Kenya'
  },
  {
    id: '6',
    name: 'Brazil Santos',
    description: 'Smooth, mild and sweet with notes of nuts and chocolate.',
    price: 13.99,
    image_url: '/products/brasil-santos.jpeg',
    origin: 'Brazil'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gray-900">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Premium European Coffee Trading
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl">
            Discover exceptional coffee beans sourced from the world&apos;s finest growing regions.
          </p>
        </div>
      </section>

      {/* European Sourcing Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Our European Coffee Sourcing
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              We partner directly with premium coffee estates across the globe,
              bringing the finest beans to European coffee enthusiasts. Our rigorous
              selection process and direct trade relationships ensure exceptional
              quality in every batch.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Each coffee origin is carefully chosen for its unique characteristics,
              sustainable farming practices, and contribution to local communities.
              Experience the art of coffee cultivation through our curated selection.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts products={dummyProducts} />
    </main>
  );
}
