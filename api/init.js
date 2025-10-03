export default async function handler(req, res) {
  if (req.method === "GET" || req.method === "POST") {
    try {
      // Zkusíme createClient() jak navrhuje chyba
      const { createClient } = await import("@vercel/postgres");
      
      const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
      const client = createClient({ connectionString });
      
      // Test připojení
      const result = await client.sql`SELECT 1 as test, NOW() as current_time`;
      
      return res.status(200).json({
        success: true,
        message: "Database connection successful with createClient!",
        result: result.rows[0],
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        success: false,
        error: "Database connection failed",
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
