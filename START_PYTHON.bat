@echo off
REM Task Manager Pro - Start Python Backend
REM This starts the Python FastAPI backend on port 8001

echo.
echo ============================================
echo   Task Manager Pro - Python CPU Backend
echo ============================================
echo.
echo Starting Python backend on port 8001...
echo.

cd /d "%~dp0backend-v1-fastapi"
python main.py

pause
