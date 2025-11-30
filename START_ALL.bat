@echo off
:: Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ================================================
    echo   ERROR: Administrator rights required!
    echo ================================================
    echo.
    echo Please RIGHT-CLICK this file and select
    echo "Run as administrator"
    echo.
    pause
    exit /b 1
)

title Task Manager Pro - Complete System
color 0A
cls
echo.
echo ================================================
echo   Task Manager Pro - Complete System Startup
echo ================================================
echo.

:: Start Python Backend (Port 8001) - Accurate CPU
echo [1/3] Starting Python Backend (Port 8001)...
cd /d "%~dp0backend-v1-fastapi"
start "Python Backend - Port 8001" cmd /k "title Python Backend (Accurate CPU) && color 0B && python main.py"
cd /d "%~dp0"
timeout /t 2 /nobreak >nul

:: Start Rust Backend (Port 8000) - Fast Operations
echo [2/3] Starting Rust Backend (Port 8000)...
cd /d "%~dp0backend"
start "Rust Backend - Port 8000" cmd /k "title Rust Backend (Fast Operations) && color 0E && .\target\release\task_manager_backend.exe"
cd /d "%~dp0"
timeout /t 2 /nobreak >nul

:: Start Frontend (Port 5173)
echo [3/3] Starting Frontend (Port 5173)...
cd /d "%~dp0frontend"
start "Frontend - Port 5173" cmd /k "title Frontend Dev Server && color 0D && npm run dev"
cd /d "%~dp0"
timeout /t 3 /nobreak >nul

cls
echo.
echo ================================================
echo   ALL SYSTEMS RUNNING!
echo ================================================
echo.
echo  Backend Services:
echo  - Python (Accurate CPU): http://localhost:8001
echo  - Rust (Fast Ops):       http://localhost:8000
echo.
echo  Frontend:
echo  - Application:           http://localhost:5173
echo.
echo ================================================
echo.
echo  The application will open automatically...
echo  Close this window to keep everything running.
echo.
echo ================================================

:: Wait a bit for servers to fully start
timeout /t 5 /nobreak >nul

:: Open browser
start http://localhost:5173

echo.
echo All services are now running in separate windows.
echo.
pause
