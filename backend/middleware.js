import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get allowed origin from environment variable
  const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  console.log('🔧 Middleware running for:', request.url);
  console.log('🌍 Allowed origin:', allowedOrigin);
  console.log('📍 Request origin:', request.headers.get('origin'));
  console.log('🔨 Request method:', request.method);
  
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS preflight request');
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Clone the response
  const response = NextResponse.next();

  // Add CORS headers to all responses
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');

  console.log('✅ Added CORS headers to response');
  
  return response;
}

// Apply middleware to API routes only
export const config = {
  matcher: '/api/:path*',
};
