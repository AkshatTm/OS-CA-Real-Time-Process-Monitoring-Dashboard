#!/bin/bash

# Quick Validation Test for Task Manager Pro (Mac/Linux)
echo "🧪 Task Manager Pro - Quick Validation"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
GRAY='\033[0;37m'
CYAN='\033[0;36m'
NC='\033[0m'

# Test 1: Check Python3
echo -e "${YELLOW}[1/6] Checking Python...${NC}"
if command -v python3 &> /dev/null; then
    version=$(python3 --version)
    echo -e "${GREEN}✅ $version${NC}"
else
    echo -e "${RED}❌ Python3 not found${NC}"
    exit 1
fi

# Test 2: Check Node
echo -e "${YELLOW}[2/6] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    version=$(node --version)
    echo -e "${GREEN}✅ Node.js $version${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

# Test 3: Check Backend Dependencies
echo -e "${YELLOW}[3/6] Checking Backend Dependencies...${NC}"
cd backend
if pip3 list 2>&1 | grep -E "fastapi|uvicorn|psutil" > /dev/null; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    pip3 list | grep -E "fastapi|uvicorn|psutil" | while read line; do
        echo -e "${GRAY}   $line${NC}"
    done
else
    echo -e "${YELLOW}⚠️  Some backend dependencies missing${NC}"
fi
cd ..

# Test 4: Check Frontend Dependencies
echo -e "${YELLOW}[4/6] Checking Frontend Dependencies...${NC}"
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed${NC}"
    echo -e "${GRAY}   Run: cd frontend; npm install${NC}"
fi

# Test 5: Check Platform Detection
echo -e "${YELLOW}[5/6] Checking Platform Detection...${NC}"
if grep -q "platform.system()" backend/main.py; then
    echo -e "${GREEN}✅ Platform detection implemented${NC}"
fi
if grep -q 'if platform.system() != "Windows"' backend/main.py; then
    echo -e "${GREEN}✅ Cross-platform attribute handling found${NC}"
fi

# Test 6: Check Script Permissions
echo -e "${YELLOW}[6/6] Checking Script Files...${NC}"
scripts=("setup.sh" "start.sh")
for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            echo -e "${GREEN}✅ $script (executable)${NC}"
        else
            echo -e "${YELLOW}⚠️  $script (not executable - run: chmod +x $script)${NC}"
        fi
    fi
done

echo ""
echo -e "${CYAN}======================================${NC}"
echo -e "${GREEN}✅ Validation Complete!${NC}"
echo ""
echo -e "${CYAN}To run full tests:${NC}"
echo -e "${GRAY}  1. Start backend: cd backend; python3 main.py${NC}"
echo -e "${GRAY}  2. In another terminal: ./test.sh${NC}"
echo ""
