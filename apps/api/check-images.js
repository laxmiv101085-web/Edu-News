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

async function checkImages() {
    try {
        const result = await pool.query(
            'SELECT id, title, image_url, source FROM articles ORDER BY created_at DESC LIMIT 10'
        );

        console.log('📸 Recent articles and their images:\n');

        result.rows.forEach((row, i) => {
            console.log(`${i + 1}. ${row.title.substring(0, 60)}...`);
            console.log(`   Source: ${row.source}`);
            console.log(`   Image: ${row.image_url || '❌ NO IMAGE'}\n`);
        });

        // Count articles with and without images
        const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(image_url) as with_images,
        COUNT(*) - COUNT(image_url) as without_images
      FROM articles
    `);

        console.log('📊 Image Statistics:');
        console.log(`   Total articles: ${stats.rows[0].total}`);
        console.log(`   With images: ${stats.rows[0].with_images}`);
        console.log(`   Without images: ${stats.rows[0].without_images}`);

        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkImages();
