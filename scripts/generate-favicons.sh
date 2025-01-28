#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Define colors
LIGHT_FG="#2563EB"  # Modern blue
DARK_FG="#60A5FA"   # Modern light blue

# Function to create PNG favicon
create_png() {
    local input=$1
    local output=$2
    local size=$3
    local color=$4
    
    # Create a temporary SVG with the right color
    sed "s/currentColor/$color/g" "$input" > temp.svg
    
    # Convert to PNG with rsvg-convert
    rsvg-convert \
        -w "$size" \
        -h "$size" \
        --keep-aspect-ratio \
        -o "$output" \
        temp.svg
    
    rm temp.svg
}

# Function to create ICO file
create_ico() {
    local input=$1
    local output=$2
    local color=$3

    # Create temporary directory
    mkdir -p temp_ico

    # Generate each size
    for size in 256 128 64 48 32 16; do
        create_png "$input" "temp_ico/favicon-${size}.png" $size "$color"
    done

    # Combine into ICO
    magick "temp_ico/favicon-256.png" \
        "temp_ico/favicon-128.png" \
        "temp_ico/favicon-64.png" \
        "temp_ico/favicon-48.png" \
        "temp_ico/favicon-32.png" \
        "temp_ico/favicon-16.png" \
        -background none \
        -define icon:auto-resize=256,128,64,48,32,16 \
        ICO:"$output"

    # Clean up
    rm -rf temp_ico
}

echo "Generating favicons..."

# Light mode icons
create_ico "public/safari-pinned-tab.svg" "public/favicon.ico" "$LIGHT_FG"
create_png "public/safari-pinned-tab.svg" "public/apple-icon.png" 180 "$LIGHT_FG"
create_png "public/safari-pinned-tab.svg" "public/android-chrome-192x192.png" 192 "$LIGHT_FG"
create_png "public/safari-pinned-tab.svg" "public/android-chrome-512x512.png" 512 "$LIGHT_FG"

# Dark mode icons
create_ico "public/safari-pinned-tab.svg" "public/favicon-dark.ico" "$DARK_FG"
create_png "public/safari-pinned-tab.svg" "public/apple-icon-dark.png" 180 "$DARK_FG"

echo "Done! Favicon generation complete." 
