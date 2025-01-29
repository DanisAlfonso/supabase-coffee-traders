#!/bin/bash

# Create the products directory if it doesn't exist
mkdir -p public/products

# Download specific high-quality coffee images from Unsplash
# Using carefully selected coffee images with fixed IDs

# Honduran Marcala - Coffee plantation image
curl -L "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80" -o public/products/honduras-marcala.jpg

# Copán Mountain Reserve - Coffee mountains image
curl -L "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80" -o public/products/honduras-copan.jpg

# Opalaca Organic - Coffee beans image
curl -L "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80" -o public/products/honduras-opalaca.jpg

# El Paraiso Specialty - Roasted coffee beans
curl -L "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800&q=80" -o public/products/honduras-paraiso.jpg

# Montecillos High Grown - Coffee plantation mountains
curl -L "https://images.unsplash.com/photo-1500423079914-b65af272b8db?w=800&q=80" -o public/products/honduras-montecillos.jpg

# Comayagua Valley Select - Coffee cherries
curl -L "https://images.unsplash.com/photo-1523287957-f5a1d1bdc187?w=800&q=80" -o public/products/honduras-comayagua.jpg

# Make the images readable
chmod 644 public/products/*.jpg 

