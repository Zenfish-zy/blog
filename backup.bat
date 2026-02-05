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
echo [1/6] Backing up public folder...
if exist "%BACKUP%\public" rmdir /s /q "%BACKUP%\public"
xcopy /E /I /Y /Q "%SOURCE%\public" "%BACKUP%\public" >nul
echo       Done!
echo.

:: Backup src/content folder
echo [2/6] Backing up src/content folder...
if exist "%BACKUP%\src\content" rmdir /s /q "%BACKUP%\src\content"
xcopy /E /I /Y /Q "%SOURCE%\src\content" "%BACKUP%\src\content" >nul
echo       Done!
echo.

:: Backup config file
echo [3/6] Backing up twilight.config.yaml...
copy /Y "%SOURCE%\twilight.config.yaml" "%BACKUP%\twilight.config.yaml" >nul
echo       Done!
echo.

:: Backup astro.config.mjs (contains base path)
echo [4/6] Backing up astro.config.mjs...
copy /Y "%SOURCE%\astro.config.mjs" "%BACKUP%\astro.config.mjs" >nul
echo       Done!
echo.

:: Backup CUSTOM_CHANGES.md
echo [5/6] Backing up CUSTOM_CHANGES.md...
if exist "%SOURCE%\CUSTOM_CHANGES.md" (
    copy /Y "%SOURCE%\CUSTOM_CHANGES.md" "%BACKUP%\CUSTOM_CHANGES.md" >nul
    echo       Done!
) else (
    echo       [SKIP] File not found.
)
echo.

:: Backup scripts (deploy.bat and backup.bat)
echo [6/7] Backing up scripts...
copy /Y "%SOURCE%\deploy.bat" "%BACKUP%\deploy.bat" >nul
copy /Y "%SOURCE%\backup.bat" "%BACKUP%\backup.bat" >nul
echo       Done!
echo.

:: Backup README.md
echo [7/7] Backing up README.md...
copy /Y "%SOURCE%\README.md" "%BACKUP%\README.md" >nul
echo       Done!
echo.

:: Summary
echo ========================================
echo   Backup completed!
echo ========================================
echo.
echo   Backup location: %BACKUP%
echo.
echo   Contents:
echo     - public/              (static assets)
echo     - src/content/         (posts, diary, etc.)
echo     - twilight.config.yaml (site config)
echo     - astro.config.mjs     (build config)
echo     - CUSTOM_CHANGES.md    (manual changes memo)
echo     - deploy.bat           (deploy script)
echo     - backup.bat           (this script)
echo     - README.md            (repo readme)
echo.
echo   Remember: After upgrading Twilight template,
echo   check CUSTOM_CHANGES.md for source code mods!
echo ========================================
echo.
pause
