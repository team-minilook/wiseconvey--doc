# 🔐 보안 가이드

## ⚠️ 중요: API 키 보안

### 절대 하지 말아야 할 것들
❌ API 키를 코드에 직접 하드코딩  
❌ API 키를 Git에 커밋  
❌ API 키를 공개 저장소에 업로드  
❌ API 키를 클라이언트 사이드 코드에 노출  

### 반드시 해야 할 것들
✅ API 키를 환경 변수로 관리  
✅ .gitignore에 설정 파일 추가  
✅ 프로덕션에서는 서버 사이드 프록시 사용  
✅ API 키 정기적으로 교체  

## 🛡️ 안전한 API 키 관리 방법

### 1. 로컬 개발 환경
```javascript
// 1. config.js 파일 생성 (Git에 추가하지 않음)
const GEMINI_API_KEY = 'your_api_key_here';

// 2. .gitignore에 추가
echo "config.js" >> .gitignore
```

### 2. 브라우저 로컬 스토리지 사용
- 웹사이트 첫 방문 시 API 키 입력 모달 표시
- localStorage에 암호화하여 저장
- 다른 사용자와 공유되지 않음

### 3. 프로덕션 환경 (권장)
```javascript
// 서버 사이드 프록시 구현
// backend/api/gemini.js
app.post('/api/gemini', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY; // 서버 환경 변수
    // Gemini API 호출
});
```

## 🔍 API 키 노출 확인 방법

### Git 히스토리 검사
```bash
# API 키가 커밋된 적이 있는지 확인
git grep -i "AIzaSy" $(git rev-list --all)

# 발견되면 즉시 제거
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all
```

### 노출된 API 키 무효화
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. APIs & Services → Credentials
3. 노출된 키 삭제
4. 새 키 생성

## 🚨 보안 사고 대응

### API 키가 노출된 경우
1. **즉시 키 무효화**: Google Cloud Console에서 키 삭제
2. **새 키 생성**: 새로운 API 키 발급
3. **코드 정리**: 노출된 키를 코드에서 완전히 제거
4. **Git 정리**: 히스토리에서 키 제거
5. **모니터링**: 비정상 사용 패턴 확인

## 📋 보안 체크리스트

- [ ] API 키가 코드에 하드코딩되지 않았는가?
- [ ] .gitignore에 설정 파일이 추가되었는가?
- [ ] Git 히스토리에 API 키가 없는가?
- [ ] 프로덕션 환경에서 서버 프록시를 사용하는가?
- [ ] API 키 권한이 최소한으로 설정되었는가?
- [ ] CORS 정책이 올바르게 설정되었는가?

## 🔗 참고 자료
- [Google API 키 보안 가이드](https://cloud.google.com/docs/authentication/api-keys)
- [Git 히스토리에서 민감 정보 제거](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP API Security](https://owasp.org/www-project-api-security/)