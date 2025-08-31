/**
 * Weraser Daily Operations coreChat
 * AI 기반 기업 지식 관리 플랫폼
 */

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Weraser coreChat 시작');
    
    // 초기화
    init();
});

/**
 * 애플리케이션 초기화
 */
function init() {
    // 네비게이션 설정
    setupNavigation();
    
    // 채팅 기능 설정
    setupChat();
    
    // 에이전트 선택 설정
    setupAgentSelector();
    
    // 파일 업로드 설정
    setupFileUpload();
    
    // 인터랙션 설정
    setupInteractions();
    
    // 데모 데이터 로드
    loadDemoData();
}

/**
 * 네비게이션 설정
 */
function setupNavigation() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 채팅 기능 설정
 */
function setupChat() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatForm) return;
    
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // 사용자 메시지 추가
        addMessage(message, 'user');
        
        // 입력 필드 초기화
        chatInput.value = '';
        
        // AI 응답 시뮬레이션
        showTypingIndicator();
        
        // 실제 환경에서는 여기서 API 호출
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateAIResponse(message);
            addMessage(response.text, 'ai', response.reference);
        }, 1500);
    });
}

/**
 * 메시지 추가
 */
function addMessage(text, sender, reference = null) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message--${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message__content';
    contentDiv.innerHTML = text;
    
    messageDiv.appendChild(contentDiv);
    
    // 참조 정보 추가
    if (reference) {
        const refDiv = document.createElement('div');
        refDiv.className = 'message__reference';
        refDiv.innerHTML = `📎 출처: ${reference}`;
        contentDiv.appendChild(refDiv);
    }
    
    chatMessages.appendChild(messageDiv);
    
    // 스크롤을 최하단으로
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * AI 응답 생성 (데모용)
 */
function generateAIResponse(query) {
    const responses = {
        '매출': {
            text: '현재 분기 매출은 32억원으로, 목표 대비 64% 달성했습니다.<br>전년 동기 대비 23% 성장했으며, 주요 성장 동력은 신규 고객 확보(+15%)와 기존 고객 업셀링(+8%)입니다.',
            reference: 'Q3_매출보고서.xlsx (Sheet: 요약, A1:F20)'
        },
        'HS': {
            text: '요청하신 제품의 HS 코드는 <strong>8471.30.1000</strong>입니다.<br>분류: 자동자료처리기계 - 휴대용 - 노트북 컴퓨터<br>기본 관세율: 0%<br>FTA 적용 가능: 한-미, 한-EU, 한-중',
            reference: '제품_HS코드_목록.csv (행 234)'
        },
        '계약': {
            text: '현재 유효한 계약은 총 12건입니다:<br>• H-Line: 2024.12.31까지 (자동연장 조항 있음)<br>• 램리서치: 2025.06.30까지<br>• 한국타이어: 2024.09.30 만료 예정 (갱신 협상 중)',
            reference: '계약관리대장.xlsx (Sheet: 현황)'
        },
        default: {
            text: '관련 문서를 분석 중입니다. 더 구체적인 질문을 주시면 정확한 답변을 드릴 수 있습니다.<br><br>예시:<br>• "지난달 판매 실적은?"<br>• "이 제품의 HS 코드는?"<br>• "계약 만료일이 언제야?"',
            reference: null
        }
    };
    
    // 간단한 키워드 매칭
    for (const key in responses) {
        if (query.includes(key)) {
            return responses[key];
        }
    }
    
    return responses.default;
}

/**
 * 타이핑 인디케이터 표시
 */
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'message message--ai typing-indicator';
    indicator.innerHTML = '<div class="message__content"><span class="loading"></span> AI가 분석 중입니다...</div>';
    indicator.id = 'typingIndicator';
    
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * 타이핑 인디케이터 숨기기
 */
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

/**
 * 에이전트 선택 설정
 */
function setupAgentSelector() {
    const agentOptions = document.querySelectorAll('.agent-option:not([style*="opacity"])');
    
    agentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 기존 활성화 제거
            document.querySelectorAll('.agent-option').forEach(opt => {
                opt.classList.remove('agent-option--active');
            });
            
            // 새로운 활성화
            this.classList.add('agent-option--active');
            
            const agentType = this.dataset.agent;
            showNotification(`${this.textContent.trim()} 에이전트로 전환되었습니다`, 'success');
            
            // 에이전트별 환영 메시지
            const welcomeMessages = {
                general: '일반 업무에 대해 도와드리겠습니다.',
                logistics: '물류 및 운송 관련 전문 지식을 제공합니다.',
                customs: 'HS 코드 분류와 관세 최적화를 지원합니다.'
            };
            
            if (welcomeMessages[agentType]) {
                addMessage(welcomeMessages[agentType], 'ai');
            }
        });
    });
}

