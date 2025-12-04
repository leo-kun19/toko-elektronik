#!/usr/bin/env python3
"""
Fix image paths - replace localhost:3001 with relative URL
"""

import re
from pathlib import Path

def fix_image_paths(file_path):
    """Replace localhost:3001 with empty string for relative URLs"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace http://localhost:3001/api with /api
    new_content = content.replace('http://localhost:3001/api', '/api')
    new_content = new_content.replace('http://localhost:3001', '')
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    backend_dir = Path(__file__).parent
    api_dir = backend_dir / 'app' / 'api'
    
    print("🔧 Fixing image paths...\n")
    
    count = 0
    for route_file in api_dir.rglob('route.js'):
        if fix_image_paths(route_file):
            print(f"✅ Fixed: {route_file.relative_to(backend_dir)}")
            count += 1
    
    print(f"\n✨ Done! Fixed {count} files.")

if __name__ == '__main__':
    main()
