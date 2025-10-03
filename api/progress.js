import {
  getUserProgress,
  saveUserProgress,
  verifyToken,
} from "../src/lib/database.js";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const progress = await getUserProgress(decoded.userId);
      return res.status(200).json({ progress });
    } catch (error) {
      console.error("Get progress error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const progressData = req.body;
      const result = await saveUserProgress(decoded.userId, progressData);

      if (result.success) {
        return res.status(200).json({ message: "Progress saved successfully" });
      } else {
        return res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error("Save progress error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}