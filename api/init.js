export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      // Debug environment variables
      const envVars = {
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
        hasHost: !!process.env.POSTGRES_HOST,
        hasUser: !!process.env.POSTGRES_USER,
        hasPassword: !!process.env.POSTGRES_PASSWORD,
        hasDatabase: !!process.env.POSTGRES_DATABASE
      };

      // Test připojení s explicitní konfigurací
      const { sql } = await import("@vercel/postgres");
      
      // Jednoduchý test bez složitého SQL
      const testResult = await sql`SELECT 1 as test`;
      
      return res.status(200).json({ 
        success: true,
        message: "Database connection test successful",
        testResult: testResult.rows[0],
        envVars,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Database connection error:", error);
      return res.status(500).json({
        success: false,
        error: "Database connection failed",
        errorMessage: error.message,
        errorCode: error.code,
        errorName: error.name,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}