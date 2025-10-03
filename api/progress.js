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
          best_score: 0,
          exp: 0,
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

      // Uložíme progress pro konkrétního uživatele - použijeme UPDATE nebo INSERT
      let result;
      
      // Nejdříve zkusíme UPDATE
      const updateResult = await client.query(
        `UPDATE user_progress 
         SET level = $2, score = $3, best_score = GREATEST(best_score, $3), exp = $4, abilities = $5, achievements = $6, settings = $7, last_played = NOW(), updated_at = NOW()
         WHERE user_id = $1
         RETURNING *`,
        [
          decoded.userId,
          progressData.level || 1,
          progressData.score || 0,
          progressData.exp || 0,
          JSON.stringify(progressData.abilities || {}),
          JSON.stringify(progressData.achievements || []),
          JSON.stringify(progressData.settings || {})
        ]
      );

      if (updateResult.rows.length === 0) {
        // Pokud UPDATE neaktualizoval nic, vytvoříme nový záznam
        result = await client.query(
          `INSERT INTO user_progress (user_id, level, score, best_score, exp, abilities, achievements, settings) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
           RETURNING *`,
          [
            decoded.userId,
            progressData.level || 1,
            progressData.score || 0,
            progressData.score || 0, // best_score = current score for new users
            progressData.exp || 0,
            JSON.stringify(progressData.abilities || {}),
            JSON.stringify(progressData.achievements || []),
            JSON.stringify(progressData.settings || {})
          ]
        );
      } else {
        result = updateResult;
      }

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
