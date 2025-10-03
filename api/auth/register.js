import { registerUser } from "../../src/lib/database.js";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username, password, email } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const result = await registerUser(username, password, email);

      if (result.success) {
        return res.status(200).json({
          message: "User registered successfully",
          user: result.user,
        });
      } else {
        return res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}