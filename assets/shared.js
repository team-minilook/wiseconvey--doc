/**
 * Weraser Shared JavaScript Components
 * 공통 로직 - 모든 Phase에서 재사용
 */

// ============================================
// Core Weraser Engine
// ============================================
const WeraserCore = {
    // Configuration
    config: {
        apiEndpoint: '/api/v1',
        maxFileSize: 100 * 1024 * 1024, // 100MB
        supportedFormats: ['pdf', 'docx', 'xlsx', 'csv', 'txt', 'pptx'],
        ragAccuracy: 0.994, // 99.4%
        processingTime: 60 // seconds
    },

    // ============================================
    // RAG Engine (Phase 1 핵심)
    // ============================================
    ragEngine: {
        // 문서 처리
        processDocument: async function(file) {
            console.log(`📄 Processing: ${file.name}`);
            
            // 파일 유효성 검사
            if (!this.validateFile(file)) {
                return { success: false, error: 'Invalid file format or size' };
            }
            
            // 시뮬레이션: 실제로는 서버 API 호출
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        documentId: 'doc_' + Date.now(),
                        chunks: Math.floor(Math.random() * 100) + 50,
                        vectors: Math.floor(Math.random() * 1000) + 500,
                        accuracy: WeraserCore.config.ragAccuracy
                    });
                }, 2000);
            });
        },

        // 파일 유효성 검사
        validateFile: function(file) {
            const extension = file.name.split('.').pop().toLowerCase();
            const validFormat = WeraserCore.config.supportedFormats.includes(extension);
            const validSize = file.size <= WeraserCore.config.maxFileSize;
            
            if (!validFormat) {
                WeraserCore.ui.showNotification(`지원하지 않는 형식: ${extension}`, 'error');
                return false;
            }
            
            if (!validSize) {
                WeraserCore.ui.showNotification('파일 크기가 100MB를 초과합니다', 'error');
                return false;
            }
            
            return true;
        },

        // 쿼리 처리
        searchQuery: async function(query, dataScope = 'org') {
            console.log(`🔍 Searching: ${query} in ${dataScope} data`);
            
            // 시뮬레이션 응답
            const responses = {
                '매출': {
                    text: '현재 분기 매출은 32억원으로, 목표 대비 64% 달성했습니다.',
                    source: 'Q3_매출보고서.xlsx',
                    confidence: 0.98,
                    data: { revenue: 3200000000, target: 5000000000, achievement: 0.64 }
                },
                'HS': {
                    text: 'HS Code 8541.10.1000 - 반도체 웨이퍼',
                    source: '관세_분류표.pdf',
                    confidence: 0.994,
                    data: { code: '8541.10.1000', tariff: 0, fta: '한-미 FTA' }
                },
                default: {
                    text: '관련 문서를 분석 중입니다. 더 구체적인 질문을 주시면 정확한 답변을 드릴 수 있습니다.',
                    source: null,
                    confidence: 0.7,
                    data: null
                }
            };
            
            // 키워드 매칭
            for (const key in responses) {
                if (query.includes(key)) {
                    return responses[key];
                }
            }
            
            return responses.default;
        },

        // Excel 데이터 파싱 (비정형 지원)
        parseExcelData: function(data) {
            console.log('📊 Parsing Excel with non-structured grid support');
            // 피벗 테이블, 병합 셀, 비정형 그리드 처리 로직
            return {
                sheets: 5,
                totalCells: 12450,
                pivotTables: 2,
                mergedCells: 145,
                parsed: true
            };
        }
    },

    // ============================================
    // Agent System (Phase 2 핵심)
    // ============================================
    agentSystem: {
        // 활성 에이전트
        activeAgents: {
            general: { name: '일반 AI 비서', icon: '🤖', available: true },
            customs: { name: 'AI 관세 전문가', icon: '🛃', available: true },
            logistics: { name: 'AI 물류 전문가', icon: '📦', available: true },
            legal: { name: 'AI 법무 전문가', icon: '⚖️', available: false },
            accounting: { name: 'AI 회계 전문가', icon: '💰', available: false },
            patent: { name: 'AI 특허 전문가', icon: '💡', available: false }
        },

        // 에이전트 실행
        executeAgent: async function(agentType, task, data) {
            console.log(`🤖 Executing ${agentType} agent for task: ${task}`);
            
            // HS Code 분류 시뮬레이션
            if (agentType === 'customs' && task === 'hs-classification') {
                return await this.performHSClassification(data);
            }
            
            // 다른 에이전트 태스크들...
            return { success: false, message: 'Task not implemented' };
        },

        // HS Code 분류 작업
        performHSClassification: async function(products) {
            const results = [];
            const startTime = Date.now();
            
            // 제품별 분류 시뮬레이션
            for (let i = 0; i < Math.min(products.length, 10); i++) {
                results.push({
                    product: products[i] || `제품 ${i + 1}`,
                    hsCode: this.generateHSCode(),
                    tariff: Math.random() > 0.7 ? 0 : Math.floor(Math.random() * 8),
                    fta: this.selectFTA(),
                    saving: Math.floor(Math.random() * 1000000)
                });
            }
            
            const processingTime = (Date.now() - startTime) / 1000;
            
            return {
                success: true,
                results: results,
                totalProducts: products.length,
                accuracy: 0.994,
                processingTime: processingTime,
                totalSaving: results.reduce((sum, r) => sum + r.saving, 0)
            };
        },

        // HS Code 생성 (시뮬레이션)
        generateHSCode: function() {
            const codes = ['8541.10.1000', '9017.20.1000', '6805.30.0000', '2811.21.0000'];
            return codes[Math.floor(Math.random() * codes.length)];
        },

        // FTA 선택 (시뮬레이션)
        selectFTA: function() {
            const ftas = ['한-미 FTA', '한-EU FTA', '한-중 FTA', '미적용'];
            return ftas[Math.floor(Math.random() * ftas.length)];
        }
    },

    // ============================================
    // UI Components
    // ============================================
    ui: {
        // 알림 표시
        showNotification: function(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        },

        // 로딩 표시
        showLoading: function(message = '처리 중...') {
            const loader = document.createElement('div');
            loader.id = 'globalLoader';
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.95);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            `;
            loader.innerHTML = `
                <div class="loading"></div>
                <div style="margin-top: 20px; font-size: 1.125rem;">${message}</div>
            `;
            document.body.appendChild(loader);
        },

        // 로딩 숨기기
        hideLoading: function() {
            const loader = document.getElementById('globalLoader');
            if (loader) loader.remove();
        },

        // 채팅 메시지 추가
        addChatMessage: function(text, sender = 'ai', reference = null) {
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) return;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message message--${sender}`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message__content';
            contentDiv.innerHTML = text;
            
            if (reference) {
                const refDiv = document.createElement('div');
                refDiv.className = 'message__reference';
                refDiv.innerHTML = `📎 출처: ${reference}`;
                contentDiv.appendChild(refDiv);
            }
            
            messageDiv.appendChild(contentDiv);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        },

        // 차트 그리기 (간단한 바 차트)
        drawChart: function(canvasId, data, labels) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            const barWidth = width / data.length * 0.7;
            const gap = width / data.length * 0.3;
            const max = Math.max(...data);
            
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#0066FF';
            
            data.forEach((value, index) => {
                const barHeight = (value / max) * (height - 40);
                const x = index * (barWidth + gap) + gap/2;
                const y = height - barHeight - 20;
                
                ctx.fillRect(x, y, barWidth, barHeight);
                
                // 레이블
                if (labels && labels[index]) {
                    ctx.fillStyle = '#6B7280';
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(labels[index], x + barWidth/2, height - 5);
                    ctx.fillStyle = '#0066FF';
                }
            });
        },

        // 테이블 생성
        createTable: function(headers, data) {
            let html = '<table class="data-table"><thead><tr>';
            headers.forEach(h => html += `<th>${h}</th>`);
            html += '</tr></thead><tbody>';
            
            data.forEach(row => {
                html += '<tr>';
                row.forEach(cell => html += `<td>${cell}</td>`);
                html += '</tr>';
            });
            
            html += '</tbody></table>';
            return html;
        }
    },

    // ============================================
    // Utilities
    // ============================================
    utils: {
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
        },

        // 통화 포맷
        formatCurrency: function(amount) {
            return '₩' + new Intl.NumberFormat('ko-KR').format(amount);
        }
    },

    // ============================================
    // Initialization
    // ============================================
    init: function(phase = 'phase1') {
        console.log(`🚀 Initializing Weraser Core for ${phase}`);
        
        // Phase별 초기화
        switch(phase) {
            case 'phase1':
                this.initPhase1();
                break;
            case 'phase4':
                this.initPhase4();
                break;
            default:
                console.log('Default initialization');
        }
        
        // 공통 이벤트 리스너
        this.setupCommonListeners();
    },

    initPhase1: function() {
        console.log('📘 Phase 1: RAG System Initialization');
        // Phase 1 특화 초기화
    },

    initPhase4: function() {
        console.log('📗 Phase 4: Full Platform Initialization');
        // Phase 4 특화 초기화 (모든 기능 활성화)
    },

    setupCommonListeners: function() {
        // 파일 업로드 처리
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files.length > 0) {
                    this.handleFileUpload(files);
                }
            });
        });

        // 드래그 앤 드롭
        const uploadAreas = document.querySelectorAll('.upload-area');
        uploadAreas.forEach(area => {
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.style.borderColor = 'var(--weraser-primary)';
            });
            
            area.addEventListener('dragleave', (e) => {
                e.preventDefault();
                area.style.borderColor = 'rgba(0, 102, 255, 0.3)';
            });
            
            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.style.borderColor = 'rgba(0, 102, 255, 0.3)';
                const files = e.dataTransfer.files;
                this.handleFileUpload(files);
            });
        });
    },

    handleFileUpload: async function(files) {
        this.ui.showLoading('문서를 처리하고 있습니다...');
        
        for (const file of files) {
            const result = await this.ragEngine.processDocument(file);
            if (result.success) {
                this.ui.showNotification(`${file.name} 처리 완료`, 'success');
            }
        }
        
        this.ui.hideLoading();
    }
};

// 전역 노출
window.WeraserCore = WeraserCore;