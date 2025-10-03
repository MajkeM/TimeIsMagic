import { sql } from "@vercel/postgres";

// Inicializace databázových tabulek
async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
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
      );
    `;

    return { success: true };
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      await initDatabase();
      return res.status(200).json({ 
        success: true,
        message: "Database initialized successfully",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Database initialization error:", error);
      return res.status(500).json({
        success: false,
        error: "Database initialization failed",
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}