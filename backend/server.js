require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');

// Import routes
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumes');
const jobRoutes = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Resume Builder API is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`💾 Database: SQLite\n`);
});
