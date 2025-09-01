/**
 * Weraser Vector Embedding Engine
 * 문서 벡터 인덱싱 및 의미 검색 시스템
 */

class VectorEngine {
    constructor() {
        this.indexedDocuments = new Map();
        this.vectorCache = new Map();
        this.embeddingAPI = {
            openai: 'https://api.openai.com/v1/embeddings',
            cohere: 'https://api.cohere.ai/v1/embed',
            local: '/api/embeddings' // 로컬 임베딩 서버
        };
        this.initialized = false;
    }

    // 초기화
    async initialize() {
        console.log('🚀 Vector Engine 초기화 중...');
        
        try {
            // LocalStorage에서 기존 인덱스 로드
            await this.loadExistingIndex();
            
            // API 연결 테스트
            await this.testEmbeddingAPI();
            
            this.initialized = true;
            console.log('✅ Vector Engine 초기화 완료');
            return { success: true };
        } catch (error) {
            console.error('❌ Vector Engine 초기화 실패:', error);
            return { success: false, error: error.message };
        }
    }

    // 문서 벡터화 및 인덱싱
    async indexDocument(document) {
        if (!this.initialized) {
            throw new Error('Vector Engine이 초기화되지 않음');
        }

        console.log(`📄 문서 인덱싱 시작: ${document.name}`);
        
        try {
            // 1. 문서 텍스트 추출
            const textContent = await this.extractTextFromDocument(document);
            
            // 2. 청킹 (Chunking)
            const chunks = this.chunkText(textContent, 512, 50); // 512 토큰, 50 오버랩
            
            // 3. 각 청크에 대해 임베딩 생성
            const embeddings = await this.generateEmbeddings(chunks);
            
            // 4. 인덱스에 저장
            const documentIndex = {
                id: document.id || `doc_${Date.now()}`,
                name: document.name,
                type: document.type || this.getDocumentType(document.name),
                uploadTime: Date.now(),
                chunks: chunks.map((chunk, index) => ({
                    id: `chunk_${index}`,
                    text: chunk,
                    embedding: embeddings[index],
                    startPos: chunk.startPos,
                    endPos: chunk.endPos
                })),
                metadata: {
                    totalChunks: chunks.length,
                    fileSize: document.size,
                    processingTime: Date.now()
                }
            };
            
            this.indexedDocuments.set(documentIndex.id, documentIndex);
            await this.persistIndex();
            
            console.log(`✅ 문서 인덱싱 완료: ${chunks.length}개 청크, ${embeddings.length}개 벡터`);
            
            return {
                success: true,
                documentId: documentIndex.id,
                chunks: chunks.length,
                vectors: embeddings.length,
                processingTime: (Date.now() - documentIndex.metadata.processingTime) / 1000
            };
        } catch (error) {
            console.error('❌ 문서 인덱싱 실패:', error);
            return { success: false, error: error.message };
        }
    }

