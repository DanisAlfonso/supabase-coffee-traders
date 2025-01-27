-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow public read access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete access to product images" ON storage.objects;

-- Create simplified storage policies
CREATE POLICY "Allow public read access to product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');

CREATE POLICY "Allow all access to product images"
    ON storage.objects FOR ALL
    USING (bucket_id = 'products')
    WITH CHECK (bucket_id = 'products'); 