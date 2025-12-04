#!/usr/bin/env python3
"""
Fix all CORS import paths in API routes
"""

import os
import re
from pathlib import Path

def fix_cors_import(file_path, backend_dir):
    """Fix CORS import path in a route file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if no cors import
    if 'from "' not in content or 'lib/cors' not in content:
        return False
    
    # Calculate correct relative path
    # Get path relative to backend/app/api/
    rel_path = file_path.relative_to(backend_dir / 'app' / 'api')
    
    # Count directory depth (how many folders deep)
    depth = len(rel_path.parts) - 1  # -1 because route.js itself doesn't count
    
    # Generate correct path: ../ for each level + lib/cors.js
    correct_path = '../' * (depth + 1) + 'lib/cors.js'
    
    # Replace any existing cors import
    old_pattern = r'from ["\']\.\.+/lib/cors\.js["\']'
    new_import = f'from "{correct_path}"'
    
    if re.search(old_pattern, content):
        content = re.sub(old_pattern, new_import, content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Fixed: {rel_path} -> {correct_path}")
        return True
    
    return False

def main():
    backend_dir = Path(__file__).parent
    api_dir = backend_dir / 'app' / 'api'
    
    if not api_dir.exists():
        print(f"❌ Directory not found: {api_dir}")
        return
    
    print("🔧 Fixing CORS import paths...\n")
    
    count = 0
    for route_file in api_dir.rglob('route.js'):
        if fix_cors_import(route_file, backend_dir):
            count += 1
    
    print(f"\n✨ Done! Fixed {count} files.")

if __name__ == '__main__':
    main()
