import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      // Test jednoduchého dotazu s Vercel postgres
      const testResult = await sql`SELECT 1 as test, NOW() as current_time`;
      
      // Pokud test funguje, vytvoříme tabulky
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          email VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
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
        )
      `;
      
      return res.status(200).json({ 
        success: true,
        message: "Database initialized successfully",
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
        timestamp: new Date().toISOString()
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}