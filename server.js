const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:5500'],
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const mongo_uri = process.env.MONGODB_URI;

mongoose.connect(mongo_uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

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

// Routes
app.post('/api/contact', async (req, res) => {
    // console.log("api call ")
    try {
        const { email, message } = req.body;
        
        if (!email || !message) {
            return res.status(400).json({ error: 'Email and message are required' });
        }

        const contact = new Contact({
            email,
            message
        });

        await contact.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 