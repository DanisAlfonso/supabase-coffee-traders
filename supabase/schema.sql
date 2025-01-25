-- Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  price decimal(10,2) not null,
  image_url text not null,
  origin text not null,
  stock integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- Create policy to allow anonymous read access
create policy "Allow anonymous read access"
  on public.products
  for select
  to anon
  using (true);

-- Create policy to allow authenticated users to insert/update/delete
create policy "Allow authenticated users full access"
  on public.products
  for all
  to authenticated
  using (true)
  with check (true);

-- Sample data
insert into public.products (name, description, price, image_url, origin, stock) values
('Brazilian Santos', 'Medium roast with notes of chocolate and nuts', 14.99, '/products/brasil-santos.jpeg', 'Brazil', 100),
('Colombian Supremo', 'Full-bodied with caramel sweetness', 16.99, '/products/colombian-supremo.jpg', 'Colombia', 85),
('Ethiopian Yirgacheffe', 'Light roast with floral and citrus notes', 18.99, '/products/ethiopian.jpg', 'Ethiopia', 75),
('Costa Rican Tarrazu', 'Bright acidity with hints of citrus', 17.99, '/products/costa-rica-tarrazu.jpg', 'Costa Rica', 90),
('Kenyan AA', 'Bold and complex with wine-like acidity', 19.99, '/products/kenya-aa.jpg', 'Kenya', 60),
('Guatemala Antigua', 'Medium roast with spicy and smoky notes', 15.99, '/products/guatemala-antigua.jpg', 'Guatemala', 80);