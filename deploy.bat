@echo off
chcp 65001 >nul
title Twilight Blog Deploy

echo ========================================
echo   Twilight Blog - Deploy Script
echo ========================================
echo.

:: Set path
set "PROJECT=E:\Tools\blog\Twilight"
cd /d "%PROJECT%"

:: Step 1: Stage all changes
echo [1/3] Staging changes...
git add -A
echo       Done!
echo.

:: Step 2: Commit with custom message
echo [2/3] Committing...
set /p "COMMIT_MSG=Enter commit message (press Enter for 'update blog'): "
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=update blog"
git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo.
    echo [INFO] Nothing to commit, working tree clean.
    echo.
)
echo.

:: Step 3: Push to remote
echo [3/3] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed! Please check your network or credentials.
    echo.
    pause
    exit /b 1
)
echo.

echo ========================================
echo   Deploy completed!
echo ========================================
echo.
echo   Remote: https://github.com/Zenfish-zy/blog
echo   Site:   https://zenfish-zy.github.io/blog/
echo.
echo   GitHub Actions will build and deploy
echo   your site automatically. Check status:
echo   https://github.com/Zenfish-zy/blog/actions
echo ========================================
echo.
pause
