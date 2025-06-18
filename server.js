const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

console.log('Server starting...'); // Debug log

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://www.hireinn.in',       // ✅ Add this
        'https://hireinn.in'            // ✅ Add naked domain as well (optional but recommended)
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const mongo_uri = process.env.MONGODB_URI;
console.log('MongoDB URI set:', !!mongo_uri); // Debug log

mongoose.connect(mongo_uri)
    .then(() => {
        console.log('Connected to MongoDB successfully!'); // Debug log
    })
    .catch(err => {
        console.error('MongoDB connection error:', err); // Debug log
    });

// Contact Schema
const contactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSchema, 'feedback');

// Test route
app.get('/api/test', (req, res) => {
    console.log('Test API called!'); // Debug log
    res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Contact route
app.post('/api/contact', async (req, res) => {
    console.log('Contact API called!'); // Debug log
    console.log('Request body:', req.body); // Debug log
    
    try {
        const { email, message } = req.body;
        
        if (!email || !message) {
            console.log('Missing email or message'); // Debug log
            return res.status(400).json({ error: 'Email and message are required' });
        }

        console.log('Creating new contact...'); // Debug log
        const contact = new Contact({
            email,
            message
        });

        await contact.save();
        console.log('Contact saved successfully!'); // Debug log
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving contact:', error); // Debug log
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Root route
app.get('/', (req, res) => {
    console.log('Root route called!'); // Debug log
    res.json({ message: 'HireInn Backend API', status: 'running' });
});
const PORT = process.env.PORT || 3000
// For local development
if (1==1) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`); // Debug log
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`); // Debug log
    });
}

// Export for Vercel
module.exports = app; 