import { Client } from 'pg';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === "POST") {
    let client;
    try {
      const { username, password, email } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
      
      client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
      });

      await client.connect();

      // Zkontrolujeme jestli uživatel už existuje
      const existingUser = await client.query(
        'SELECT id FROM users WHERE username = $1',
        [username]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Zahashujeme heslo
      const passwordHash = await bcrypt.hash(password, 10);

      // Vytvoříme uživatele
      const result = await client.query(
        'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, passwordHash, email]
      );

      const user = result.rows[0];

      return res.status(200).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
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
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
