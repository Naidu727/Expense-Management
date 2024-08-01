const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const connectDb = require('./config/connectDB');
// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to database

connectDb();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'https://expense-management-u19n.onrender.com'],
    credentials: true
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API routes
app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1/transections', require('./routes/transectionRoute'));

// Catch-all handler for all other routes (for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Port
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
