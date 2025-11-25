const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_2IKtOBFq8MQZ@ep-twilight-snow-a10gdjoy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
});

async function deleteAllArticles() {
    try {
        console.log('🗑️  Deleting ALL articles from database...');
        const result = await pool.query('DELETE FROM articles');
        console.log(`✅ Deleted ${result.rowCount} articles`);
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        await pool.end();
        process.exit(1);
    }
}

deleteAllArticles();
