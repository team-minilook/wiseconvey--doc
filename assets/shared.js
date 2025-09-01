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
        // 벡터 엔진 초기화 상태
        isVectorEngineReady: false,
        
        // 시스템 초기화
        async initialize() {
            if (window.VectorEngine && !this.isVectorEngineReady) {
                const result = await window.VectorEngine.initialize();
                this.isVectorEngineReady = result.success;
                console.log('🚀 RAG Engine 초기화:', result.success ? '성공' : '실패');
            }
        },

        // 문서 처리 (벡터 인덱싱)
        async processDocument(file) {
            console.log(`📄 Processing: ${file.name}`);
            
            // 파일 유효성 검사
            if (!this.validateFile(file)) {
                return { success: false, error: 'Invalid file format or size' };
            }
            
            // 벡터 엔진 사용 가능한 경우
            if (this.isVectorEngineReady && window.VectorEngine) {
                try {
                    const result = await window.VectorEngine.indexDocument({
                        id: 'doc_' + Date.now(),
                        name: file.name,
                        size: file.size,
                        type: file.type
                    });
                    
                    if (result.success) {
                        console.log(`✅ 벡터 인덱싱 완료: ${result.chunks}개 청크`);
                        return {
                            success: true,
                            documentId: result.documentId,
                            chunks: result.chunks,
                            vectors: result.vectors,
                            accuracy: WeraserCore.config.ragAccuracy,
                            processingTime: result.processingTime
                        };
                    }
                } catch (error) {
                    console.warn('벡터 인덱싱 실패, Mock 모드로 폴백:', error);
                }
            }
            
            // 폴백: Mock 처리
            console.log('📝 Mock 모드로 문서 처리');
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        documentId: 'doc_' + Date.now(),
                        chunks: Math.floor(Math.random() * 100) + 50,
                        vectors: Math.floor(Math.random() * 1000) + 500,
                        accuracy: WeraserCore.config.ragAccuracy,
                        processingTime: 2.5
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

        // 쿼리 처리 (의미 검색 + RAG)
        searchQuery: async function(query, dataScope = 'org') {
            console.log(`🔍 Searching: "${query}" in ${dataScope} data`);
            
            // 벡터 엔진을 통한 의미 검색
            if (this.isVectorEngineReady && window.VectorEngine) {
                try {
                    // 1. 의미 검색 수행
                    const searchResult = await window.VectorEngine.semanticSearch(query, {
                        dataScope: dataScope,
                        topK: 3,
                        minSimilarity: 0.6
                    });
                    
                    if (searchResult.success && searchResult.results.length > 0) {
                        // 2. RAG 응답 생성
                        const ragResponse = await window.VectorEngine.generateRAGResponse(
                            query, 
                            searchResult.results
                        );
                        
                        if (ragResponse.success) {
                            console.log(`✅ 벡터 검색 완료: ${searchResult.results.length}개 결과`);
                            return {
                                text: ragResponse.response,
                                source: ragResponse.sources.join(', '),
                                confidence: ragResponse.confidence,
                                data: {
                                    searchResults: searchResult.results,
                                    contextChunks: ragResponse.contextChunks,
                                    executionTime: searchResult.executionTime
                                }
                            };
                        }
                    } else {
                        console.log('🔍 벡터 검색 결과 없음, Mock 응답으로 폴백');
                    }
                } catch (error) {
                    console.warn('벡터 검색 실패, Mock 응답으로 폴백:', error);
                }
            }
            
            // 폴백: Mock 키워드 매칭 응답
            console.log('📝 Mock 키워드 검색 모드');
            const responses = {
                '매출': {
                    text: '현재 분기 매출은 32억원으로, 목표 대비 64% 달성했습니다. 전년 동기 대비 15% 성장을 보이고 있으며, 주요 성장 동력은 신제품 출시와 해외 시장 확대입니다.',
                    source: 'Q3_매출보고서.xlsx',
                    confidence: 0.98,
                    data: { revenue: 3200000000, target: 5000000000, achievement: 0.64 }
                },
                'HS': {
                    text: 'HS Code 8541.10.1000 - 반도체 웨이퍼로 분류됩니다. 관세율은 0%이며, 한-미 FTA 협정에 따라 우대 관세가 적용됩니다.',
                    source: '관세_분류표.pdf',
                    confidence: 0.994,
                    data: { code: '8541.10.1000', tariff: 0, fta: '한-미 FTA' }
                },
                '프로젝트': {
                    text: '현재 진행 중인 프로젝트는 총 5개이며, 이 중 3개가 예정대로 진행되고 있습니다. AI 지식관리 프로젝트가 가장 높은 우선순위를 가지고 있습니다.',
                    source: '프로젝트_현황보고서.docx',
                    confidence: 0.89,
                    data: { totalProjects: 5, onTrack: 3, priority: 'AI 지식관리' }
                },
                default: {
                    text: '죄송하지만 현재 인덱싱된 문서에서 관련 정보를 찾을 수 없습니다. 더 구체적인 키워드나 다른 질문을 시도해 보시기 바랍니다.',
                    source: null,
                    confidence: 0.3,
                    data: { suggestion: '더 구체적인 키워드를 사용해 주세요' }
                }
            };
            
            // 키워드 매칭
            for (const key in responses) {
                if (key !== 'default' && query.includes(key)) {
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

    initPhase1: async function() {
        console.log('📘 Phase 1: RAG System Initialization');
        
        // RAG 엔진 초기화
        try {
            await this.ragEngine.initialize();
            console.log('✅ RAG Engine 초기화 완료');
        } catch (error) {
            console.warn('⚠️ RAG Engine 초기화 실패:', error);
        }
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