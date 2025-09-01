// Gemini API Integration for Weraser
class GeminiChat {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
        // Use fastest model: gemini-1.5-flash-8b is 50% faster
        this.model = 'gemini-1.5-flash-8b-latest';  // Fastest model available
        this.chatHistory = [];
    }

    // API 키 검증
    async validateApiKey() {
        try {
            const response = await fetch(`${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: "Hello"
                        }]
                    }]
                })
            });
            return response.ok;
        } catch (error) {
            console.error('API Key validation failed:', error);
            return false;
        }
    }

    // 문서 컨텍스트 준비
    prepareContext(documents) {
        let context = "You are Weraser AI, an intelligent knowledge management assistant. ";
        context += "You have access to the following documents:\n\n";
        
        documents.forEach(doc => {
            context += `Document: ${doc.name}\n`;
            context += `Type: ${doc.type}\n`;
            context += `Content: ${doc.content || 'Binary file'}\n`;
            context += "---\n";
        });
        
        return context;
    }

    // 메시지 전송
    async sendMessage(message, documents = []) {
        console.log('Sending message to Gemini:', message);
        try {
            // 문서 컨텍스트 추가
            let fullMessage = message;
            if (documents.length > 0) {
                const context = this.prepareContext(documents);
                fullMessage = `${context}\n\nUser Question: ${message}`;
            }

            // Gemini API 요청
            const url = `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`;
            console.log('API URL:', url.replace(this.apiKey, '***'));
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: fullMessage
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.3,  // Lower for faster, more deterministic responses
                        topK: 20,  // Reduced for speed
                        topP: 0.8,  // Reduced for speed
                        maxOutputTokens: 512,  // Reduced for faster response
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('Gemini response:', data);
            
            // 응답 파싱
            if (data.candidates && data.candidates[0]) {
                const responseText = data.candidates[0].content.parts[0].text;
                console.log('Extracted text:', responseText);
                
                // 채팅 히스토리 저장
                this.chatHistory.push({
                    role: 'user',
                    content: message
                });
                this.chatHistory.push({
                    role: 'assistant',
                    content: responseText
                });

                return {
                    success: true,
                    response: responseText,
                    sources: this.extractSources(responseText, documents)
                };
            } else {
                throw new Error('No response from Gemini');
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 출처 추출 (문서 참조)
    extractSources(response, documents) {
        const sources = [];
        documents.forEach(doc => {
            if (response.toLowerCase().includes(doc.name.toLowerCase())) {
                sources.push({
                    name: doc.name,
                    type: doc.type,
                    relevance: 'high'
                });
            }
        });
        return sources;
    }

    // 스트리밍 응답
    async *streamMessage(message, documents = []) {
        try {
            let fullMessage = message;
            if (documents.length > 0) {
                const context = this.prepareContext(documents);
                fullMessage = `${context}\n\nUser Question: ${message}`;
            }

            const response = await fetch(`${this.baseURL}/models/${this.model}:streamGenerateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: fullMessage
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                yield chunk;
            }
        } catch (error) {
            console.error('Streaming error:', error);
            yield `Error: ${error.message}`;
        }
    }

    // 문서 요약
    async summarizeDocument(document) {
        const prompt = `Please summarize the following document in Korean:
        
        Document Name: ${document.name}
        Content: ${document.content}
        
        Provide:
        1. Main topics (3-5 points)
        2. Key insights
        3. Important data or numbers`;

        return await this.sendMessage(prompt);
    }

    // 다중 문서 질의
    async queryMultipleDocuments(query, documents) {
        const prompt = `Based on the provided documents, please answer the following question in Korean:
        
        Question: ${query}
        
        Instructions:
        - Provide accurate information from the documents
        - Cite which document the information comes from
        - If information is not in the documents, say so clearly`;

        return await this.sendMessage(prompt, documents);
    }
}

// UI 통합 헬퍼 함수
function initializeGeminiChat() {
    // Get API key from secure config or localStorage
    let apiKey = localStorage.getItem('gemini_api_key');
    
    // If no saved key, use the secure config
    if (!apiKey && window.GEMINI_API_CONFIG) {
        apiKey = window.GEMINI_API_CONFIG.getKey();
    }
    
    if (!apiKey) {
        console.error('No API key available');
        showNotification('API 키를 찾을 수 없습니다', 'error');
        return;
    }
    
    // Gemini 초기화
    window.geminiChat = new GeminiChat(apiKey);
    console.log('Gemini API initialized successfully');
    
    // API 상태 표시 (함수가 있는 경우에만)
    if (typeof showApiStatus === 'function') {
        showApiStatus(true);
    }
    
    // 채팅 기능 즉시 활성화
    enableGeminiChat();
}

