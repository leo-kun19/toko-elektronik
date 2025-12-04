#!/usr/bin/env python3
"""
Script untuk remove semua hardcoded CORS headers dari API routes
Karena next.config.js sudah handle CORS secara global
"""

import os
import re
from pathlib import Path

def remove_cors_from_file(file_path):
    """Remove CORS headers dari file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern 1: Remove OPTIONS handler yang hardcode CORS
    options_pattern = r'export async function OPTIONS\(\) \{\s*return new Response\(null, \{\s*status: 200,\s*headers: \{[^}]*"Access-Control-Allow-Origin"[^}]*\},\s*\}\);\s*\}\s*'
    content = re.sub(options_pattern, '', content, flags=re.MULTILINE | re.DOTALL)
    
    # Pattern 2: Remove inline headers object dengan CORS
    # Contoh: headers: { "Access-Control-Allow-Origin": "...", ... }
    headers_pattern = r',?\s*headers:\s*\{[^}]*"Access-Control-Allow-Origin"[^}]*\}'
    content = re.sub(headers_pattern, '', content, flags=re.MULTILINE | re.DOTALL)
    
    # Cleanup: Remove double commas
    content = re.sub(r',\s*,', ',', content)
    
    # Cleanup: Remove trailing commas before closing braces/brackets
    content = re.sub(r',(\s*[}\]])', r'\1', content)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def process_directory(directory):
    """Process semua route.js files di directory"""
    count = 0
    api_dir = Path(directory) / 'app' / 'api'
    
    if not api_dir.exists():
        print(f"❌ Directory tidak ditemukan: {api_dir}")
        return 0
    
    for file_path in api_dir.rglob('route.js'):
        if remove_cors_from_file(file_path):
            print(f"✅ Fixed: {file_path.relative_to(directory)}")
            count += 1
        else:
            print(f"⏭️  Skipped: {file_path.relative_to(directory)} (no CORS found)")
    
    return count

if __name__ == '__main__':
    backend_dir = Path(__file__).parent
    print("🔧 Removing hardcoded CORS headers from API routes...\n")
    
    count = process_directory(backend_dir)
    
    print(f"\n✨ Done! Fixed {count} files.")
    print("📝 Next.js config will handle CORS globally.")
