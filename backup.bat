@echo off
chcp 65001 >nul
title Twilight Blog Backup

echo ========================================
echo   Twilight Blog - Backup Script
echo ========================================
echo.

:: Set paths
set "SOURCE=E:\Tools\blog\Twilight"
set "BACKUP=E:\Tools\blog\Twilight-backup"

:: Create backup folder if not exists
if not exist "%BACKUP%" (
    echo Creating backup folder...
    mkdir "%BACKUP%"
    mkdir "%BACKUP%\src"
    echo.
)

:: Backup public folder
echo [1/4] Backing up public folder...
if exist "%BACKUP%\public" rmdir /s /q "%BACKUP%\public"
xcopy /E /I /Y /Q "%SOURCE%\public" "%BACKUP%\public" >nul
echo       Done!
echo.

:: Backup src/content folder
echo [2/4] Backing up src/content folder...
if exist "%BACKUP%\src\content" rmdir /s /q "%BACKUP%\src\content"
xcopy /E /I /Y /Q "%SOURCE%\src\content" "%BACKUP%\src\content" >nul
echo       Done!
echo.

:: Backup config file
echo [3/4] Backing up twilight.config.yaml...
copy /Y "%SOURCE%\twilight.config.yaml" "%BACKUP%\twilight.config.yaml" >nul
echo       Done!
echo.

:: Backup astro.config.mjs (contains base path)
echo [4/4] Backing up astro.config.mjs...
copy /Y "%SOURCE%\astro.config.mjs" "%BACKUP%\astro.config.mjs" >nul
echo       Done!
echo.

:: Count files
echo ========================================
echo   Backup completed!
echo ========================================
echo.
echo   Backup location: %BACKUP%
echo.
echo   Contents:
echo     - public/           (static assets)
echo     - src/content/      (posts, diary, etc.)
echo     - twilight.config.yaml
echo     - astro.config.mjs
echo     - CUSTOM_CHANGES.md (manual changes memo)
echo.
echo   Remember: After upgrading Twilight template,
echo   check CUSTOM_CHANGES.md for source code mods!
echo ========================================
echo.
pause
