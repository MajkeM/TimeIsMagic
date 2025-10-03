import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method === "GET" || req.method === "POST") {
    let client;
    try {
      const connectionString =
        process.env.DATABASE_URL || process.env.POSTGRES_URL;

      if (!connectionString) {
        throw new Error("No database connection string found");
      }

      // Vytvoříme PostgreSQL klienta
      client = new Client({
        connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      // Připojíme se k databázi
      await client.connect();

      // Test jednoduchého dotazu
      const testResult = await client.query(
        "SELECT 1 as test, NOW() as current_time"
      );

      // Pokud test funguje, vytvoříme tabulky
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          email VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS user_progress (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          level INTEGER DEFAULT 1,
          score INTEGER DEFAULT 0,
          abilities TEXT,
          achievements TEXT,
          settings TEXT,
          last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      return res.status(200).json({
        success: true,
        message: "Database initialized successfully! Tables created.",
        result: testResult.rows[0],
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
    } finally {
      // Zavřeme připojení
      if (client) {
        try {
          await client.end();
        } catch (closeError) {
          console.error("Error closing database connection:", closeError);
        }
      }
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
