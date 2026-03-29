require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();
connectDB();

// ── Security headers ──────────────────────────────────────────
app.use(helmet());

// ── CORS — supports localhost dev + production domain ─────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ── Body size limit (prevent large payload attacks) ───────────
app.use(express.json({ limit: '10kb' }));

// ── Rate limiting ─────────────────────────────────────────────
const generalLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // stricter for login/signup
  message: { message: 'Too many auth attempts, please try again in 15 minutes.' },
});

const chatLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  message: { message: 'Too many chat messages. Slow down a bit! 😄' },
});

app.use('/api/', generalLimit);
app.use('/api/auth/login', authLimit);
app.use('/api/auth/signup', authLimit);
app.use('/api/chat', chatLimit);

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workout', require('./routes/workoutRoutes'));
app.use('/api/diet', require('./routes/dietRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/api', (req, res) => res.json({ message: 'GymTrainer API running ✅' }));

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
