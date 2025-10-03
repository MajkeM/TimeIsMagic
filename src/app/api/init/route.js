import { initDatabase } from "../../../lib/database.js";

export async function GET(request) {
  try {
    await initDatabase();
    return Response.json({
      success: true,
      message: "Database initialized successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    return Response.json(
      {
        success: false,
        error: "Database initialization failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

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
