import { loginUser } from "../../src/lib/database.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { username, password } = req.body;

      const result = await loginUser(username, password);

      if (result.success) {
        return res.status(200).json({
          message: "Login successful",
          user: result.user,
          token: result.token,
        });
      } else {
        return res.status(401).json({ error: result.error });
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
