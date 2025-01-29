-- Add sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq;

-- Add order_number column to orders table
ALTER TABLE orders ADD COLUMN display_order_number TEXT UNIQUE;

-- Create a function to generate friendly order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    year TEXT;
    sequence_number TEXT;
BEGIN
    year := to_char(current_timestamp, 'YY');
    sequence_number := lpad(nextval('order_number_seq')::text, 7, '0');
    RETURN year || sequence_number;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.display_order_number := generate_order_number();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- Update existing orders with a friendly order number
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id FROM orders WHERE display_order_number IS NULL
    LOOP
        UPDATE orders 
        SET display_order_number = generate_order_number()
        WHERE id = r.id;
    END LOOP;
END $$; 