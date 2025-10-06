import { Client } from "pg";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let client;
  try {
    console.log("🔧 MIGRATION: Adding gold column");
    
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
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

    if (columnCheck.rows.length === 0) {
      // Add gold column if it doesn't exist
      console.log("🔧 Adding gold column to user_progress table");
      await client.query(`
        ALTER TABLE user_progress 
        ADD COLUMN gold INTEGER DEFAULT 0
      `);
      
      // Copy score values to gold for existing users
      await client.query(`
        UPDATE user_progress 
        SET gold = score 
        WHERE gold = 0
      `);
      
      console.log("🔧 Migration completed successfully");
    } else {
      console.log("🔧 Gold column already exists");
    }

    return res.status(200).json({
      success: true,
      message: "Migration completed successfully!",
      hasGoldColumn: columnCheck.rows.length > 0
    });

  } catch (error) {
    console.error("🔧 Migration error:", error);
    return res.status(500).json({
      error: "Migration failed",
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