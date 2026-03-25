require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workout', require('./routes/workoutRoutes'));
app.use('/api/diet', require('./routes/dietRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));

app.get('/api', (req, res) => res.json({ message: 'Gym Trainer API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
