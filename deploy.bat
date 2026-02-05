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

:: Step 1: Build
echo [1/4] Building project...
call pnpm build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed! Please fix the errors above.
    echo.
    pause
    exit /b 1
)
echo       Build succeeded!
echo.

:: Step 2: Stage all changes
echo [2/4] Staging changes...
git add -A
echo       Done!
echo.

:: Step 3: Commit with custom message
echo [3/4] Committing...
set /p "COMMIT_MSG=Enter commit message (press Enter for 'update blog'): "
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=update blog"
git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo.
    echo [INFO] Nothing to commit, working tree clean.
    echo.
)
echo.

:: Step 4: Push to remote
echo [4/4] Pushing to GitHub...
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
echo   Please wait a few minutes for GitHub
echo   Pages to rebuild your site.
echo ========================================
echo.
pause
