-- Create the storage bucket for product images
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('products', 'products', true);
    
    -- If the bucket already exists, this will raise an exception
    -- We catch it and do nothing since that's what we want
    EXCEPTION WHEN unique_violation THEN
        -- Do nothing, bucket already exists
END $$; 