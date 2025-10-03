export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      // Debug - zkusíme jen import
      const { sql } = await import('@vercel/postgres');
      
      // Debug - zkusíme nejjednodušší dotaz
      const testResult = await sql`SELECT 1 as test`;
      
      return res.status(200).json({ 
        success: true,
        message: "Simple test successful",
        testResult: testResult.rows[0],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        success: false,
        error: "Database operation failed",
        errorMessage: error.message,
        errorCode: error.code,
        errorName: error.name,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}