// backend/server.js
import express      from 'express';
import dotenv       from 'dotenv';
import cors         from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';

import authRoutes    from './routes/authRoutes.js';
import adminRoutes   from './routes/adminRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import parentRoutes  from './routes/parentRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ── CORS ──────────────────────────────────────────────────
app.use(cors({
  origin:      true,
  credentials: true,
  methods:     ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
  ],
}));

app.options('*', cors());

// ── Body Parsers ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Health Check ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🏫 EduManage API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status:    '✅ Server is running!',
    timestamp: new Date().toISOString(),
    routes: [
      '/api/auth',
      '/api/admin',
      '/api/teacher',
      '/api/student',
      '/api/parent',
    ],
  });
});

// ── API Routes ────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/admin',   adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/parent',  parentRoutes);

// ── 404 Handler ───────────────────────────────────────────
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Error Handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('══════════════════════════════════════');
  console.log(`✅ Server    → http://localhost:${PORT}`);
  console.log(`🔍 Health   → http://localhost:${PORT}/api/health`);
  console.log('══════════════════════════════════════');
});