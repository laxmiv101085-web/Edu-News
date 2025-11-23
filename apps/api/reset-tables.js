import pool from './src/database.js';

async function resetDb() {
    const client = await pool.connect();
    try {
        console.log('🗑️ Dropping tables...');
        await client.query('DROP TABLE IF EXISTS saved_articles');
        await client.query('DROP TABLE IF EXISTS users');
        // We can keep articles if we want, but let's drop it to be clean
        // await client.query('DROP TABLE IF EXISTS articles'); 

        console.log('✅ Tables dropped. Restart the server to recreate them.');
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

resetDb();
