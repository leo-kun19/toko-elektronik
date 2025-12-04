// CORS Helper untuk production & development
const ALLOWED_ORIGIN = process.env.FRONTEND_URL || "*";

console.log('🌍 CORS Helper - FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('🌍 CORS Helper - ALLOWED_ORIGIN:', ALLOWED_ORIGIN);

export function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
  };
}

export function corsResponse(data, status = 200) {
  return Response.json(data, {
    status,
    headers: getCorsHeaders(),
  });
}

export function handleCorsOptions() {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}
