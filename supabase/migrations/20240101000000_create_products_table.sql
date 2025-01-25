create table if not exists public.products (
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

-- Insert initial product data
insert into public.products (name, description, price, image_url, origin, stock) values
('Brazilian Santos', 'Medium roasted coffee with nutty and chocolate notes', 14.99, '/products/brasil-santos.jpeg', 'Brazil', 100),
('Colombian Supremo', 'Full-bodied coffee with caramel sweetness', 16.99, '/products/colombian-supremo.jpg', 'Colombia', 85),
('Costa Rica Tarrazu', 'Bright and clean with citrus notes', 17.99, '/products/costa-rica-tarrazu.jpg', 'Costa Rica', 75),
('Ethiopian Yirgacheffe', 'Floral and fruity with wine-like acidity', 18.99, '/products/ethiopian.jpg', 'Ethiopia', 60),
('Guatemala Antigua', 'Complex with spicy and smoky notes', 15.99, '/products/guatemala-antigua.jpg', 'Guatemala', 90),
('Kenya AA', 'Bold and bright with berry notes', 19.99, '/products/kenya-aa.jpg', 'Kenya', 50);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- Create policy to allow anonymous read access
create policy "Allow anonymous read access"
  on public.products
  for select
  to anon
  using (true);