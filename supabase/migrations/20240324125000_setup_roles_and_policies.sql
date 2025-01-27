-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;
DROP POLICY IF EXISTS "Service role can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Allow anonymous read access" ON products;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON products;
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON products;
DROP POLICY IF EXISTS "Allow authenticated update access" ON products;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON products;
DROP POLICY IF EXISTS "Allow public read access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete access to product images" ON storage.objects;

-- Create user role policies
CREATE POLICY "Users can read their own role"
    ON user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage roles"
    ON user_roles FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Create product policies
CREATE POLICY "Allow public read access"
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated insert access"
    ON products FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access"
    ON products FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access"
    ON products FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create storage policies
CREATE POLICY "Allow public read access to product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');

CREATE POLICY "Allow authenticated upload access to product images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'products'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Allow authenticated update access to product images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'products'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Allow authenticated delete access to product images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'products'
        AND auth.role() = 'authenticated'
    ); 