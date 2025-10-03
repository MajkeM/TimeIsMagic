import { initDatabase } from "../../../lib/database.js";

export async function POST(request) {
  try {
    await initDatabase();
    return Response.json({ message: "Database initialized successfully" });
  } catch (error) {
    return Response.json(
      { error: "Database initialization failed" },
      { status: 500 }
    );
  }
}
