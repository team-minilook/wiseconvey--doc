# Weraser Prototype - Gemini API Integration

## 🚀 빠른 시작

### 1. Gemini API 키 발급
1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. "Create API Key" 클릭
3. API 키 복사

### 2. API 키 설정 (3가지 방법)

#### 방법 1: 브라우저에서 직접 입력 (가장 간단)
- 웹사이트 접속 시 자동으로 API 키 입력 모달 표시
- API 키 입력 후 "저장" 클릭
- 브라우저 로컬 스토리지에 안전하게 저장

#### 방법 2: JavaScript 파일로 설정
```javascript
// gemini-config.js 파일 생성 (절대 Git에 커밋하지 마세요!)
const GEMINI_API_KEY = 'your_api_key_here';
```

#### 방법 3: 환경 변수 사용 (프로덕션 권장)
```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집
GEMINI_API_KEY=your_api_key_here
```

## 🔐 보안 주의사항

⚠️ **절대 API 키를 GitHub에 커밋하지 마세요!**

- `.gitignore`에 API 키 파일 추가됨
- 프로덕션 환경에서는 서버 사이드 프록시 사용 권장
- CORS 정책으로 인해 로컬 테스트 시 문제 발생 가능

## 💬 사용 방법

1. 프로젝트 생성 또는 선택
2. 문서 업로드 (PDF, DOCX, XLSX 등)
3. 채팅 시작
4. 자연어로 질문 입력
5. Gemini AI가 문서 기반으로 답변 생성

## 🛠️ 주요 기능

### 구현된 기능
- ✅ Gemini Pro 모델 통합
- ✅ 문서 컨텍스트 기반 질의응답
- ✅ 출처 표시 기능
- ✅ 실시간 응답 생성
- ✅ 에러 핸들링

### 추가 가능한 기능
- 스트리밍 응답 (실시간 타이핑 효과)
- 문서 요약 기능
- 다중 문서 교차 검색
- 대화 히스토리 관리
- 프롬프트 템플릿

## 📁 파일 구조

```
Prototype/
├── index.html          # 메인 애플리케이션
├── info.html          # 랜딩 페이지
├── gemini-api.js      # Gemini API 통합 코드
├── gemini-api.css     # API 관련 스타일
├── .env.example       # 환경변수 예시
└── README.md          # 이 파일
```

## 🌐 배포

### GitHub Pages
```bash
git add .
git commit -m "Add Gemini API integration"
git push origin prototype
```

### 로컬 테스트
```bash
# 간단한 HTTP 서버 실행
npx http-server . -p 3000 -o

# 또는 Python 사용
python -m http.server 3000
```

## 🔍 트러블슈팅

### CORS 에러
- 로컬 파일로 직접 열면 CORS 에러 발생
- HTTP 서버를 통해 실행 필요

### API 키 인증 실패
- API 키 유효성 확인
- [Google Cloud Console](https://console.cloud.google.com)에서 API 활성화 확인

### 응답 속도 느림
- Gemini Pro는 무료 tier에서 분당 60 요청 제한
- 캐싱 구현으로 성능 개선 가능

## 📚 참고 자료

- [Gemini API 공식 문서](https://ai.google.dev/docs)
- [API 키 관리 가이드](https://cloud.google.com/docs/authentication/api-keys)
- [Weraser 프로젝트 계획서](../PROJECT_PLAN.md)

## 📞 지원

문제가 있으시면 이슈를 생성해주세요:
https://github.com/team-minilook/wiseconvey--doc/issues