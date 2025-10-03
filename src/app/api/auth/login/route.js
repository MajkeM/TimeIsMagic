import { loginUser } from "../../../../lib/database.js";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const result = await loginUser(username, password);

    if (result.success) {
      return Response.json({
        message: "Login successful",
        user: result.user,
        token: result.token,
      });
    } else {
      return Response.json({ error: result.error }, { status: 401 });
    }
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
