#!/bin/bash

echo "========================================"
echo "  Task Manager Pro - Starting..."
echo "========================================"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Stopping Task Manager Pro..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

# Start backend in background
echo "[1/2] Starting Backend Server..."
cd backend || exit 1
python3 main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "ERROR: Backend failed to start"
    exit 1
fi

echo "✓ Backend running on http://localhost:8000"
echo ""

# Start frontend
echo "[2/2] Starting Frontend..."
cd frontend || exit 1

# Ask user which mode
echo "Choose mode:"
echo "1) Web Browser (Vite dev server)"
echo "2) Electron Desktop App"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" == "2" ]; then
    echo "Starting Electron..."
    npm run electron-dev
else
    echo "Starting web server..."
    npm run dev
fi

FRONTEND_PID=$!
cd ..

# Wait for processes
wait
