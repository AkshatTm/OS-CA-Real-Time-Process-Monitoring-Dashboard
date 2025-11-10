#!/bin/bash

echo "========================================"
echo "  Task Manager Pro - Setup Script"
echo "========================================"
echo ""

echo "[1/4] Installing Python Backend Dependencies..."
cd backend || exit 1
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Python dependencies"
    exit 1
fi
cd ..
echo ""

echo "[2/4] Installing Node.js Frontend Dependencies..."
cd frontend || exit 1
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Node dependencies"
    exit 1
fi
cd ..
echo ""

echo "========================================"
echo "  Installation Complete! ✓"
echo "========================================"
echo ""
echo "To run the application:"
echo ""
echo "1. Start Backend (Terminal 1):"
echo "   cd backend"
echo "   python3 main.py"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Or run with Electron (Terminal 2):"
echo "   cd frontend"
echo "   npm run electron-dev"
echo ""
