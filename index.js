const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

const cron = require('node-cron');
const axios = require('axios');
dotenv.config();
const PORT = 3000;

//Database Connection
const connectDB = require('./config/db');
connectDB();

// Middleware (optional)
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/test', require('./routes/testRoutes'));

app.use('/api/flashCard', require('./routes/flashCardRoutes'));

app.use('/keep-alive', (req, res) => {
  res.json('ok');
});

cron.schedule('*/13 * * * *', async () => {
  try {
    const res = await axios.get(
      'https://prepnovate-backend.onrender.com/keep-alive'
    );
    console.log('Pinged self:', res.statusText);
  } catch (err) {
    console.error('Ping failed:', err.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
