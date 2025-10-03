export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      // Test 1: Zkusíme importovat @vercel/postgres
      const { sql } = await import("@vercel/postgres");
      
      // Test 2: Zkusíme jednoduchý SQL dotaz
      const result = await sql`SELECT NOW() as current_time`;
      
      return res.status(200).json({ 
        success: true,
        message: "Database connection successful",
        currentTime: result.rows[0]?.current_time,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Database test error:", error);
      return res.status(500).json({
        success: false,
        error: "Database test failed",
        details: error.message,
        stack: error.stack
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}