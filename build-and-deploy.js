#!/usr/bin/env node
/**
 * Build frontend and copy to backend/public for single-domain deployment
 */

import { execSync } from 'child_process';
import { cpSync, rmSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = process.cwd();
const FRONTEND_DIR = join(ROOT_DIR, 'frontend');
const BACKEND_DIR = join(ROOT_DIR, 'backend');
const FRONTEND_DIST = join(FRONTEND_DIR, 'dist');
const BACKEND_PUBLIC = join(BACKEND_DIR, 'public');

console.log('🚀 Building frontend and deploying to backend...\n');

// Step 1: Build frontend
console.log('📦 Step 1: Building frontend...');
try {
  execSync('npm run build', { cwd: FRONTEND_DIR, stdio: 'inherit' });
  console.log('✅ Frontend build complete!\n');
} catch (error) {
  console.error('❌ Frontend build failed!');
  process.exit(1);
}

// Step 2: Clean backend/public
console.log('🧹 Step 2: Cleaning backend/public...');
if (existsSync(BACKEND_PUBLIC)) {
  rmSync(BACKEND_PUBLIC, { recursive: true, force: true });
}
mkdirSync(BACKEND_PUBLIC, { recursive: true });
console.log('✅ Cleaned!\n');

// Step 3: Copy frontend dist to backend/public
console.log('📋 Step 3: Copying frontend to backend/public...');
try {
  cpSync(FRONTEND_DIST, BACKEND_PUBLIC, { recursive: true });
  console.log('✅ Copied!\n');
} catch (error) {
  console.error('❌ Copy failed:', error.message);
  process.exit(1);
}

console.log('🎉 Done! Frontend is now in backend/public/');
console.log('📝 Deploy backend to Railway - it will serve both API and frontend.');
