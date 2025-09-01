// Production-ready Gemini API client
// Uses server proxy to avoid CORS issues

class ProductionGeminiChat {
    constructor(proxyUrl) {
        // For GitHub Pages, you'll need to deploy the proxy server separately
        // Options: Vercel, Netlify Functions, AWS Lambda, or your own server
        this.proxyUrl = proxyUrl || 'https://your-proxy-server.vercel.app/api/gemini';
        this.fallbackChat = new MockGeminiChat();
    }
    
    async sendMessage(message) {
        console.log('[Production] Sending message via proxy:', message);
        
        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('[Production] Proxy response success');
                return {
                    success: true,
                    response: data.response,
                    responseTime: Date.now() - startTime
                };
            } else {
                console.warn('[Production] Proxy error:', data.error);
                // Fallback to mock
                return await this.fallbackChat.sendMessage(message);
            }
        } catch (error) {
            console.error('[Production] Network error:', error);
            // Fallback to mock
            const result = await this.fallbackChat.sendMessage(message);
            result.warning = '서버 연결 문제로 시뮬레이션 모드로 작동 중입니다.';
            return result;
        }
    }
}

// Auto-detect environment and use appropriate client
class AutoGeminiChat {
    constructor() {
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Local development - try direct API with CORS fallback
            console.log('[AutoGemini] Local environment detected - using SmartGeminiChat');
            this.client = new SmartGeminiChat();
        } else if (hostname.includes('github.io')) {
            // GitHub Pages - must use proxy or mock
            console.log('[AutoGemini] GitHub Pages detected - using mock mode');
            this.client = new MockGeminiChat();
            // To use real API on GitHub Pages, deploy server-proxy.js to a service like Vercel
            // Then update this to: this.client = new ProductionGeminiChat('your-proxy-url');
        } else {
            // Other production environment
            console.log('[AutoGemini] Production environment - configure proxy URL');
            this.client = new ProductionGeminiChat();
        }
    }
    
    async sendMessage(message) {
        return await this.client.sendMessage(message);
    }
}

// Export for use
window.ProductionGeminiChat = ProductionGeminiChat;
window.AutoGeminiChat = AutoGeminiChat;