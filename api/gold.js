import { Client } from "pg";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let client;
  try {
    console.log("🪙 GOLD API called");
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { operation, amount } = req.body;

    if (!operation || !amount) {
      return res.status(400).json({ error: "Missing operation or amount" });
    }

    const connectionString =
      process.env.DATABASE_URL || process.env.POSTGRES_URL;
    client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    let result;
    if (operation === "add") {
      // Add gold
      result = await client.query(
        `UPDATE user_progress SET gold = gold + $2, updated_at = NOW() WHERE user_id = $1 RETURNING gold`,
        [decoded.userId, amount]
      );
    } else if (operation === "subtract") {
      // Subtract gold (for purchases)
      result = await client.query(
        `UPDATE user_progress SET gold = GREATEST(gold - $2, 0), updated_at = NOW() WHERE user_id = $1 RETURNING gold`,
        [decoded.userId, amount]
      );
    } else {
      return res.status(400).json({ error: "Invalid operation" });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(
      "🪙 Gold operation successful:",
      operation,
      amount,
      "New gold:",
      result.rows[0].gold
    );
    return res.status(200).json({
      success: true,
      newGold: result.rows[0].gold,
      operation,
      amount,
    });
  } catch (error) {
    console.error("🪙 Gold operation error:", error);
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
}
