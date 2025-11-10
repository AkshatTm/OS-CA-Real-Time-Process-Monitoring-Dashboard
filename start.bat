@echo off
echo Starting Task Manager Pro...
echo.

start "Backend Server" cmd /k "cd backend && python main.py"

timeout /t 3 /nobreak > nul

start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

echo.
echo Task Manager Pro is starting!
echo.
echo Backend will be at: http://localhost:8000
echo Frontend will be at: http://localhost:5173
echo.
echo Press any key to exit (servers will keep running)...
pause > nul
