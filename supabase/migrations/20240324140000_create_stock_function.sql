-- Create a function to update product stock levels
CREATE OR REPLACE FUNCTION update_product_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the stock level, ensuring it doesn't go below 0
  UPDATE products
  SET stock = GREATEST(stock - p_quantity, 0),
      updated_at = NOW()
  WHERE id = p_product_id;
END;
$$; 