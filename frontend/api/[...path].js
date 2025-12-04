// Vercel Serverless Function to proxy API requests to Railway backend
export default async function handler(req, res) {
  const BACKEND_URL = 'https://toko-elektronik-production.up.railway.app';
  
  // Get the path from the request
  const path = req.url.replace('/api', '');
  const targetUrl = `${BACKEND_URL}/api${path}`;
  
  console.log('🔄 Proxying request to:', targetUrl);
  console.log('📍 Method:', req.method);
  
  try {
    // Forward the request to Railway backend
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers['authorization'] || '',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    const data = await response.json();
    
    // Forward the response back to the client
    res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: 'Proxy error', message: error.message });
  }
}
