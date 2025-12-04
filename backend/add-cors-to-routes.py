#!/usr/bin/env python3
"""
Script untuk menambahkan CORS headers ke semua API routes
menggunakan helper function dari lib/cors.js
"""

import os
import re
from pathlib import Path

def add_cors_to_route(file_path):
    """Add CORS helper import and OPTIONS handler to route file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already has cors import
    if 'from "../../lib/cors' in content or 'from "../../../lib/cors' in content:
        return False
    
    # Determine relative path to cors.js based on file depth
    depth = str(file_path).count('\\') - str(file_path).find('app\\api')
    if depth <= 2:
        cors_path = '../lib/cors.js'
    elif depth == 3:
        cors_path = '../../lib/cors.js'
    else:
        cors_path = '../../../lib/cors.js'
    
    # Add import at the top (after other imports)
    import_line = f'import {{ handleCorsOptions }} from "{cors_path}";\n'
    
    # Find the last import statement
    import_pattern = r'(import .+ from .+;)\n'
    imports = list(re.finditer(import_pattern, content))
    
    if imports:
        last_import = imports[-1]
        insert_pos = last_import.end()
        content = content[:insert_pos] + '\n' + import_line + content[insert_pos:]
    else:
        # No imports found, add at the beginning
        content = import_line + '\n' + content
    
    # Add OPTIONS handler if not exists
    if 'export async function OPTIONS' not in content:
        options_handler = '''
export async function OPTIONS() {
  return handleCorsOptions();
}
'''
        # Insert after imports, before first export function
        first_export = re.search(r'\nexport async function', content)
        if first_export:
            insert_pos = first_export.start() + 1
            content = content[:insert_pos] + options_handler + '\n' + content[insert_pos:]
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def process_directory(directory):
    """Process all route.js files in directory"""
    count = 0
    api_dir = Path(directory) / 'app' / 'api'
    
    if not api_dir.exists():
        print(f"❌ Directory tidak ditemukan: {api_dir}")
        return 0
    
    for file_path in api_dir.rglob('route.js'):
        if add_cors_to_route(file_path):
            print(f"✅ Added CORS: {file_path.relative_to(directory)}")
            count += 1
        else:
            print(f"⏭️  Skipped: {file_path.relative_to(directory)} (already has CORS)")
    
    return count

if __name__ == '__main__':
    backend_dir = Path(__file__).parent
    print("🔧 Adding CORS headers to API routes...\n")
    
    count = process_directory(backend_dir)
    
    print(f"\n✨ Done! Added CORS to {count} files.")
    print("📝 All routes now use environment variable FRONTEND_URL for CORS.")
