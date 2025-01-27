-- First, create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow public read access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin upload access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin update access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete access to product images" ON storage.objects;

-- Create storage policies
CREATE POLICY "Allow public read access to product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');

CREATE POLICY "Allow admin upload access to product images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'products'
        AND EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email IN ('danny.ramrez7@gmail.com')
        )
    );

CREATE POLICY "Allow admin update access to product images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'products'
        AND EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email IN ('danny.ramrez7@gmail.com')
        )
    );

CREATE POLICY "Allow admin delete access to product images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'products'
        AND EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email IN ('danny.ramrez7@gmail.com')
        )
    ); 