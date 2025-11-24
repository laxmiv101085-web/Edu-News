import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import pool, { initDatabase } from './database.js';
import { runIngestion } from './ingestion.js';
import authRoutes from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.CORS_ORIGIN,
            'http://localhost:3000',
            'http://localhost:3001',
            'https://educational-app-theta.vercel.app'
        ].filter(Boolean);

        // Allow any vercel.app domain
        const isVercelDomain = origin && origin.includes('.vercel.app');

        if (!origin || allowedOrigins.indexOf(origin) !== -1 || isVercelDomain) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ==================== ROUTES ====================

// Auth Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected'
    });
});

// Get feed/articles with pagination and filtering
app.get('/api/feed', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const search = req.query.search;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM articles';
        let countQuery = 'SELECT COUNT(*) FROM articles';
        const params = [];
        const conditions = [];

        // Filter by category if provided
        if (category && category !== 'all') {
            params.push(category);
            conditions.push(`category = $${params.length}`);
        }

        // Filter by search term if provided
        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(title ILIKE $${params.length} OR summary ILIKE $${params.length})`);
        }

        // Apply conditions
        if (conditions.length > 0) {
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }

        // Get total count
        const countResult = await pool.query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);

        // Get paginated results
        query += ' ORDER BY published_at DESC, created_at DESC';
        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        res.json({
            items: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching feed:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

// Get single article by ID
app.get('/api/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM articles WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});

// Get categories with article counts
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT category, COUNT(*) as count
      FROM articles
      GROUP BY category
      ORDER BY count DESC
    `);

        res.json(result.rows);

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

    import('jsonwebtoken').then(({ default: jwt }) => {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    });
};

// ==================== BOOKMARK ROUTES ====================

// Get saved articles
app.get('/api/bookmarks', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query(`
            SELECT a.*, sa.saved_at 
            FROM articles a
            JOIN saved_articles sa ON a.id = sa.article_id
            WHERE sa.user_id = $1
            ORDER BY sa.saved_at DESC
        `, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
});

// Save article
app.post('/api/bookmarks', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { articleId } = req.body;

        if (!articleId) {
            return res.status(400).json({ error: 'Article ID is required' });
        }

        await pool.query(
            'INSERT INTO saved_articles (user_id, article_id) VALUES ($1, $2) ON CONFLICT (user_id, article_id) DO NOTHING',
            [userId, articleId]
        );

        res.json({ message: 'Article saved successfully', articleId });
    } catch (error) {
        console.error('Error saving bookmark:', error);
        res.status(500).json({ error: 'Failed to save bookmark' });
    }
});

// Remove bookmark
app.delete('/api/bookmarks/:articleId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { articleId } = req.params;

        await pool.query(
            'DELETE FROM saved_articles WHERE user_id = $1 AND article_id = $2',
            [userId, articleId]
        );

        res.json({ message: 'Bookmark removed successfully', articleId });
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(500).json({ error: 'Failed to remove bookmark' });
    }
});

// Trigger manual ingestion
app.post('/api/admin/ingest', async (req, res) => {
    try {
        console.log('📥 Manual ingestion triggered');
        const result = await runIngestion();
        res.json(result);
    } catch (error) {
        console.error('Error running ingestion:', error);
        res.status(500).json({ error: 'Ingestion failed', message: error.message });
    }
});

// Get database stats
app.get('/api/stats', async (req, res) => {
    try {
        const articlesCount = await pool.query('SELECT COUNT(*) FROM articles');
        const latestArticle = await pool.query(
            'SELECT created_at FROM articles ORDER BY created_at DESC LIMIT 1'
        );

        res.json({
            totalArticles: parseInt(articlesCount.rows[0].count),
            latestArticle: latestArticle.rows[0]?.created_at || null
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ==================== STARTUP ====================

async function startServer() {
    try {
        // Initialize database
        console.log('🔧 Initializing database...');
        await initDatabase();

        // Only run ingestion and cron if NOT in Vercel environment
        if (!process.env.VERCEL) {
            // Run initial ingestion
            console.log('📥 Running initial ingestion...');
            await runIngestion();

            // Schedule periodic ingestion (every 30 minutes)
            cron.schedule('*/30 * * * *', async () => {
                console.log('⏰ Scheduled ingestion starting...');
                await runIngestion();
            });

            console.log('✅ Scheduled ingestion: Every 30 minutes');
        } else {
            console.log('ℹ️ Running in Vercel environment - Background tasks disabled');
        }

        // Start Express server only if not in Vercel (Vercel handles the server)
        if (!process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log('');
                console.log('🚀 ================================');
                console.log(`🚀 Server running on port ${PORT}`);
                console.log(`🚀 API URL: http://localhost:${PORT}`);
                console.log(`🚀 Health: http://localhost:${PORT}/health`);
                console.log(`🚀 Feed: http://localhost:${PORT}/api/feed`);
                console.log('🚀 ================================');
                console.log('');
            });
        }

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        // Don't exit process in Vercel, just log error
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
}

// Start the server logic
startServer();

// Export the app for Vercel
export default app;
