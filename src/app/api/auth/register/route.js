import { registerUser } from '@/lib/database';

export async function POST(request) {
  try {
    const { username, password, email } = await request.json();
    
    if (!username || !password) {
      return Response.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    const result = await registerUser(username, password, email);
    
    if (result.success) {
      return Response.json({ 
        message: 'User registered successfully',
        user: result.user 
      });
    } else {
      return Response.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}