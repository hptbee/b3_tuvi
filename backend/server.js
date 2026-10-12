import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import { isDbReady } from './src/db/sqlite.js';
import chartRoutes from './src/routes/chartRoutes.js';
import meaningRoutes from './src/routes/meaningRoutes.js';
import combinationRoutes from './src/routes/combinationRoutes.js';
import interpretationRoutes from './src/routes/interpretationRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Init DB Connection
connectDB();

// API Routes
app.use('/api/charts', chartRoutes);
app.use('/api/meanings', meaningRoutes);   // Tra cứu ý nghĩa sao và cung
app.use('/api/combinations', combinationRoutes); // Xử lý Cách Cục (Pattern Matching)
app.use('/api/interpretations', interpretationRoutes);

app.get('/api/health', (req, res) => res.json({
    status: 'server is running',
    database: isDbReady() ? 'sqlite' : 'disconnected'
}));
app.get('/api/test-direct', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Tuvi Backend Server running on port ${PORT}`);
});
