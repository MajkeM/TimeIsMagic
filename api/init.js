import { initDatabase } from "../src/lib/database.js";

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