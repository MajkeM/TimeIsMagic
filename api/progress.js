import { Client } from "pg";
import jwt from "jsonwebtoken";

// Configure for Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb", // Increase body size limit
    },
  },
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    let client;
    try {
      console.log("📖 GET /api/progress called");
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        console.log("📖 No token provided");
        return res.status(401).json({ error: "No token provided" });
      }

      if (!process.env.JWT_SECRET) {
        console.error("📖 JWT_SECRET not set in environment variables");
        return res.status(500).json({ error: "Server configuration error" });
      }

      // Ověříme token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("📖 Authenticated user:", decoded.userId);

      const connectionString =
        process.env.DATABASE_URL || process.env.POSTGRES_URL;

      client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
      });

      await client.connect();

      // Check if gold column exists
      const columnCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'user_progress' AND column_name = 'gold'
      `);
      const hasGoldColumn = columnCheck.rows.length > 0;

      // Získáme progress konkrétního uživatele
      const result = await client.query(
        "SELECT * FROM user_progress WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1",
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        // Vytvoříme výchozí progress pro nového uživatele
        const defaultProgress = {
          level: 1,
          gold: 0,
          score: 0,
          best_score: 0,
          exp: 0,
          abilities: JSON.stringify({}),
          achievements: JSON.stringify([]),
          settings: JSON.stringify({}),
        };

        let insertQuery, insertParams;
        if (hasGoldColumn) {
          insertQuery =
            "INSERT INTO user_progress (user_id, level, gold, score, best_score, exp, abilities, achievements, settings) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
          insertParams = [
            decoded.userId,
            defaultProgress.level,
            defaultProgress.gold,
            defaultProgress.score,
            defaultProgress.best_score,
            defaultProgress.exp,
            defaultProgress.abilities,
            defaultProgress.achievements,
            defaultProgress.settings,
          ];
        } else {
          insertQuery =
            "INSERT INTO user_progress (user_id, level, score, best_score, exp, abilities, achievements, settings) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
          insertParams = [
            decoded.userId,
            defaultProgress.level,
            defaultProgress.score,
            defaultProgress.best_score,
            defaultProgress.exp,
            defaultProgress.abilities,
            defaultProgress.achievements,
            defaultProgress.settings,
          ];
        }

        const insertResult = await client.query(insertQuery, insertParams);

        return res.status(200).json({ progress: insertResult.rows[0] });
      }

      return res.status(200).json({ progress: result.rows[0] });
    } catch (error) {
      console.error("Get progress error:", error);
      return res.status(500).json({
        error: "Internal server error",
        details: error.message,
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
      console.log("📝 POST /api/progress - Received data:", req.body);

      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        console.log("📝 No token provided");
        return res.status(401).json({ error: "No token provided" });
      }

      if (!process.env.JWT_SECRET) {
        console.error("📝 JWT_SECRET not set in environment variables");
        return res.status(500).json({ error: "Server configuration error" });
      }

      // Ověříme token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("📝 Authenticated user:", decoded.userId);

      const progressData = req.body;
      console.log("📝 Progress data to save:", progressData);

      const connectionString =
        process.env.DATABASE_URL || process.env.POSTGRES_URL;

      client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
      });

      await client.connect();

      // Check if gold column exists
      const columnCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'user_progress' AND column_name = 'gold'
      `);
      const hasGoldColumn = columnCheck.rows.length > 0;

      // Uložíme progress pro konkrétního uživatele - použijeme UPDATE nebo INSERT
      let result;

      // Nejdříve zkusíme UPDATE
      console.log("📝 Attempting UPDATE...");
      console.log("📝 progressData:", progressData);
      console.log("📝 hasGoldColumn:", hasGoldColumn);

      let updateQuery, updateParams;
      if (hasGoldColumn) {
        updateQuery = `UPDATE user_progress 
         SET level = $2, gold = $3, score = $4, best_score = COALESCE($5, best_score), exp = $6, abilities = $7, achievements = $8, settings = $9, last_played = NOW(), updated_at = NOW()
         WHERE user_id = $1
         RETURNING *`;
        updateParams = [
          decoded.userId,
          progressData.level || 1,
          progressData.gold || 0,
          progressData.score || 0,
          progressData.best_score,
          progressData.exp || 0,
          JSON.stringify(progressData.abilities || {}),
          JSON.stringify(progressData.achievements || []),
          JSON.stringify(progressData.settings || {}),
        ];
      } else {
        // Use score as gold if gold column doesn't exist
        updateQuery = `UPDATE user_progress 
         SET level = $2, score = $3, best_score = COALESCE($4, best_score), exp = $5, abilities = $6, achievements = $7, settings = $8, last_played = NOW(), updated_at = NOW()
         WHERE user_id = $1
         RETURNING *`;
        updateParams = [
          decoded.userId,
          progressData.level || 1,
          progressData.gold || progressData.score || 0,
          progressData.best_score,
          progressData.exp || 0,
          JSON.stringify(progressData.abilities || {}),
          JSON.stringify(progressData.achievements || []),
          JSON.stringify(progressData.settings || {}),
        ];
      }

      const updateResult = await client.query(updateQuery, updateParams);
      console.log("📝 UPDATE result rows:", updateResult.rows.length);

      if (updateResult.rows.length === 0) {
        // Pokud UPDATE neaktualizoval nic, vytvoříme nový záznam
        console.log("📝 No rows updated, attempting INSERT...");

        let insertQuery, insertParams;
        if (hasGoldColumn) {
          insertQuery = `INSERT INTO user_progress (user_id, level, gold, score, best_score, exp, abilities, achievements, settings) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
           RETURNING *`;
          insertParams = [
            decoded.userId,
            progressData.level || 1,
            progressData.gold || 0,
            progressData.score || 0,
            progressData.best_score || 0,
            progressData.exp || 0,
            JSON.stringify(progressData.abilities || {}),
            JSON.stringify(progressData.achievements || []),
            JSON.stringify(progressData.settings || {}),
          ];
        } else {
          insertQuery = `INSERT INTO user_progress (user_id, level, score, best_score, exp, abilities, achievements, settings) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
           RETURNING *`;
          insertParams = [
            decoded.userId,
            progressData.level || 1,
            progressData.gold || progressData.score || 0,
            progressData.best_score || 0,
            progressData.exp || 0,
            JSON.stringify(progressData.abilities || {}),
            JSON.stringify(progressData.achievements || []),
            JSON.stringify(progressData.settings || {}),
          ];
        }

        result = await client.query(insertQuery, insertParams);
        console.log("📝 INSERT result:", result.rows[0]);
      } else {
        result = updateResult;
        console.log("📝 UPDATE successful:", result.rows[0]);
      }

      return res.status(200).json({
        message: "Progress saved successfully",
        progress: result.rows[0],
      });
    } catch (error) {
      console.error("Save progress error:", error);
      return res.status(500).json({
        error: "Internal server error",
        details: error.message,
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
