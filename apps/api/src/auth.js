import express from 'express';
import pool from './database.js';

const router = express.Router();

// Sync User from Firebase
router.post('/sync', async (req, res) => {
    const { email, name, uid } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userCheck.rows.length > 0) {
            // Update existing user
            await pool.query(
                'UPDATE users SET name = $1 WHERE email = $2',
                [name, email]
            );
            return res.json({ message: 'User synced', user: userCheck.rows[0] });
        }

        // Insert new user
        // Note: We don't store password_hash for Firebase users
        const newUser = await pool.query(
            'INSERT INTO users (email, name, created_at) VALUES ($1, $2, NOW()) RETURNING id, email, name',
            [email, name]
        );

        res.status(201).json({ message: 'User created', user: newUser.rows[0] });
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
