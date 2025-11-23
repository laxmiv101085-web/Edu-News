import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

try {
    await client.connect();
    console.log('✅ Connected successfully!');

    const result = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', result.rows[0]);

    await client.end();
    console.log('✅ Connection closed');
    process.exit(0);

} catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
}
