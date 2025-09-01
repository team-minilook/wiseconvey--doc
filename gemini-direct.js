// Simplified Gemini API with better error handling and timeout
class SimpleGeminiChat {
    constructor(apiKey) {
        this.apiKey = apiKey || 'AIzaSyCI1spB1J-3E5lkwmEUzG8v5C37duj0HVg';
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
        // Use fastest model
        this.model = 'gemini-1.5-flash';
    }
    
    async sendMessage(message) {
        console.log('[Gemini] Sending message:', message);
        const startTime = Date.now();
        
        const url = `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`;
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
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
                        temperature: 0.1,  // Very low for speed
                        maxOutputTokens: 256,  // Short responses
                        topK: 10,
                        topP: 0.5
                    }
                })
            });
            
            clearTimeout(timeoutId);
            
            const responseTime = Date.now() - startTime;
            console.log(`[Gemini] Response received in ${responseTime}ms`);
            
            if (!response.ok) {
                const error = await response.text();
                console.error('[Gemini] API Error:', error);
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('[Gemini] Response data:', data);
            
            if (data.candidates && data.candidates[0]) {
                const text = data.candidates[0].content.parts[0].text;
                return {
                    success: true,
                    response: text,
                    responseTime: responseTime
                };
            } else {
                throw new Error('No response from API');
            }
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('[Gemini] Request timeout');
                return {
                    success: false,
                    error: '요청 시간 초과 (10초)',
                    fallback: true
                };
            }
            
            console.error('[Gemini] Error:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }
    
    // Fallback response when API fails
    getFallbackResponse(message) {
        const responses = {
            '안녕': '안녕하세요! Weraser AI입니다. 무엇을 도와드릴까요?',
            '날씨': '날씨 정보는 실시간 데이터가 필요합니다. 기상청 웹사이트를 확인해주세요.',
            'default': '죄송합니다. 현재 AI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.'
        };
        
        for (const key in responses) {
            if (message.includes(key)) {
                return responses[key];
            }
        }
        
        return responses.default;
    }
}

// Global initialization
window.SimpleGeminiChat = SimpleGeminiChat;