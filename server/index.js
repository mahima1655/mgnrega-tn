const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

const dataService = require('./services/dataService');
const apiRoutes = require('./routes/api');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Using existing SQLite data - API fetch disabled');
  });
}

module.exports = app;