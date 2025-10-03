import { Client } from 'pg';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === "GET") {
    let client;
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      // Ověříme token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
      
      client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
      });

      await client.connect();

      // Získáme progress konkrétního uživatele
      const result = await client.query(
        'SELECT * FROM user_progress WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        // Vytvoříme výchozí progress pro nového uživatele
        const defaultProgress = {
          level: 1,
          score: 0,
          abilities: JSON.stringify({}),
          achievements: JSON.stringify([]),
          settings: JSON.stringify({})
        };

        const insertResult = await client.query(
          'INSERT INTO user_progress (user_id, level, score, abilities, achievements, settings) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [decoded.userId, defaultProgress.level, defaultProgress.score, defaultProgress.abilities, defaultProgress.achievements, defaultProgress.settings]
        );

        return res.status(200).json({ progress: insertResult.rows[0] });
      }

      return res.status(200).json({ progress: result.rows[0] });
    } catch (error) {
      console.error("Get progress error:", error);
      return res.status(500).json({ 
        error: "Internal server error",
        details: error.message 
      });
    } finally {
      if (client) {
        try {
          await client.end();
        } catch (closeError) {
          console.error("Error closing database connection:", closeError);
        }
      }
    }
  } else if (req.method === "POST") {
    let client;
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      // Ověříme token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const progressData = req.body;

      const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
      
      client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
      });

      await client.connect();

      // Uložíme progress pro konkrétního uživatele
      const result = await client.query(
        `INSERT INTO user_progress (user_id, level, score, abilities, achievements, settings, last_played, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
         ON CONFLICT (user_id) 
         DO UPDATE SET 
           level = EXCLUDED.level,
           score = EXCLUDED.score,
           abilities = EXCLUDED.abilities,
           achievements = EXCLUDED.achievements,
           settings = EXCLUDED.settings,
           last_played = NOW(),
           updated_at = NOW()
         RETURNING *`,
        [
          decoded.userId,
          progressData.level || 1,
          progressData.score || 0,
          JSON.stringify(progressData.abilities || {}),
          JSON.stringify(progressData.achievements || []),
          JSON.stringify(progressData.settings || {})
        ]
      );

      return res.status(200).json({ 
        message: "Progress saved successfully",
        progress: result.rows[0]
      });
    } catch (error) {
      console.error("Save progress error:", error);
      return res.status(500).json({ 
        error: "Internal server error",
        details: error.message 
      });
    } finally {
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
