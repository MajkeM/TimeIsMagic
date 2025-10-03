import { getUserProgress, saveUserProgress, verifyToken } from '@/lib/database';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const progress = await getUserProgress(decoded.userId);
    return Response.json({ progress });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const progressData = await request.json();
    const result = await saveUserProgress(decoded.userId, progressData);
    
    if (result.success) {
      return Response.json({ message: 'Progress saved successfully' });
    } else {
      return Response.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}