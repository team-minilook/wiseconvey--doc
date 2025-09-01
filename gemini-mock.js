// Mock Gemini API for CORS-free testing
class MockGeminiChat {
    constructor() {
        this.responses = {
            '안녕': '안녕하세요! Weraser AI입니다. 무엇을 도와드릴까요?',
            '회사': 'Weraser는 기업의 지식을 AI로 관리하는 플랫폼입니다. 문서를 업로드하면 AI가 학습하여 질문에 답변합니다.',
            '기능': 'Weraser의 주요 기능:\n1. 문서 업로드 및 관리\n2. AI 기반 질의응답\n3. 멀티에이전트 협업\n4. 실시간 지식 검색',
            '가격': 'Weraser의 가격 정책:\n- Starter: 월 99,000원\n- Professional: 월 299,000원\n- Enterprise: 별도 문의',
            '문서': '지원하는 문서 형식:\n- PDF, Word, Excel\n- PPT, 이미지 파일\n- 텍스트 파일',
            'rag': 'RAG(Retrieval Augmented Generation)는 문서에서 관련 정보를 검색한 후 AI가 답변을 생성하는 기술입니다.',
            '도움': '제가 도와드릴 수 있는 것들:\n- 제품 소개\n- 기능 설명\n- 가격 안내\n- 기술 문의'
        };
    }
    
    async sendMessage(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find matching response
        const lowercaseMsg = message.toLowerCase();
        let response = '이해했습니다. ';
        
        // Check for keywords
        for (const [key, value] of Object.entries(this.responses)) {
            if (lowercaseMsg.includes(key.toLowerCase())) {
                response = value;
                break;
            }
        }
        
        // Default intelligent response
        if (response === '이해했습니다. ') {
            if (lowercaseMsg.includes('?')) {
                response += '질문하신 내용에 대해 더 자세한 정보가 필요합니다. 구체적으로 무엇이 궁금하신가요?';
            } else {
                response += `"${message}"에 대해 말씀하셨군요. 더 자세히 설명해 주시면 정확한 답변을 드릴 수 있습니다.`;
            }
        }
        
        return {
            success: true,
            response: response,
            responseTime: 500
        };
    }
}

// Export for use
window.MockGeminiChat = MockGeminiChat;