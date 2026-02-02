@echo off
title Twilight Blog Deploy

echo ========================================
echo   Fish Blog - Twilight Deploy Script
echo ========================================
echo.

:: Check if git is initialized
if not exist ".git" (
    echo [1/5] Initializing Git repository...
    git init
    git branch -M main
    echo.
) else (
    echo [1/5] Git repository exists, skipping...
    echo.
)

:: Check if remote is configured
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [2/5] Adding remote repository...
    echo.
    echo ==========================================
    echo  Please create a "blog" repo on GitHub first!
    echo  1. Open https://github.com/new
    echo  2. Repository name: blog
    echo  3. Select Public
    echo  4. Do NOT check any initialize options
    echo  5. Click Create repository
    echo ==========================================
    echo.
    pause
    git remote add origin https://github.com/Zenfish-zy/blog.git
    echo.
) else (
    echo [2/5] Remote configured, skipping...
    echo.
)

:: Add all files
echo [3/5] Adding files to staging area...
git add .
echo.

:: Commit
echo [4/5] Committing changes...
set /p commit_msg="Enter commit message (press Enter for default): "
if "%commit_msg%"=="" set commit_msg=update blog
git commit -m "%commit_msg%"
echo.

:: Push
echo [5/5] Pushing to GitHub...
git push -u origin main
echo.

if errorlevel 1 (
    echo ========================================
    echo  Push failed! Possible reasons:
    echo    1. GitHub repo not created yet
    echo    2. Git credentials not configured
    echo.
    echo  First time? Run:
    echo    git config --global user.name "your-name"
    echo    git config --global user.email "your-email"
    echo ========================================
) else (
    echo ========================================
    echo  Push successful!
    echo.
    echo  Next steps:
    echo    1. Open https://github.com/Zenfish-zy/blog
    echo    2. Go to Settings - Pages
    echo    3. Source: select "GitHub Actions"
    echo    4. Wait a few minutes, then visit:
    echo       https://zenfish-zy.github.io/blog/
    echo ========================================
)

echo.
pause
