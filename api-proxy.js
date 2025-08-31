// Node.js 프록시 서버 (CORS 우회용)
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBOoxrunnLgHYTnytY281yJFAikSEQV-J0';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// 프록시 엔드포인트
app.post('/api/gemini', async (req, res) => {
    try {
        const response = await axios.post(
            `${API_BASE}/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Proxy error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || { message: error.message }
        });
    }
});

// 모델 목록 조회
app.get('/api/models', async (req, res) => {
    try {
        const response = await axios.get(
            `${API_BASE}/models?key=${GEMINI_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Models error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || { message: error.message }
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Gemini API 프록시 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`API 테스트: http://localhost:${PORT}/api/models`);
});