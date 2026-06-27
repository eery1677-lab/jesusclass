@echo off
echo ===================================================
echo  Starting GitHub Sync (Safe Mode)...
echo ===================================================
echo.

echo [1/3] Setting remote repository URL...
git remote set-url origin https://github.com/eery1677-lab/jesusclass.git 2>nul
if %errorlevel% neq 0 (
    git remote add origin https://github.com/eery1677-lab/jesusclass.git
)

echo.
echo [2/3] Saving your local changes temporarily (Stash)...
git stash

echo.
echo [3/3] Fetching and pulling latest changes...
git pull origin main

if %errorlevel% neq 0 (
    echo [Info] main branch failed. Trying master branch...
    git pull origin master
)

echo.
echo [Info] Restoring your saved local changes...
git stash pop

echo.
echo ===================================================
echo  Sync completed!
echo ===================================================
pause
