require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const pollRoutes = require('./routes/polls');

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            const allowedOrigin = process.env.CLIENT_URL;
            if (!origin ||
                origin === allowedOrigin ||
                origin === allowedOrigin?.replace(/\/$/, '') ||
                origin.includes('vercel.app')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigin = process.env.CLIENT_URL;
        // Allow if no origin (like mobile apps/curl), or if it matches CLIENT_URL, 
        // or if it's a vercel deployment from your project
        if (!origin ||
            origin === allowedOrigin ||
            origin === allowedOrigin?.replace(/\/$/, '') ||
            origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinPoll', (pollId) => {
        socket.join(pollId);
        console.log(`User ${socket.id} joined poll: ${pollId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible to our router
app.set('io', io);

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        env: {
            hasMongo: !!process.env.MONGODB_URI,
            hasJwt: !!process.env.JWT_SECRET,
            clientUrl: process.env.CLIENT_URL
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({
        message: 'Something went wrong on the server!',
        error: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
