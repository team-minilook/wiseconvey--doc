# Weraser AI Knowledge Management Platform

> 기업의 지식 유실(Corporate Amnesia) 문제를 해결하는 자율 운영 기업 OS

## 📋 문서 구조

### 핵심 문서 (MECE 원칙 적용)

| 문서명 | 역할 | 대상 독자 |
|--------|------|-----------|
| **[PRD.md](./PRD.md)** | 제품 요구사항 문서 | PM, 기획자, 경영진 |
| **[기능요구사항.md](./기능요구사항.md)** | 기술적 상세 명세서 | 개발자, 엔지니어 |
| **[PLAN.md](./PLAN.md)** | 실행 계획 및 마일스톤 | 전체 팀, 프로젝트 관리자 |

### 프로토타입
- **[Prototype/](./Prototype/)**: 실제 구현된 MVP 프로토타입
- **배포 URL**: https://team-minilook.github.io/wiseconvey--doc/

## 🎯 빠른 시작

### 제품 이해
1. **비즈니스 개요**: [PRD.md](./PRD.md) → Product Overview, User Stories
2. **기술 구조**: [기능요구사항.md](./기능요구사항.md) → 기술적 개요, Phase 1 명세
3. **실행 계획**: [PLAN.md](./PLAN.md) → Phase 1 상세 일정

### 개발 시작
1. `Prototype/index.html` 실행
2. 로컬 서버: `python -m http.server 8000`
3. GitHub Actions 자동 배포: `git push origin dev`

## 🔄 Phase 1 MVP 현황

### ✅ 완료된 기능
- [x] 프로젝트 기반 문서 관리 시스템
- [x] AI 채팅 인터페이스 (Gemini API)
- [x] 소스 한도 관리 시스템 (용량 제한, 경고)
- [x] 채팅 편의 기능 (로딩, 중지, 메시지 편집)
- [x] 문서 업로드 UI/UX 개선

### 🔄 진행 중
- [ ] 문서 아티팩트 뷰 (플로팅 패널)
- [ ] 벡터 인덱싱 및 RAG 파이프라인
- [ ] 조직 문서 동기화 시스템

## 📊 성공 지표

**Phase 1 목표**:
- 프로토타입 완성도 90%
- 응답 시간 3초 이내  
- 문서 처리 정확도 85%

**최종 목표**:
- MAU 1,000개 기업
- RAG 정확도 99.4%
- ARPU $5,000/월

---

*최종 업데이트: 2025년 9월 1일*  
*문서 버전: 2.0 (MECE 구조 적용)*