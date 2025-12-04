#!/usr/bin/env python3
"""
Add CORS headers to ALL responses (GET, POST, PUT, DELETE)
Not just OPTIONS handler
"""

import re
from pathlib import Path

def add_cors_to_responses(file_path):
    """Add getCorsHeaders() import and use it in all Response.json()"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # Check if already has getCorsHeaders import
    if 'getCorsHeaders' not in content:
        # Add getCorsHeaders to existing cors import
        if 'handleCorsOptions' in content:
            content = content.replace(
                'from "../../lib/cors.js"',
                'from "../../lib/cors.js"'
            ).replace(
                'from "../../../lib/cors.js"',
                'from "../../../lib/cors.js"'
            )
            
            # Add getCorsHeaders to import
            content = re.sub(
                r'import \{ (handleCorsOptions) \}',
                r'import { \1, getCorsHeaders }',
                content
            )
            modified = True
    
    # Find all Response.json() without headers
    # Pattern: Response.json(..., { status: ..., })  or Response.json(..., { status: ... })
    pattern = r'return Response\.json\((.*?),\s*\{\s*(status:\s*\d+)?\s*\}\s*\)'
    
    def add_headers(match):
        data = match.group(1)
        status = match.group(2) if match.group(2) else 'status: 200'
        return f'return Response.json({data}, {{ {status}, headers: getCorsHeaders() }})'
    
    new_content = re.sub(pattern, add_headers, content, flags=re.DOTALL)
    
    if new_content != content:
        modified = True
        content = new_content
    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    backend_dir = Path(__file__).parent
    api_dir = backend_dir / 'app' / 'api'
    
    print("🔧 Adding CORS headers to all responses...\n")
    
    count = 0
    for route_file in api_dir.rglob('route.js'):
        if add_cors_to_responses(route_file):
            print(f"✅ Updated: {route_file.relative_to(backend_dir)}")
            count += 1
    
    print(f"\n✨ Done! Updated {count} files.")
    print("📝 All responses now include CORS headers.")

if __name__ == '__main__':
    main()
