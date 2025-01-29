-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create their own order items" ON order_items;
DROP POLICY IF EXISTS "Service role can update orders" ON orders;
DROP POLICY IF EXISTS "Service role can update order items" ON order_items;
DROP POLICY IF EXISTS "Service role can insert orders" ON orders;

-- Create new policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.metadata->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can insert orders"
  ON orders FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update orders"
  ON orders FOR UPDATE
  USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.metadata->>'role' = 'admin'
    )
  )
  WITH CHECK (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.metadata->>'role' = 'admin'
    )
  );

-- Create new policies for order items
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (
        orders.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.metadata->>'role' = 'admin'
        )
      )
    )
  );

CREATE POLICY "Users can create their own order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can update order items"
  ON order_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.metadata->>'role' = 'admin'
    )
  ); 