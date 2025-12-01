#!/bin/bash

# Task Manager Pro - Cross-Platform Startup Script
# Works on macOS and Linux

echo "=========================================="
echo "  Task Manager Pro - Hybrid Architecture"
echo "  Starting all services..."
echo "=========================================="

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running with sudo for Rust backend
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}Note: Rust backend requires sudo for process termination.${NC}"
    echo -e "${YELLOW}Restarting script with sudo...${NC}"
    sudo "$0" "$@"
    exit $?
fi

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${RED}Port $1 is already in use!${NC}"
        echo "Kill the process using: lsof -ti:$1 | xargs kill -9"
        return 1
    fi
    return 0
}

# Check ports
echo "Checking ports..."
check_port 8000 || exit 1
check_port 8001 || exit 1
check_port 5173 || exit 1

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start Python backend
echo -e "${GREEN}Starting Python backend (port 8001)...${NC}"
cd "$SCRIPT_DIR/older versions/v1-python-only/backend-v1-fastapi" || exit 1

# Check if Python dependencies are installed
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo -e "${YELLOW}Installing Python dependencies...${NC}"
    pip3 install fastapi uvicorn psutil orjson
fi

python3 main.py > /tmp/python_backend.log 2>&1 &
PYTHON_PID=$!
echo "Python backend PID: $PYTHON_PID"

# Wait a bit for Python to start
sleep 2

# Start Rust backend
echo -e "${GREEN}Starting Rust backend (port 8000) with sudo...${NC}"
cd "$SCRIPT_DIR/backend" || exit 1

# Build if needed
if [ ! -f "target/release/task_manager_backend" ]; then
    echo -e "${YELLOW}Building Rust backend (first time)...${NC}"
    cargo build --release
fi

# Run as sudo user
cargo run --release > /tmp/rust_backend.log 2>&1 &
RUST_PID=$!
echo "Rust backend PID: $RUST_PID"

# Wait for Rust backend to start
sleep 3

# Start Frontend (drop sudo privileges for npm)
echo -e "${GREEN}Starting React frontend (port 5173)...${NC}"
cd "$SCRIPT_DIR/frontend" || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Node dependencies (first time)...${NC}"
    # Run npm as the original user, not root
    sudo -u "$SUDO_USER" npm install
fi

# Start frontend as original user
sudo -u "$SUDO_USER" npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo -e "${GREEN}=========================================="
echo "  All services started successfully!"
echo "==========================================${NC}"
echo ""
echo "Service URLs:"
echo "  - Frontend:      http://localhost:5173"
echo "  - Rust Backend:  http://localhost:8000/api/stats"
echo "  - Python Backend: http://localhost:8001/api/processes"
echo ""
echo "Process IDs:"
echo "  - Python: $PYTHON_PID"
echo "  - Rust:   $RUST_PID"
echo "  - Frontend: $FRONTEND_PID"
echo ""
echo "Logs:"
echo "  - Python:  /tmp/python_backend.log"
echo "  - Rust:    /tmp/rust_backend.log"
echo "  - Frontend: /tmp/frontend.log"
echo ""
echo "To stop all services, run:"
echo "  sudo kill $PYTHON_PID $RUST_PID $FRONTEND_PID"
echo ""
echo -e "${YELLOW}Opening browser in 3 seconds...${NC}"
sleep 3

# Open browser (as original user)
if command -v open &> /dev/null; then
    # macOS
    sudo -u "$SUDO_USER" open http://localhost:5173
elif command -v xdg-open &> /dev/null; then
    # Linux
    sudo -u "$SUDO_USER" xdg-open http://localhost:5173
fi

echo ""
echo -e "${GREEN}Browser opened! Check the application at http://localhost:5173${NC}"
echo ""
echo "Press Ctrl+C to stop all services..."

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping all services...'; kill $PYTHON_PID $RUST_PID $FRONTEND_PID 2>/dev/null; echo 'All services stopped.'; exit 0" SIGINT SIGTERM

# Keep script running
wait
