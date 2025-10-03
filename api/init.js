export default async function handler(req, res) {
  if (req.method === "GET" || req.method === "POST") {
    try {
      // Zkusíme přímé připojení k databázi
      const { sql } = await import("@vercel/postgres");
      
      // Test s timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout after 10s')), 10000)
      );
      
      const queryPromise = sql`SELECT 1 as test, NOW() as current_time`;
      
      const result = await Promise.race([queryPromise, timeoutPromise]);

      return res.status(200).json({
        success: true,
        message: "Database connection successful!",
        result: result.rows[0],
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Database error:", error);
      
      // Detailní analýza chyby
      let errorAnalysis = "Unknown error";
      if (error.message.includes('fetch failed')) {
        errorAnalysis = "Network/DNS issue - database server unreachable";
      } else if (error.message.includes('timeout')) {
        errorAnalysis = "Database timeout - server too slow";
      } else if (error.message.includes('authentication')) {
        errorAnalysis = "Authentication failed - wrong credentials";
      } else if (error.message.includes('SSL')) {
        errorAnalysis = "SSL/TLS connection issue";
      }
      
      return res.status(500).json({
        success: false,
        error: "Database connection failed",
        errorMessage: error.message,
        errorAnalysis,
        errorName: error.name,
        timestamp: new Date().toISOString(),
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
