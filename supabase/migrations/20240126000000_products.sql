-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  origin TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS) if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies WHERE tablename = 'products'
  ) THEN
    -- Enable Row Level Security (RLS)
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;

    -- Create policy to allow anonymous read access
    CREATE POLICY "Allow anonymous read access"
      ON products
      FOR SELECT
      TO anon
      USING (true);

    -- Create policy to allow authenticated users to insert/update/delete
    CREATE POLICY "Allow authenticated users full access"
      ON products
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Insert initial product data if table is empty
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products LIMIT 1) THEN
    INSERT INTO products (name, description, price, image_url, origin, stock) VALUES
    ('Brazilian Santos', 'Medium roast with notes of chocolate and nuts', 14.99, '/products/brasil-santos.jpeg', 'Brazil', 100),
    ('Colombian Supremo', 'Full-bodied with caramel sweetness', 16.99, '/products/colombian-supremo.jpg', 'Colombia', 85),
    ('Ethiopian Yirgacheffe', 'Light roast with floral and citrus notes', 18.99, '/products/ethiopian.jpg', 'Ethiopia', 75),
    ('Costa Rican Tarrazu', 'Bright acidity with hints of citrus', 17.99, '/products/costa-rica-tarrazu.jpg', 'Costa Rica', 90),
    ('Kenyan AA', 'Bold and complex with wine-like acidity', 19.99, '/products/kenya-aa.jpg', 'Kenya', 60),
    ('Guatemala Antigua', 'Medium roast with spicy and smoky notes', 15.99, '/products/guatemala-antigua.jpg', 'Guatemala', 80);
  END IF;
END $$; 