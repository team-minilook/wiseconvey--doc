/**
 * Weraser Phase Configuration
 * Phase별 기능 설정 및 활성화 관리
 */

const WeraserConfig = {
    // ============================================
    // Phase 1 Configuration (현재 개발 중)
    // ============================================
    phase1: {
        name: 'RAG System - 조직원 일상 업무 침투',
        version: '1.0.0',
        features: {
            // 핵심 기능
            rag: true,                    // RAG 시스템
            chat: true,                   // 채팅 인터페이스
            documentProcessing: true,     // 문서 처리
            excelParsing: true,          // Excel 비정형 데이터
            chartGeneration: true,        // 차트/표 생성
            
            // 데이터 관리
            orgData: true,               // 조직 데이터
            personalData: true,          // 개인 데이터
            dualRAG: true,               // 이원화 RAG 체계
            
            // 신뢰성
            closedBook: true,            // 닫힌 책 모드
            truthReconciliation: true,   // 진실 교차검증
            sourceReference: true,       // 출처 명시
            
            // Phase 2+ (비활성)
            agents: false,               // AI 에이전트
            artifacts: false,            // 아티팩트 시스템
            automation: false,           // 자동화
            multiAgent: false            // 멀티 에이전트
        },
        
        agents: {
            general: { enabled: true, name: '일반 AI 비서' }
            // 다른 에이전트는 Phase 2에서 활성화
        },
        
        ui: {
            mode: 'basic',
            showPhaseIndicator: true,
            showUpcomingFeatures: true,
            theme: 'professional'
        },
        
        limits: {
            maxFileSize: 100 * 1024 * 1024,  // 100MB
            maxDocuments: 1000,
            maxQueriesPerDay: 10000,
            ragAccuracy: 0.90                 // 90% (목표)
        },
        
        metrics: {
            targetAccuracy: 0.90,
            targetResponseTime: 3,             // 3초
            targetDailyUsers: 100,
            targetSessionTime: 10              // 10분
        }
    },

    // ============================================
    // Phase 2 Configuration (개발 예정)
    // ============================================
    phase2: {
        name: 'AI Agent System - 실제 업무 처리',
        version: '2.0.0',
        features: {
            // Phase 1 기능 모두 포함
            rag: true,
            chat: true,
            documentProcessing: true,
            excelParsing: true,
            chartGeneration: true,
            orgData: true,
            personalData: true,
            dualRAG: true,
            closedBook: true,
            truthReconciliation: true,
            sourceReference: true,
            
            // Phase 2 신규
            agents: true,                // AI 에이전트 활성화
            multiAgent: true,            // 멀티 에이전트 협업
            taskAutomation: true,        // 작업 자동화
            realTimeProcessing: true,    // 실시간 처리
            
            // Phase 3+ (비활성)
            artifacts: false,
            fullAutomation: false
        },
        
        agents: {
            general: { enabled: true, name: '일반 AI 비서' },
            customs: { enabled: true, name: 'AI 관세 전문가', accuracy: 0.994 },
            logistics: { enabled: true, name: 'AI 물류 전문가' },
            legal: { enabled: false, name: 'AI 법무 전문가' },
            accounting: { enabled: false, name: 'AI 회계 전문가' },
            patent: { enabled: false, name: 'AI 특허 전문가' }
        }
    },

    // ============================================
    // Phase 3 Configuration (개발 예정)
    // ============================================
    phase3: {
        name: 'Artifact System - 조직 차원 업무 연결',
        version: '3.0.0',
        features: {
            // Phase 1-2 기능 모두 포함
            // ...기존 기능들
            
            // Phase 3 신규
            artifacts: true,             // 아티팩트 시스템
            floatingWindows: true,       // 플로팅 윈도우
            teamSharing: true,          // 팀 공유
            reportGeneration: true,      // 보고서 생성
            exportOptions: true          // 다양한 내보내기
        }
    },

    // ============================================
    // Phase 4 Configuration (최종 목표)
    // ============================================
    phase4: {
        name: '자율 운영 기업 OS',
        version: '4.0.0',
        features: {
            // 모든 기능 활성화
            rag: true,
            chat: true,
            documentProcessing: true,
            excelParsing: true,
            chartGeneration: true,
            orgData: true,
            personalData: true,
            dualRAG: true,
            closedBook: true,
            truthReconciliation: true,
            sourceReference: true,
            agents: true,
            multiAgent: true,
            taskAutomation: true,
            realTimeProcessing: true,
            artifacts: true,
            floatingWindows: true,
            teamSharing: true,
            reportGeneration: true,
            exportOptions: true,
            
            // Phase 4 독점
            fullAutomation: true,        // 완전 자동화
            aiFirst: true,               // AI-First 철학
            knowledgeCirculation: true,  // 지식 순환 체계
            predictiveAnalysis: true,    // 예측 분석
            selfLearning: true,          // 자가 학습
            crossDepartment: true        // 부서간 통합
        },
        
        agents: {
            general: { enabled: true, name: '일반 AI 비서' },
            customs: { enabled: true, name: 'AI 관세 전문가', accuracy: 0.994 },
            logistics: { enabled: true, name: 'AI 물류 전문가' },
            legal: { enabled: true, name: 'AI 법무 전문가' },
            accounting: { enabled: true, name: 'AI 회계 전문가' },
            patent: { enabled: true, name: 'AI 특허 전문가' },
            hr: { enabled: true, name: 'AI HR 전문가' },
            sales: { enabled: true, name: 'AI 영업 전문가' },
            marketing: { enabled: true, name: 'AI 마케팅 전문가' }
        },
        
        ui: {
            mode: 'advanced',
            showPhaseIndicator: false,
            showUpcomingFeatures: false,
            theme: 'enterprise'
        },
        
        limits: {
            maxFileSize: 1024 * 1024 * 1024,  // 1GB
            maxDocuments: 'unlimited',
            maxQueriesPerDay: 'unlimited',
            ragAccuracy: 0.994                 // 99.4%
        },
        
        metrics: {
            targetAccuracy: 0.994,
            targetResponseTime: 1,              // 1초
            targetDailyUsers: 10000,
            targetSessionTime: 60,              // 60분
            targetROI: 15                      // 15% 비용 절감
        }
    },

    // ============================================
    // Helper Functions
    // ============================================
    
    // 현재 Phase 설정 가져오기
    getCurrentPhase: function() {
        // URL 파라미터나 로컬 스토리지에서 phase 확인
        const urlParams = new URLSearchParams(window.location.search);
        const phase = urlParams.get('phase') || 
                     localStorage.getItem('weraserPhase') || 
                     'phase1';
        return this[phase] || this.phase1;
    },

    // 기능 활성화 여부 확인
    isFeatureEnabled: function(feature, phase = null) {
        const config = phase ? this[phase] : this.getCurrentPhase();
        return config.features[feature] === true;
    },

    // 에이전트 활성화 여부 확인
    isAgentEnabled: function(agentType, phase = null) {
        const config = phase ? this[phase] : this.getCurrentPhase();
        return config.agents && 
               config.agents[agentType] && 
               config.agents[agentType].enabled;
    },

    // Phase 업그레이드 가능 여부
    canUpgradeToPhase: function(targetPhase) {
        const current = this.getCurrentPhase();
        const target = this[targetPhase];
        
        if (!target) return false;
        
        // 메트릭 기준 충족 여부 확인
        // 실제로는 서버에서 확인
        return true;
    },

    // UI 구성 가져오기
    getUIConfig: function(phase = null) {
        const config = phase ? this[phase] : this.getCurrentPhase();
        return config.ui || { mode: 'basic' };
    },

    // 제한사항 가져오기
    getLimits: function(phase = null) {
        const config = phase ? this[phase] : this.getCurrentPhase();
        return config.limits;
    },

    // 메트릭 목표 가져오기
    getMetrics: function(phase = null) {
        const config = phase ? this[phase] : this.getCurrentPhase();
        return config.metrics;
    }
};

// 전역 노출
window.WeraserConfig = WeraserConfig;