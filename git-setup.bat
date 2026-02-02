@echo off
chcp 65001 >nul
title Git 初始配置

echo ========================================
echo   Git 初始配置脚本
echo ========================================
echo.

:: 设置用户名
set /p username="请输入 GitHub 用户名 (Zenfish-zy): "
if "%username%"=="" set username=Zenfish-zy
git config --global user.name "%username%"
echo 已设置用户名: %username%
echo.

:: 设置邮箱
set /p email="请输入 GitHub 邮箱: "
git config --global user.email "%email%"
echo 已设置邮箱: %email%
echo.

:: 显示配置
echo ========================================
echo   当前 Git 配置:
echo ========================================
git config --global user.name
git config --global user.email
echo.

echo 配置完成！现在可以运行 deploy.bat 了
echo.
pause
