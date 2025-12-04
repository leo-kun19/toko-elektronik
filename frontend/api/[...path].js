// Vercel Serverless Function to proxy API requests to Railway backend
export default async function handler(req, res) {
  const BACKEND_URL = 'https://toko-elektronik-production.up.railway.app';
  
  // Get the full path including query params
  const path = req.url.replace('/api', '');
  const targetUrl = `${BACKEND_URL}/api${path}`;
  
  console.log('🔄 Proxying:', req.method, targetUrl);
  
  try {
    // Prepare fetch options
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // Add body for POST/PUT/PATCH requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }
    
    // Forward the request to Railway backend
    const response = await fetch(targetUrl, fetchOptions);
    
    // Get response text first
    const text = await response.text();
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // If not JSON, return as text
      return res.status(response.status).send(text);
    }
    
    // Forward the response back to the client
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      url: targetUrl 
    });
  }
}
