import { Client } from 'pg';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;

  try {
    console.log('🏆 Leaderboard API called');
    
    // Verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('🏆 No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    console.log('🏆 Token received, verifying...');
    
    if (!process.env.JWT_SECRET) {
      console.error('🏆 JWT_SECRET not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🏆 Token verified for user:', decoded.userId);

    if (!decoded.userId) {
      console.log('🏆 Invalid token - no userId');
      return res.status(401).json({ error: 'Invalid token' });
    }

    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    console.log('🏆 Connecting to database...');
    
    client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('🏆 Database connected, fetching leaderboard...');

    // Get top 50 players by best score
    const result = await client.query(`
      SELECT 
        u.username,
        up.user_id,
        up.best_score,
        up.level,
        up.last_played
      FROM user_progress up
      JOIN users u ON up.user_id = u.id
      WHERE up.best_score > 0
      ORDER BY up.best_score DESC
      LIMIT 50
    `);

    console.log('🏆 Leaderboard fetched, rows:', result.rows.length);

    return res.status(200).json({
      success: true,
      leaderboard: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
}