import { Client } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let client;
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      const connectionString =
        process.env.DATABASE_URL || process.env.POSTGRES_URL;

      client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
      });

      await client.connect();

      // Najdeme uživatele
      const result = await client.query(
        "SELECT id, username, password_hash, email FROM users WHERE username = $1",
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user = result.rows[0];

      // Ověříme heslo
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Vytvoříme JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token: token,
      });
    } catch (error) {
      console.error("Login error:", error);
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
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
