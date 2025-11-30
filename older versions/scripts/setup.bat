@echo off
echo ========================================
echo   Task Manager Pro - Setup Script
echo ========================================
echo.

echo [1/4] Installing Python Backend Dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
cd ..
echo.

echo [2/4] Installing Node.js Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node dependencies
    pause
    exit /b 1
)
cd ..
echo.

echo ========================================
echo   Installation Complete! ✓
echo ========================================
echo.
echo To run the application:
echo.
echo 1. Start Backend (Terminal 1):
echo    cd backend
echo    python main.py
echo.
echo 2. Start Frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Or run with Electron (Terminal 2):
echo    cd frontend
echo    npm run electron-dev
echo.
echo Press any key to exit...
pause > nul
