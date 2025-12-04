// Script untuk remove hardcoded CORS headers dari API routes
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiDir = path.join(__dirname, 'app', 'api');

function removeCorsFromFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove OPTIONS handler yang hardcode CORS
  const optionsPattern = /export async function OPTIONS\(\) \{[\s\S]*?return new Response\(null, \{[\s\S]*?headers: \{[\s\S]*?"Access-Control-Allow-Origin"[\s\S]*?\},[\s\S]*?\}\);[\s\S]*?\}/g;
  if (optionsPattern.test(content)) {
    content = content.replace(optionsPattern, '');
    modified = true;
  }

  // Remove inline CORS headers dari Response.json
  const corsHeaderPattern = /,?\s*headers:\s*\{[\s\S]*?"Access-Control-Allow-Origin"[\s\S]*?\}/g;
  if (corsHeaderPattern.test(content)) {
    content = content.replace(corsHeaderPattern, '');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  
  return false;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      count += processDirectory(filePath);
    } else if (file.endsWith('.js') && file.includes('route')) {
      if (removeCorsFromFile(filePath)) {
        count++;
      }
    }
  }

  return count;
}

console.log('🔧 Removing hardcoded CORS headers from API routes...\n');
const count = processDirectory(apiDir);
console.log(`\n✨ Done! Fixed ${count} files.`);
