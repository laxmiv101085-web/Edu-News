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

async function checkDatabase() {
    try {
        console.log('🔍 Checking Neon Database Connection...\n');

        // Test basic connection
        const timeResult = await pool.query('SELECT NOW()');
        console.log('✅ Database connected successfully!');
        console.log('📅 Server time:', timeResult.rows[0].now);

        // Check tables
        const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

        console.log('\n📊 Tables in database:');
        tables.rows.forEach(row => {
            console.log('   ✓', row.table_name);
        });

        // Check record counts
        const articles = await pool.query('SELECT COUNT(*) FROM articles');
        const users = await pool.query('SELECT COUNT(*) FROM users');
        const saved = await pool.query('SELECT COUNT(*) FROM saved_articles');

        console.log('\n📈 Record counts:');
        console.log('   • Articles:', articles.rows[0].count);
        console.log('   • Users:', users.rows[0].count);
        console.log('   • Saved Articles:', saved.rows[0].count);

        // Get latest article
        const latestArticle = await pool.query(
            'SELECT title, created_at FROM articles ORDER BY created_at DESC LIMIT 1'
        );

        if (latestArticle.rows.length > 0) {
            console.log('\n📰 Latest article:');
            console.log('   Title:', latestArticle.rows[0].title);
            console.log('   Created:', latestArticle.rows[0].created_at);
        }

        console.log('\n✅ All checks passed! Neon database is properly connected.\n');

    } catch (error) {
        console.error('\n❌ Database check failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkDatabase();
