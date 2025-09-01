// Server-side proxy for Gemini API (Node.js/Express)
// This solves CORS issues for production deployment

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your frontend domain
app.use(cors({
    origin: ['https://team-minilook.github.io', 'http://localhost:8080'],
    credentials: true
}));

app.use(express.json());

// Gemini API proxy endpoint
app.post('/api/gemini', async (req, res) => {
    const { message } = req.body;
    
    // Use environment variable for API key (secure)
    const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCI1spB1J-3E5lkwmEUzG8v5C37duj0HVg';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b-latest:generateContent';
    
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 512,
                    topK: 20,
                    topP: 0.8
                }
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.candidates) {
            res.json({
                success: true,
                response: data.candidates[0].content.parts[0].text
            });
        } else {
            res.status(400).json({
                success: false,
                error: data.error?.message || 'API Error'
            });
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Weraser Gemini Proxy' });
});

app.listen(PORT, () => {
    console.log(`Gemini proxy server running on port ${PORT}`);
});

// Package.json dependencies:
/*
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "node-fetch": "^2.6.7",
    "dotenv": "^16.0.3"
  }
}
*/