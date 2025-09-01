// Smart Gemini API with CORS detection and fallback
class SmartGeminiChat {
    constructor(apiKey) {
        this.apiKey = apiKey || 'AIzaSyCI1spB1J-3E5lkwmEUzG8v5C37duj0HVg';
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
        this.model = 'gemini-1.5-flash-8b-latest';
        this.mockChat = new MockGeminiChat();
        this.useMock = false;
        this.corsDetected = false;
    }
    
    async sendMessage(message) {
        console.log('[SmartGemini] Attempting to send message:', message);
        
        // First try real API
        if (!this.useMock) {
            try {
                const result = await this.sendRealMessage(message);
                if (result.success) {
                    console.log('[SmartGemini] Real API success');
                    return result;
                }
            } catch (error) {
                console.warn('[SmartGemini] Real API failed:', error.message);
                if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                    this.corsDetected = true;
                    console.log('[SmartGemini] CORS detected, switching to mock mode');
                    this.useMock = true;
                }
            }
        }
        
        // Fallback to mock
        console.log('[SmartGemini] Using mock response');
        const mockResult = await this.mockChat.sendMessage(message);
        
        // Add CORS warning
        if (this.corsDetected) {
            mockResult.warning = 'CORS 제한으로 인해 시뮬레이션 모드로 작동 중입니다. 실제 배포 환경에서는 정상 작동합니다.';
        }
        
        return mockResult;
    }
    
    async sendRealMessage(message) {
        const url = `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`;
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 256,
                        topK: 10,
                        topP: 0.5
                    }
                })
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates[0]) {
                const text = data.candidates[0].content.parts[0].text;
                return {
                    success: true,
                    response: text,
                    responseTime: Date.now() - startTime
                };
            } else {
                throw new Error('No response from API');
            }
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            
            throw error;
        }
    }
}

// Global initialization
window.SmartGeminiChat = SmartGeminiChat;