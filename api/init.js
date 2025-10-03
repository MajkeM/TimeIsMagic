export default async function handler(req, res) {
  if (req.method === "GET" || req.method === "POST") {
    try {
      // Debug informace o environment
      const envInfo = {
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
        postgresUrlPreview: process.env.POSTGRES_URL ? 
          `${process.env.POSTGRES_URL.substring(0, 20)}...` : 'missing',
        nodeEnv: process.env.NODE_ENV,
        vercelRegion: process.env.VERCEL_REGION || 'unknown'
      };

      // Zkusíme fetch test na externí službu
      const fetchTest = await fetch('https://httpbin.org/json');
      const fetchResult = await fetchTest.json();

      return res.status(200).json({
        success: true,
        message: "Debug information collected",
        envInfo,
        fetchTest: fetchResult ? 'working' : 'failed',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Debug error:", error);
      return res.status(500).json({
        success: false,
        error: "Debug failed",
        errorMessage: error.message,
        errorName: error.name,
        timestamp: new Date().toISOString(),
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
