@echo off
title Rust Backend (Admin) - Port 8000
color 0E
echo.
echo ================================================
echo   Rust Backend - Fast Operations
echo   Port: 8000 (Running as Administrator)
echo ================================================
echo.
cd /d "%~dp0backend"
.\target\release\task_manager_backend.exe
pause
