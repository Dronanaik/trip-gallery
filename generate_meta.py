#!/usr/bin/env python3
"""
Helper script to generate meta.json with images array for trip folders.
This script scans a trip folder and creates/updates the meta.json file
with all image files found in the folder.

Usage:
    python3 generate_meta.py trips/your-trip-folder
"""

import os
import sys
import json
from pathlib import Path

# Supported image extensions
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG', '.GIF', '.WEBP'}

def get_images_in_folder(folder_path):
    """Get all image files in the specified folder."""
    images = []
    folder = Path(folder_path)
    
    if not folder.exists():
        print(f"Error: Folder '{folder_path}' does not exist")
        return None
    
    for file in sorted(folder.iterdir()):
        if file.is_file() and file.suffix in IMAGE_EXTENSIONS:
            images.append(file.name)
    
    return images

def create_or_update_meta(folder_path, images):
    """Create or update meta.json with the images array."""
    meta_path = Path(folder_path) / 'meta.json'
    
    # Load existing meta.json if it exists
    if meta_path.exists():
        with open(meta_path, 'r') as f:
            meta = json.load(f)
        print(f"✓ Found existing meta.json")
    else:
        # Create new meta.json with template
        folder_name = Path(folder_path).name
        meta = {
            "trip_name": folder_name.replace('-', ' ').replace('_', ' ').title(),
            "date": "Month Year",
            "members": ["Name1", "Name2"],
            "cover": images[0] if images else "cover.jpg"
        }
        print(f"✓ Created new meta.json template")
    
    # Update images array
    meta['images'] = images
    
    # Write back to file
    with open(meta_path, 'w') as f:
        json.dump(meta, f, indent=2)
    
    print(f"✓ Updated meta.json with {len(images)} images")
    return meta

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 generate_meta.py trips/your-trip-folder")
        print("\nOr scan all trip folders:")
        print("       python3 generate_meta.py --all")
        sys.exit(1)
    
    if sys.argv[1] == '--all':
        # Process all folders in trips directory
        trips_dir = Path('trips')
        if not trips_dir.exists():
            print("Error: 'trips' directory not found")
            sys.exit(1)
        
        for folder in trips_dir.iterdir():
            if folder.is_dir():
                print(f"\n📁 Processing: {folder.name}")
                images = get_images_in_folder(folder)
                if images:
                    create_or_update_meta(folder, images)
                else:
                    print(f"  ⚠ No images found in {folder.name}")
    else:
        # Process single folder
        folder_path = sys.argv[1]
        print(f"📁 Processing: {folder_path}")
        
        images = get_images_in_folder(folder_path)
        if images is None:
            sys.exit(1)
        
        if not images:
            print(f"⚠ No images found in {folder_path}")
            sys.exit(1)
        
        meta = create_or_update_meta(folder_path, images)
        
        print(f"\n✅ Done! Found {len(images)} images:")
        for img in images:
            print(f"   - {img}")
        
        print(f"\n💡 Don't forget to update the trip details in meta.json:")
        print(f"   - trip_name: {meta['trip_name']}")
        print(f"   - date: {meta['date']}")
        print(f"   - members: {meta['members']}")

if __name__ == '__main__':
    main()
