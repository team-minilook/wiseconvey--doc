#!/bin/bash

echo "🚀 Weraser Prototype 배포 스크립트"
echo "=================================="
echo ""
echo "이 스크립트는 Vercel 로그인 후 프로젝트를 배포합니다."
echo ""
echo "📌 로그인 옵션:"
echo "1. vercel login 실행 후 이메일 인증"
echo "2. vercel.com에서 토큰 생성 후 사용"
echo ""
echo "로그인 방법을 선택하세요:"
echo "1) 이메일 로그인"
echo "2) 토큰 사용"
echo "3) 나중에 하기"
read -p "선택 (1/2/3): " choice

case $choice in
  1)
    echo "이메일 로그인을 시작합니다..."
    vercel login
    echo "로그인 완료 후 Enter를 누르세요..."
    read
    echo "프로젝트 배포를 시작합니다..."
    vercel --name weraser-prototype
    ;;
  2)
    echo "Vercel 토큰을 입력하세요:"
    read -s token
    echo "프로젝트 배포를 시작합니다..."
    vercel --token $token --name weraser-prototype
    ;;
  3)
    echo "나중에 다음 명령어로 배포하세요:"
    echo "  vercel login"
    echo "  vercel --name weraser-prototype"
    exit 0
    ;;
  *)
    echo "잘못된 선택입니다."
    exit 1
    ;;
esac

echo ""
echo "✅ 배포가 완료되면 다음 URL에서 확인할 수 있습니다:"
echo "   https://weraser-prototype.vercel.app"
echo ""
echo "프로덕션 배포는: vercel --prod"