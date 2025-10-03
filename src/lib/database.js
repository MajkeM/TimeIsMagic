import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Vytvoření tabulek (spustit jednou)
export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        gold INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        exp INTEGER DEFAULT 0,
        current_character VARCHAR(50) DEFAULT 'wizard',
        abilities_unlocked TEXT DEFAULT '[]',
        characters_unlocked TEXT DEFAULT '["wizard"]',
        selected_abilities TEXT DEFAULT '{"R":"reload","F":"flash","T":"teleport"}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Registrace uživatele
export async function registerUser(username, password, email = null) {
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    
    const userResult = await sql`
      INSERT INTO users (username, password_hash, email)
      VALUES (${username}, ${passwordHash}, ${email})
      RETURNING id, username, email;
    `;
    
    const user = userResult.rows[0];
    
    // Vytvoření výchozího progressu
    await sql`
      INSERT INTO user_progress (user_id)
      VALUES (${user.id});
    `;
    
    return { success: true, user };
  } catch (error) {
    if (error.message.includes('duplicate key')) {
      return { success: false, error: 'Username already exists' };
    }
    return { success: false, error: error.message };
  }
}

// Přihlášení uživatele
export async function loginUser(username, password) {
  try {
    const result = await sql`
      SELECT id, username, password_hash, email 
      FROM users 
      WHERE username = ${username};
    `;
    
    if (result.rows.length === 0) {
      return { success: false, error: 'User not found' };
    }
    
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return { success: false, error: 'Invalid password' };
    }
    
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-fallback-secret-key',
      { expiresIn: '7d' }
    );
    
    return { 
      success: true, 
      user: { id: user.id, username: user.username, email: user.email },
      token 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Získání uživatelského progressu
export async function getUserProgress(userId) {
  try {
    const result = await sql`
      SELECT * FROM user_progress 
      WHERE user_id = ${userId};
    `;
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const progress = result.rows[0];
    return {
      gold: progress.gold,
      level: progress.level,
      exp: progress.exp,
      currentCharacter: progress.current_character,
      abilitiesUnlocked: JSON.parse(progress.abilities_unlocked),
      charactersUnlocked: JSON.parse(progress.characters_unlocked),
      selectedAbilities: JSON.parse(progress.selected_abilities)
    };
  } catch (error) {
    console.error('Get user progress error:', error);
    return null;
  }
}

// Uložení uživatelského progressu
export async function saveUserProgress(userId, progressData) {
  try {
    await sql`
      UPDATE user_progress 
      SET 
        gold = ${progressData.gold},
        level = ${progressData.level},
        exp = ${progressData.exp},
        current_character = ${progressData.currentCharacter},
        abilities_unlocked = ${JSON.stringify(progressData.abilitiesUnlocked)},
        characters_unlocked = ${JSON.stringify(progressData.charactersUnlocked)},
        selected_abilities = ${JSON.stringify(progressData.selectedAbilities)},
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId};
    `;
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Ověření JWT tokenu
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-key');
  } catch (error) {
    return null;
  }
}