/**
 * 파일 업로드 설정
 */
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadArea || !fileInput) return;
    
    // 클릭으로 업로드
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 드래그 앤 드롭
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--color-primary)';
        uploadArea.style.backgroundColor = 'rgba(0, 102, 255, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(0, 102, 255, 0.3)';
        uploadArea.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(0, 102, 255, 0.3)';
        uploadArea.style.backgroundColor = 'transparent';
        
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    });
    
    // 파일 선택
    fileInput.addEventListener('change', (e) => {
        handleFileUpload(e.target.files);
    });
}

/**
 * 파일 업로드 처리
 */
function handleFileUpload(files) {
    if (!files || files.length === 0) return;
    
    showLoading();
    
    // 파일 처리 시뮬레이션
    setTimeout(() => {
        hideLoading();
        
        let uploadedCount = 0;
        for (let file of files) {
            if (validateFile(file)) {
                addDocumentToList(file.name);
                uploadedCount++;
            }
        }
        
        if (uploadedCount > 0) {
            showNotification(`${uploadedCount}개 문서가 성공적으로 업로드되었습니다`, 'success');
            addMessage(`새로운 문서 ${uploadedCount}개가 업로드되어 분석이 완료되었습니다. 이제 관련 질문을 하실 수 있습니다.`, 'ai');
        }
    }, 2000);
}

/**
 * 파일 유효성 검사
 */
function validateFile(file) {
    const allowedTypes = ['pdf', 'docx', 'xlsx', 'csv', 'txt'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
        showNotification(`${file.name}은 지원하지 않는 형식입니다`, 'error');
        return false;
    }
    
    // 파일 크기 제한 (100MB)
    if (file.size > 100 * 1024 * 1024) {
        showNotification(`${file.name}은 100MB를 초과합니다`, 'error');
        return false;
    }
    
    return true;
}

/**
 * 문서 목록에 추가
 */
function addDocumentToList(filename) {
    const documentList = document.querySelector('.document-list');
    if (!documentList) return;
    
    const documentItem = document.createElement('div');
    documentItem.className = 'document-item';
    
    // 파일 타입별 아이콘
    const icons = {
        pdf: '📄',
        docx: '📝',
        xlsx: '📊',
        csv: '📋',
        txt: '📃'
    };
    
    const extension = filename.split('.').pop().toLowerCase();
    const icon = icons[extension] || '📄';
    
    documentItem.textContent = `${icon} ${filename}`;
    documentList.appendChild(documentItem);
}

/**
 * 인터랙션 설정
 */
function setupInteractions() {
    // 버튼 클릭 효과
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Feature cards hover effect
    document.querySelectorAll('.agent').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * 데모 데이터 로드
 */
function loadDemoData() {
    // 세션 스토리지에서 데이터 로드
    const savedData = sessionStorage.getItem('weraserData');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        console.log('저장된 데이터:', data);
        
        // UI 업데이트
        updateUI(data);
    }
}

/**
 * 데이터 저장
 */
function saveData(data) {
    sessionStorage.setItem('weraserData', JSON.stringify(data));
}

/**
 * UI 업데이트
 */
function updateUI(data) {
    // 사용자 정보 업데이트
    if (data.userName) {
        const userElement = document.querySelector('.nav__item span');
        if (userElement) {
            userElement.textContent = `${data.userName}님`;
        }
    }
    
    // 통계 업데이트
    if (data.stats) {
        updateStats(data.stats);
    }
}

/**
 * 통계 업데이트
 */
function updateStats(stats) {
    if (stats.accuracy) {
        const accuracyElement = document.querySelector('.stat__number');
        if (accuracyElement) {
            accuracyElement.textContent = stats.accuracy;
        }
    }
}

/**
 * 로딩 표시
 */
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = '<div class="loading"></div><div style="margin-top: 20px;">문서를 분석하고 있습니다...</div>';
    document.body.appendChild(loader);
}

/**
 * 로딩 숨기기
 */
function hideLoading() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
        loader.remove();
    }
}

/**
 * 알림 표시
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 애니메이션
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 자동 제거
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * 유틸리티 함수들
 */
const utils = {
    // 디바운스
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 날짜 포맷
    formatDate: function(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('ko-KR', options);
    },
    
    // 숫자 포맷
    formatNumber: function(num) {
        return new Intl.NumberFormat('ko-KR').format(num);
    },
    
    // 파일 크기 포맷
    formatFileSize: function(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
};

// 전역으로 노출
window.weraserApp = {
    init,
    utils,
    showNotification,
    saveData,
    loadDemoData
};