// API 상태 표시 함수
function showApiStatus(connected) {
    // Create status indicator if it doesn't exist
    if (!document.querySelector('.api-status')) {
        const statusDiv = document.createElement('div');
        statusDiv.className = `api-status ${connected ? 'connected' : 'disconnected'}`;
        statusDiv.innerHTML = `
            <span class="api-status-dot"></span>
            <span>Gemini API ${connected ? '연결됨' : '연결 안됨'}</span>
        `;
        document.body.appendChild(statusDiv);
    } else {
        const status = document.querySelector('.api-status');
        status.className = `api-status ${connected ? 'connected' : 'disconnected'}`;
        status.querySelector('span:last-child').textContent = `Gemini API ${connected ? '연결됨' : '연결 안됨'}`;
    }
}

// 채팅 기능 활성화
function enableGeminiChat() {
    // 전송 버튼에 이벤트 리스너 추가
    const sendButton = document.querySelector('.chat-input button');
    const chatInput = document.querySelector('.chat-input input');
    
    if (sendButton && chatInput) {
        sendButton.onclick = async () => {
            const message = chatInput.value.trim();
            if (!message) return;
            
            // 사용자 메시지 표시
            addChatMessage('user', message);
            chatInput.value = '';
            
            // AI 응답 요청
            showTypingIndicator();
            
            // 벡터 검색 수행 (RAG Engine을 통해)
            let vectorSearchResult = null;
            if (window.WeraserCore && window.WeraserCore.ragEngine.isVectorEngineReady) {
                try {
                    vectorSearchResult = await window.WeraserCore.ragEngine.searchQuery(message, 'org');
                    console.log('🔍 벡터 검색 결과:', vectorSearchResult);
                } catch (error) {
                    console.warn('벡터 검색 실패, 일반 모드로 진행:', error);
                }
            }
            
            // 현재 문서 가져오기
            const documents = getCurrentDocuments();
            
            // 벡터 검색 결과가 있으면 우선 사용
            let result;
            if (vectorSearchResult && vectorSearchResult.confidence > 0.6) {
                console.log('✅ 벡터 RAG 응답 사용');
                result = {
                    success: true,
                    response: vectorSearchResult.text,
                    sources: vectorSearchResult.source ? [vectorSearchResult.source] : [],
                    metadata: vectorSearchResult.data
                };
            } else {
                console.log('📝 기존 Gemini API 사용');
                result = await window.geminiChat.sendMessage(message, documents);
            }
            
            hideTypingIndicator();
            
            if (result.success) {
                // AI 응답 표시
                addChatMessage('assistant', result.response, result.sources);
            } else {
                showNotification('오류: ' + result.error, 'error');
            }
        };
        
        // Enter 키 지원
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                sendButton.click();
            }
        });
    }
}

// 현재 프로젝트의 문서 가져오기
function getCurrentDocuments() {
    // 실제 구현에서는 업로드된 문서 데이터를 가져옴
    // 여기서는 예시 데이터
    return [
        {
            name: "회사소개.pdf",
            type: "pdf",
            content: "Weraser는 AI 기반 지식 관리 플랫폼입니다..."
        },
        {
            name: "제품사양.xlsx",
            type: "excel",
            content: "제품명: Weraser Pro, 가격: $99/월, 기능: RAG, 멀티에이전트..."
        }
    ];
}

// 채팅 메시지 추가
function addChatMessage(role, content, sources = []) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    let sourcesHtml = '';
    if (sources && sources.length > 0) {
        sourcesHtml = '<div class="message-sources">출처: ';
        sources.forEach(source => {
            sourcesHtml += `<span class="source-tag">${source.name}</span> `;
        });
        sourcesHtml += '</div>';
    }
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${content}
            ${sourcesHtml}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 타이핑 인디케이터
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = 'AI가 답변을 생성 중입니다...';
    document.querySelector('.chat-messages').appendChild(indicator);
}

function hideTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator');
    if (indicator) indicator.remove();
}

// 알림 표시
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// 페이지 로드 시 초기화 - 모달 없이 자동 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // 모달 생성 방지
        window.NO_API_MODAL = true;
        initializeGeminiChat();
    });
} else {
    window.NO_API_MODAL = true;
    initializeGeminiChat();
}