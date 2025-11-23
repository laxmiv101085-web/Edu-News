import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './database.js';

const router = express.Router();

// JWT Secret (should be in environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Register new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    try {
        // Check if user already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new user
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, name, email, created_at',
            [name, email, password_hash]
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.rows[0].id, email: newUser.rows[0].email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find user
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        // Check if user has password (might be Firebase user)
        if (!user.password_hash) {
            return res.status(401).json({ message: 'Please sign up with email and password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user without password
        const { password_hash, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Verify token and get user
router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const userResult = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user: userResult.rows[0] });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        console.error('Verify token error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Sync User from Firebase (keep for backwards compatibility, but mark as deprecated)
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
