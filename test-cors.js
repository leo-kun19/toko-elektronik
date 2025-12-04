// Test CORS OPTIONS request to Railway backend
const BACKEND_URL = 'https://toko-elektronik-production.up.railway.app';

async function testCORS() {
  console.log('🧪 Testing CORS OPTIONS request...\n');
  console.log(`📍 Backend URL: ${BACKEND_URL}`);
  console.log(`📍 Testing endpoint: ${BACKEND_URL}/api/stok\n`);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/stok`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://ginbers-elektonik-production.up.railway.app',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'content-type',
      },
    });
    
    console.log('✅ Response received!');
    console.log(`📊 Status: ${response.status} ${response.statusText}\n`);
    
    console.log('📋 Response Headers:');
    console.log('─'.repeat(50));
    
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
      console.log(`${key}: ${value}`);
    });
    
    console.log('─'.repeat(50));
    console.log('');
    
    // Check CORS headers
    const corsHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers',
      'access-control-allow-credentials',
    ];
    
    console.log('🔍 CORS Headers Check:');
    console.log('─'.repeat(50));
    
    let allPresent = true;
    corsHeaders.forEach(header => {
      const present = headers[header] !== undefined;
      const icon = present ? '✅' : '❌';
      const value = present ? headers[header] : 'NOT PRESENT';
      console.log(`${icon} ${header}: ${value}`);
      if (!present) allPresent = false;
    });
    
    console.log('─'.repeat(50));
    console.log('');
    
    if (allPresent) {
      console.log('🎉 SUCCESS! All CORS headers are present!');
      console.log('✅ CORS should work now!');
    } else {
      console.log('❌ FAILED! Some CORS headers are missing!');
      console.log('💡 OPTIONS handler might not be working.');
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.error('💡 This might be a network error or CORS blocking the request.');
  }
}

testCORS();
