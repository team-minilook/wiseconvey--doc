# Weraser AI Knowledge Management Platform

> 기업의 지식 유실(Corporate Amnesia) 문제를 해결하는 자율 운영 기업 OS

## 📋 문서 구조 (Single Source of Truth 적용)

### 핵심 문서 2개

| 문서명 | 역할 | 대상 독자 |
|--------|------|-----------|
| **[PRD.md](./PRD.md)** | 제품 요구사항<br>*What & Why* | PM, 기획자, 경영진 |
| **[개발가이드.md](./개발가이드.md)** | 개발 실행 가이드<br>*How & When* | 개발자, 엔지니어, 프로젝트 관리자 |

### 프로토타입
- **[Prototype/](./Prototype/)**: 실제 구현된 MVP 프로토타입
- **배포 URL**: https://team-minilook.github.io/wiseconvey--doc/

## 🎯 빠른 시작 가이드

### 1️⃣ 제품 이해하기
**비즈니스 개요**: [PRD.md](./PRD.md)
- § 1. Product Overview → 비전, 타겟 시장, 경쟁우위
- § 3. User Stories → Epic별 사용자 스토리 및 수용기준  
- § 2. Success Metrics → KPI 및 성공지표

### 2️⃣ 개발하기
**기술 구현**: [개발가이드.md](./개발가이드.md)
- § 1. 기술 아키텍처 → 시스템 구조 및 제약사항
- § 2. Phase 1 MVP 명세 → 상세 기능 명세서
- § 3. 개발 일정 → 주차별 마일스톤

### 3️⃣ 로컬 실행
```bash
cd Prototype/
python -m http.server 8000
# http://localhost:8000 접속
```

### 4️⃣ 배포
```bash  
git add -A
git commit -m "your changes"
git push origin dev
# GitHub Actions가 자동으로 배포 (몇 분 후 반영)
```

## 🔄 현재 진행 상황 (Phase 1 MVP)

### ✅ 완료된 기능 (75%)
- [x] **프로젝트 기반 문서 관리** - 독립적 저장소, 계층적 네비게이션
- [x] **AI 채팅 인터페이스** - Gemini API, 멀티턴 대화
- [x] **소스 한도 관리** - 용량 제한, 실시간 모니터링, 경고 시스템
- [x] **채팅 편의 기능** - 로딩/중지, 메시지 편집, 응답 재생성
- [x] **문서 업로드 시스템** - 조직/개인 분류, 드래그앤드롭
- [x] **자동 배포** - GitHub Actions, dev → gh-pages

### 🔄 진행 중 (25%)
- [ ] **문서 아티팩트 뷰** - 플로팅 패널, 실제 문서 렌더링
- [ ] **벡터 인덱싱** - RAG 파이프라인, 임베딩 생성
- [ ] **조직 문서 동기화** - 자동 감지, 재인덱싱

## 📊 목표 지표

| 지표 | Phase 1 목표 | 현재 상태 |
|------|---------------|-----------|
| 프로토타입 완성도 | 90% | 75% ✅ |
| 응답 시간 | < 3초 | 구현 중 🔄 |
| 문서 처리 정확도 | > 85% | 구현 중 🔄 |

**최종 목표 (Phase 3)**:
- MAU 1,000개 기업
- RAG 정확도 99.4% 
- ARPU $5,000/월

## 🏗️ 아키텍처 요약

```
[사용자] → [Web UI] → [Gemini API/Smart Fallback] → [문서 저장소]
                 ↓
           [GitHub Pages] ← [GitHub Actions] ← [dev branch]
```

**핵심 특징**:
- **Single Source of Truth**: 각 정보는 정확히 한 곳에만 존재
- **닫힌 책 RAG**: 사내 문서만 참조 (환각 현상 원천 차단)
- **CORS 해결**: Smart Fallback → Vercel 프록시 전환 예정

## 🔗 관련 링크

- **이슈 트래킹**: GitHub Issues
- **배포 상태**: [GitHub Actions](../../actions)
- **프로토타입**: https://team-minilook.github.io/wiseconvey--doc/

---

## 🤖 Document Management Philosophy

**"Single Source of Truth"** - 각 정보는 정확히 한 곳에만 존재합니다:

- **비즈니스 정보** (무엇을, 왜) → PRD.md
- **기술/실행 정보** (어떻게, 언제) → 개발가이드.md  
- **참조 관계** → 중복 대신 링크로 연결

이 구조로 문서 관리 오버헤드를 최소화하고 정보 일관성을 보장합니다.

---

*최종 업데이트: 2025년 9월 1일*  
*문서 버전: 2.0 (Single Source of Truth 최적화)*