@echo off
title 예수클래스 깃허브 코드 업로드 도우미
cd /d "%~dp0"
echo ====================================================
echo ⛪ 예수클래스 소스코드를 깃허브 저장소로 업로드합니다...
echo ====================================================

:: 1. 임시 청소용 파일 제거
if exist clean_db.js del clean_db.js
if exist clean_db.cjs del clean_db.cjs
if exist clean_test_data.py del clean_test_data.py
if exist seed_db.cjs del seed_db.cjs
if exist clean.bat del clean.bat

:: 2. 깃 스테이징 및 커밋 생성
git add .
git commit -m "feat: 구글 애드몹 연동 및 배포 릴리즈 준비 완료"

:: 3. 깃허브 푸시
echo.
echo ⛪ 깃허브로 코드를 전송 중입니다. 잠시만 기다려 주세요...
git push -u origin main

echo ====================================================
echo ✨ 깃허브 업로드가 완료되었습니다! 창을 닫아주세요.
echo ====================================================
pause
