// Test Railway PostgreSQL Connection
import { PrismaClient } from '@prisma/client';

// Set DATABASE_URL directly
process.env.DATABASE_URL = "postgresql://postgres:GdMkWeDirPHJVQxPwtHaymsqnTSQevsq@tramway.proxy.rlwy.net:46232/railway";

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testing Railway PostgreSQL connection...');
  console.log('📍 DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ PostgreSQL version:', result);
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('✅ Tables found:', tables.length);
    console.log('📋 Tables:', tables.map(t => t.table_name).join(', '));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('💡 Error details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
