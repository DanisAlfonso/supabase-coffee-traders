-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  store JSONB NOT NULL DEFAULT '{
    "name": "Coffee Traders",
    "description": "Premium European Coffee Trading Platform",
    "currency": "EUR",
    "timezone": "Europe/Berlin"
  }',
  shipping JSONB NOT NULL DEFAULT '{
    "freeShippingThreshold": 50,
    "defaultShippingFee": 5,
    "allowedCountries": ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PL"]
  }',
  email JSONB NOT NULL DEFAULT '{
    "orderConfirmation": true,
    "shippingUpdates": true,
    "promotionalEmails": false
  }',
  payment JSONB NOT NULL DEFAULT '{
    "currency": "EUR",
    "allowedMethods": ["card", "sepa_debit"]
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_settings_updated_at();

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Allow admin update access to settings"
  ON settings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ));

-- Insert default settings
INSERT INTO settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING; 