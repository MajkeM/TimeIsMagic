export default async function handler(req, res) {
  // Debug verze - nejdříve zjistíme jestli funguje základní API
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      // Zkontrolujeme environment variables
      const hasPostgres = !!process.env.POSTGRES_URL;
      const hasJwtSecret = !!process.env.JWT_SECRET;
      
      return res.status(200).json({ 
        success: true,
        message: "API endpoint is working",
        debug: {
          hasPostgres,
          hasJwtSecret,
          nodeVersion: process.version,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("API error:", error);
      return res.status(500).json({
        success: false,
        error: "API initialization failed",
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}