    // 의미 검색 (Semantic Search)
    async semanticSearch(query, options = {}) {
        console.log(`🔍 의미 검색 시작: "${query}"`);
        
        const {
            dataScope = 'org',
            topK = 5,
            minSimilarity = 0.7,
            includeMetadata = true
        } = options;
        
        try {
            // 1. 쿼리 임베딩 생성
            const queryEmbedding = await this.generateEmbedding(query);
            
            // 2. 모든 문서 청크와 유사도 계산
            const similarities = [];
            
            for (const [docId, docIndex] of this.indexedDocuments.entries()) {
                for (const chunk of docIndex.chunks) {
                    const similarity = this.cosineSimilarity(queryEmbedding, chunk.embedding);
                    
                    if (similarity >= minSimilarity) {
                        similarities.push({
                            documentId: docId,
                            documentName: docIndex.name,
                            chunkId: chunk.id,
                            text: chunk.text,
                            similarity: similarity,
                            startPos: chunk.startPos,
                            endPos: chunk.endPos,
                            metadata: includeMetadata ? docIndex.metadata : null
                        });
                    }
                }
            }
            
            // 3. 유사도 순으로 정렬 후 상위 K개 반환
            const topResults = similarities
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, topK);
            
            console.log(`✅ 검색 완료: ${topResults.length}개 결과`);
            
            return {
                success: true,
                query: query,
                results: topResults,
                totalMatches: similarities.length,
                executionTime: Date.now()
            };
        } catch (error) {
            console.error('❌ 의미 검색 실패:', error);
            return { success: false, error: error.message };
        }
    }

    // RAG 응답 생성
    async generateRAGResponse(query, searchResults) {
        console.log('🤖 RAG 응답 생성 중...');
        
        try {
            // 검색 결과에서 컨텍스트 구성
            const context = searchResults.map(result => ({
                source: result.documentName,
                content: result.text,
                confidence: result.similarity
            }));
            
            // 시스템 프롬프트 구성
            const systemPrompt = this.buildSystemPrompt(context);
            const userPrompt = `질문: ${query}`;
            
            // Gemini API 호출 (기존 gemini-api.js 활용)
            const response = await this.callLanguageModel(systemPrompt, userPrompt);
            
            return {
                success: true,
                response: response.text,
                sources: context.map(c => c.source),
                confidence: Math.max(...context.map(c => c.confidence)),
                contextChunks: context.length
            };
        } catch (error) {
            console.error('❌ RAG 응답 생성 실패:', error);
            return { success: false, error: error.message };
        }
    }

    // 텍스트 청킹
    chunkText(text, maxTokens = 512, overlapTokens = 50) {
        const sentences = text.split(/[.!?。！？]/);
        const chunks = [];
        let currentChunk = '';
        let currentTokens = 0;
        
        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i].trim();
            const sentenceTokens = this.estimateTokenCount(sentence);
            
            if (currentTokens + sentenceTokens <= maxTokens) {
                currentChunk += sentence + '. ';
                currentTokens += sentenceTokens;
            } else {
                if (currentChunk) {
                    chunks.push({
                        text: currentChunk.trim(),
                        startPos: chunks.length * (maxTokens - overlapTokens),
                        endPos: chunks.length * (maxTokens - overlapTokens) + currentTokens
                    });
                }
                
                // 오버랩 처리
                currentChunk = sentence + '. ';
                currentTokens = sentenceTokens;
            }
        }
        
        if (currentChunk) {
            chunks.push({
                text: currentChunk.trim(),
                startPos: chunks.length * (maxTokens - overlapTokens),
                endPos: chunks.length * (maxTokens - overlapTokens) + currentTokens
            });
        }
        
        return chunks;
    }

    // 임베딩 생성 (배치)
    async generateEmbeddings(chunks) {
        const embeddings = [];
        const batchSize = 10; // API 한도 고려
        
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
            const batchTexts = batch.map(chunk => chunk.text);
            
            try {
                const batchEmbeddings = await this.callEmbeddingAPI(batchTexts);
                embeddings.push(...batchEmbeddings);
                
                // API 레이트 리미트 방지
                if (i + batchSize < chunks.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                console.warn('배치 임베딩 실패, 개별 처리:', error);
                // 개별 처리로 폴백
                for (const text of batchTexts) {
                    try {
                        const embedding = await this.generateEmbedding(text);
                        embeddings.push(embedding);
                    } catch (e) {
                        console.error('개별 임베딩 실패:', e);
                        // 더미 임베딩으로 폴백
                        embeddings.push(this.generateDummyEmbedding());
                    }
                }
            }
        }
        
        return embeddings;
    }

    // 단일 임베딩 생성
    async generateEmbedding(text) {
        // 캐시 확인
        const cacheKey = this.hashText(text);
        if (this.vectorCache.has(cacheKey)) {
            return this.vectorCache.get(cacheKey);
        }
        
        try {
            const embedding = await this.callEmbeddingAPI([text]);
            this.vectorCache.set(cacheKey, embedding[0]);
            return embedding[0];
        } catch (error) {
            console.warn('임베딩 API 실패, 더미 벡터 사용:', error);
            return this.generateDummyEmbedding();
        }
    }

    // 임베딩 API 호출
    async callEmbeddingAPI(texts) {
        // 현재 단계에서는 로컬 더미 임베딩 생성
        // 실제 구현 시 OpenAI, Cohere 등의 API 연동
        return texts.map(() => this.generateDummyEmbedding());
    }

    // 더미 임베딩 생성 (개발/테스트 용도)
    generateDummyEmbedding(dimension = 384) {
        const embedding = [];
        for (let i = 0; i < dimension; i++) {
            embedding.push(Math.random() * 2 - 1); // -1 ~ 1 사이 랜덤값
        }
        // 벡터 정규화
        const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
        return embedding.map(val => val / magnitude);
    }

    // 코사인 유사도 계산
    cosineSimilarity(vecA, vecB) {
        if (vecA.length !== vecB.length) {
            throw new Error('벡터 차원이 일치하지 않음');
        }
        
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    // 문서 텍스트 추출
    async extractTextFromDocument(document) {
        // 현재는 더미 텍스트 반환
        // 실제 구현 시 PDF.js, mammoth.js 등 활용
        const dummyTexts = {
            'pdf': '이것은 PDF 문서의 추출된 텍스트입니다. 매출 분석 보고서를 포함하고 있습니다.',
            'docx': 'Word 문서의 내용입니다. 프로젝트 계획서와 관련 정보가 포함되어 있습니다.',
            'xlsx': 'Excel 문서 데이터입니다. 분기별 매출 현황: Q1 10억, Q2 15억, Q3 20억입니다.'
        };
        
        const fileType = this.getDocumentType(document.name);
        return dummyTexts[fileType] || '문서 내용을 추출할 수 없습니다.';
    }

    // 문서 타입 추출
    getDocumentType(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const typeMap = {
            'pdf': 'pdf',
            'doc': 'docx', 'docx': 'docx',
            'xls': 'xlsx', 'xlsx': 'xlsx'
        };
        return typeMap[extension] || 'unknown';
    }

    // 토큰 수 추정
    estimateTokenCount(text) {
        // 한국어/영어 혼재 텍스트의 대략적 토큰 수 계산
        return Math.ceil(text.length / 4);
    }

    // 텍스트 해시 생성
    hashText(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32비트 정수로 변환
        }
        return hash.toString();
    }

    // 시스템 프롬프트 구성
    buildSystemPrompt(context) {
        const contextStr = context
            .map(c => `[${c.source}] ${c.content}`)
            .join('\n\n');
            
        return `당신은 Weraser AI 지식 관리 시스템의 전문 어시스턴트입니다.
사내 문서에서 검색된 다음 정보를 바탕으로 정확하고 도움이 되는 답변을 제공하세요.

검색된 컨텍스트:
${contextStr}

답변 시 다음 원칙을 따라주세요:
1. 제공된 컨텍스트만을 기반으로 답변하세요
2. 답변에 사용한 문서의 출처를 명시하세요
3. 확실하지 않은 내용은 추정하지 마세요
4. 한국어로 명확하고 전문적으로 답변하세요`;
    }

    // 언어 모델 호출
    async callLanguageModel(systemPrompt, userPrompt) {
        // 기존 Gemini API 활용
        if (window.GeminiAPI && window.GeminiAPI.sendMessage) {
            return await window.GeminiAPI.sendMessage(userPrompt, {
                systemInstruction: systemPrompt
            });
        }
        
        // 폴백: 간단한 응답 생성
        return {
            text: '벡터 검색 결과를 바탕으로 답변을 생성했습니다.',
            usage: { tokens: 100 }
        };
    }

    // 인덱스 영구 저장
    async persistIndex() {
        try {
            const indexData = {};
            for (const [key, value] of this.indexedDocuments.entries()) {
                indexData[key] = value;
            }
            
            localStorage.setItem('weraser_vector_index', JSON.stringify(indexData));
            localStorage.setItem('weraser_vector_cache', JSON.stringify(Object.fromEntries(this.vectorCache)));
        } catch (error) {
            console.warn('인덱스 저장 실패:', error);
        }
    }

    // 기존 인덱스 로드
    async loadExistingIndex() {
        try {
            const indexData = localStorage.getItem('weraser_vector_index');
            const cacheData = localStorage.getItem('weraser_vector_cache');
            
            if (indexData) {
                const parsedIndex = JSON.parse(indexData);
                for (const [key, value] of Object.entries(parsedIndex)) {
                    this.indexedDocuments.set(key, value);
                }
                console.log(`📚 기존 인덱스 로드: ${this.indexedDocuments.size}개 문서`);
            }
            
            if (cacheData) {
                const parsedCache = JSON.parse(cacheData);
                for (const [key, value] of Object.entries(parsedCache)) {
                    this.vectorCache.set(key, value);
                }
                console.log(`💾 벡터 캐시 로드: ${this.vectorCache.size}개 항목`);
            }
        } catch (error) {
            console.warn('기존 인덱스 로드 실패:', error);
        }
    }

    // API 연결 테스트
    async testEmbeddingAPI() {
        try {
            // 현재는 더미 테스트
            console.log('🔗 임베딩 API 연결 테스트 (Mock)');
            return true;
        } catch (error) {
            console.warn('임베딩 API 연결 실패, 로컬 모드로 동작');
            return false;
        }
    }

    // 인덱스 상태 조회
    getIndexStatus() {
        return {
            totalDocuments: this.indexedDocuments.size,
            totalChunks: Array.from(this.indexedDocuments.values())
                .reduce((sum, doc) => sum + doc.chunks.length, 0),
            cacheSize: this.vectorCache.size,
            isInitialized: this.initialized
        };
    }

    // 인덱스 초기화
    async clearIndex() {
        this.indexedDocuments.clear();
        this.vectorCache.clear();
        
        localStorage.removeItem('weraser_vector_index');
        localStorage.removeItem('weraser_vector_cache');
        
        console.log('🗑️ 벡터 인덱스 초기화 완료');
    }
}

// 전역 인스턴스
window.VectorEngine = new VectorEngine();