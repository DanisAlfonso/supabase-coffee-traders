-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow public read access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete access to product images" ON storage.objects;

-- Create storage policies with correct role check
CREATE POLICY "Allow public read access to product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');

CREATE POLICY "Allow authenticated upload access to product images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'products'
        AND auth.role() = 'authenticated'::text
    );

CREATE POLICY "Allow authenticated update access to product images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'products'
        AND auth.role() = 'authenticated'::text
    );

CREATE POLICY "Allow authenticated delete access to product images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'products'
        AND auth.role() = 'authenticated'::text
    ); 