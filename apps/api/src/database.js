import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

// Initialize database tables
export async function initDatabase() {
  const client = await pool.connect();

  try {
    console.log('🔧 Initializing database tables...');

    // Create articles table first (has no dependencies)
    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT,
        summary TEXT,
        category VARCHAR(100),
        source VARCHAR(255),
        author VARCHAR(255),
        image_url TEXT,
        url TEXT UNIQUE,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create users table (has no dependencies)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create saved_articles table (simplified without foreign keys to avoid conflicts)
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_articles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        article_id INTEGER,
        saved_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, article_id)
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
