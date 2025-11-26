# 🧪 Task Manager Pro - Cross-Platform Testing Guide

**Project:** Task Manager Pro  
**Platforms:** Windows 10/11, macOS 10.15+, Linux (Ubuntu/Debian)  
**Last Updated:** November 10, 2025

---

## 📋 Test Overview

This document provides comprehensive test cases to verify Task Manager Pro functionality across Windows and macOS platforms.

---

## ✅ Pre-Flight Checklist

### Windows Testing Environment

- [ ] Windows 10 or Windows 11
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] PowerShell or CMD access
- [ ] Administrator privileges (for testing process management)

### macOS Testing Environment

- [ ] macOS 10.15 (Catalina) or later
- [ ] Python 3.8+ installed (`python3 --version`)
- [ ] Node.js 16+ installed
- [ ] Homebrew installed (recommended)
- [ ] Terminal with Full Disk Access
- [ ] sudo privileges (for testing process management)

---

## 🧪 Test Cases

## **Category 1: Installation & Setup**

### Test 1.1: Dependency Installation (Windows)

**Steps:**

```powershell
# Clone repository
git clone https://github.com/AkshatTm/TRIAL-OS-CA-term-paper-Task-Manager-Pro.git
cd TRIAL-OS-CA-term-paper-Task-Manager-Pro

# Run setup
.\setup.bat
```

**Expected Results:**

- ✅ Backend dependencies install successfully
- ✅ Frontend dependencies install successfully
- ✅ No error messages
- ✅ `node_modules` folder created in frontend
- ✅ Python packages installed in backend

**Pass Criteria:**

- Exit code 0
- Success messages displayed

---

### Test 1.2: Dependency Installation (Mac)

**Steps:**

```bash
# Clone repository
git clone https://github.com/AkshatTm/TRIAL-OS-CA-term-paper-Task-Manager-Pro.git
cd TRIAL-OS-CA-term-paper-Task-Manager-Pro

# Make scripts executable
chmod +x setup.sh start.sh

# Run setup
./setup.sh
```

**Expected Results:**

- ✅ Backend dependencies install successfully
- ✅ Frontend dependencies install successfully
- ✅ No permission errors
- ✅ Scripts execute with bash
- ✅ All packages installed

**Pass Criteria:**

- Exit code 0
- Success messages displayed
- No "permission denied" errors

---

### Test 1.3: Manual Installation (Windows)

**Steps:**

```powershell
cd backend
pip install -r requirements.txt
cd ../frontend
npm install
```

**Expected Results:**

- ✅ All pip packages install
- ✅ All npm packages install
- ✅ No dependency conflicts

---

### Test 1.4: Manual Installation (Mac)

**Steps:**

```bash
cd backend
pip3 install -r requirements.txt
cd ../frontend
npm install
```

**Expected Results:**

- ✅ All pip3 packages install
- ✅ All npm packages install
- ✅ No dependency conflicts

---

## **Category 2: Backend API Testing**

### Test 2.1: Backend Startup (Windows)

**Steps:**

```powershell
cd backend
python main.py
```

**Expected Results:**

- ✅ Server starts on `http://localhost:8000`
- ✅ No errors in console
- ✅ Welcome message displays
- ✅ API docs available at `/docs`

**Verification:**

```powershell
# In another terminal/browser
curl http://localhost:8000
curl http://localhost:8000/docs
```

---

### Test 2.2: Backend Startup (Mac)

**Steps:**

```bash
cd backend
python3 main.py
```

**Expected Results:**

- ✅ Server starts on `http://localhost:8000`
- ✅ No platform-specific errors
- ✅ Proper process attribute handling

**Verification:**

```bash
curl http://localhost:8000
curl http://localhost:8000/api/system/stats
```

---

### Test 2.3: System Stats API (Windows)

**Steps:**

```powershell
# Backend running, then test:
curl http://localhost:8000/api/system/stats
```

**Expected Results:**

- ✅ Returns JSON with system info
- ✅ CPU stats present
- ✅ Memory stats present
- ✅ Disk stats show `C:\` path
- ✅ Network stats present
- ✅ OS detected as "Windows"

**Sample Response:**

```json
{
  "cpu": {
    "percent": 15.2,
    "cores": { "physical": 4, "logical": 8 }
  },
  "system": {
    "os": "Windows",
    "release": "10"
  }
}
```

---

### Test 2.4: System Stats API (Mac)

**Steps:**

```bash
curl http://localhost:8000/api/system/stats
```

**Expected Results:**

- ✅ Returns JSON with system info
- ✅ Disk stats show `/` path (not `C:\`)
- ✅ OS detected as "Darwin"
- ✅ Mac-specific attributes included (`num_fds`)

**Sample Response:**

```json
{
  "disk": {
    "path": "/",
    "total": 500000000000
  },
  "system": {
    "os": "Darwin",
    "release": "21.0.0"
  }
}
```

---

### Test 2.5: Process List API (Windows)

**Steps:**

```powershell
curl http://localhost:8000/api/processes
```

**Expected Results:**

- ✅ Returns array of processes
- ✅ Each process has: pid, name, cpu_percent, memory_percent
- ✅ Windows-specific processes visible (explorer.exe, etc.)
- ✅ No AttributeError for Windows-only attributes

---

### Test 2.6: Process List API (Mac)

**Steps:**

```bash
curl http://localhost:8000/api/processes
```

**Expected Results:**

- ✅ Returns array of processes
- ✅ Mac-specific processes visible (WindowServer, etc.)
- ✅ `num_fds` attribute present (Mac-specific)
- ✅ No AttributeError for `ionice` (Linux-only)

---

### Test 2.7: Process Details API (Both Platforms)

**Steps:**

```bash
# Get a process PID first
curl http://localhost:8000/api/processes

# Then get details (use an actual PID)
curl http://localhost:8000/api/process/1234
```

**Expected Results:**

- ✅ Returns detailed process info
- ✅ Memory info formatted correctly
- ✅ Create time as ISO timestamp
- ✅ No crashes on platform-specific attributes

---

### Test 2.8: Process Kill API (Both Platforms)

**Steps:**

```bash
# Start a test process first (e.g., notepad on Windows, TextEdit on Mac)

# Get its PID
curl http://localhost:8000/api/processes | grep -i notepad

# Kill it
curl -X POST http://localhost:8000/api/process/{PID}/kill
```

**Expected Results:**

- ✅ Process terminates successfully
- ✅ Returns success message
- ✅ Protected processes rejected (error 403)

---

### Test 2.9: Protected Process Handling (Both Platforms)

**Steps:**

```bash
# Try to kill a system process
curl -X POST http://localhost:8000/api/process/0/kill
curl -X POST http://localhost:8000/api/process/1/kill
```

**Expected Results:**

- ✅ Returns 403 Forbidden
- ✅ Error message: "protected system process"
- ✅ Process NOT terminated

---

## **Category 3: Frontend Testing**

### Test 3.1: Frontend Dev Server (Windows)

**Steps:**

```powershell
cd frontend
npm run dev
```

**Expected Results:**

- ✅ Vite dev server starts
- ✅ Opens at `http://localhost:5173`
- ✅ No build errors
- ✅ Hot reload works

---

### Test 3.2: Frontend Dev Server (Mac)

**Steps:**

```bash
cd frontend
npm run dev
```

**Expected Results:**

- ✅ Vite dev server starts
- ✅ No platform-specific errors
- ✅ Port 5173 accessible

---

### Test 3.3: Electron App (Windows)

**Steps:**

```powershell
cd frontend
npm run electron-dev
```

**Expected Results:**

- ✅ Electron window opens
- ✅ App loads at correct size (1400x900)
- ✅ Dev tools open (in development mode)
- ✅ Window can be resized
- ✅ Minimum size enforced (1200x800)

---

### Test 3.4: Electron App (Mac)

**Steps:**

```bash
cd frontend
npm run electron-dev
```

**Expected Results:**

- ✅ Electron window opens
- ✅ Native macOS menu bar visible
- ✅ Cmd+Q quits app
- ✅ App doesn't quit when window closed (Mac standard)
- ✅ Window re-opens when clicking dock icon

---

### Test 3.5: Frontend UI - Process List Display

**Steps:**

1. Start backend and frontend
2. Open app in browser or Electron
3. View process list

**Expected Results:**

- ✅ Processes displayed in table
- ✅ Real-time updates every 2 seconds
- ✅ CPU and memory percentages visible
- ✅ Sort functionality works
- ✅ Search/filter works

---

### Test 3.6: Frontend UI - System Stats Display

**Steps:**

1. Navigate to Performance tab
2. View system metrics

**Expected Results:**

- ✅ CPU usage graph displays
- ✅ Memory usage displays
- ✅ Disk usage displays
- ✅ Network stats display
- ✅ All values update in real-time

---

### Test 3.7: Frontend UI - Process Actions

**Steps:**

1. Select a non-protected process
2. Click "Kill Process"
3. Confirm action

**Expected Results:**

- ✅ Confirmation dialog appears
- ✅ Process terminates on confirm
- ✅ UI updates to remove process
- ✅ Success notification shows

---

## **Category 4: Integration Testing**

### Test 4.1: Full Stack (Windows)

**Steps:**

```powershell
# Terminal 1
cd backend
python main.py

# Terminal 2
cd frontend
npm run electron-dev
```

**Expected Results:**

- ✅ Backend and frontend connect
- ✅ API calls successful
- ✅ Data flows correctly
- ✅ No CORS errors
- ✅ Real-time updates work

---

### Test 4.2: Full Stack (Mac)

**Steps:**

```bash
# Terminal 1
cd backend
python3 main.py

# Terminal 2
cd frontend
npm run electron-dev
```

**Expected Results:**

- ✅ Backend and frontend connect
- ✅ Mac-specific data displays correctly
- ✅ No platform errors

---

### Test 4.3: Automated Startup Script (Windows)

**Steps:**

```powershell
.\start.bat
```

**Expected Results:**

- ✅ Both backend and frontend start
- ✅ Runs in background
- ✅ Can be stopped with Ctrl+C

---

### Test 4.4: Automated Startup Script (Mac)

**Steps:**

```bash
./start.sh
```

**Expected Results:**

- ✅ User prompted for mode selection
- ✅ Backend starts in background
- ✅ Frontend starts based on selection
- ✅ Cleanup on Ctrl+C works
- ✅ All processes terminated properly

---

## **Category 5: Error Handling**

### Test 5.1: Backend Port Conflict (Both Platforms)

**Steps:**

1. Start backend on port 8000
2. Try to start second instance

**Expected Results:**

- ✅ Second instance fails gracefully
- ✅ Clear error message about port in use
- ✅ Suggestion to kill existing process

---

### Test 5.2: Frontend Port Conflict (Both Platforms)

**Steps:**

1. Start frontend on port 5173
2. Try to start second instance

**Expected Results:**

- ✅ Vite prompts for different port
- ✅ Or fails with clear message

---

### Test 5.3: Backend Not Running

**Steps:**

1. Start only frontend
2. Try to view data

**Expected Results:**

- ✅ Frontend shows connection error
- ✅ Retry mechanism works
- ✅ Clear error message to user

---

### Test 5.4: Invalid Process ID

**Steps:**

```bash
curl http://localhost:8000/api/process/999999
```

**Expected Results:**

- ✅ Returns 404 Not Found
- ✅ Error message: "Process not found"

---

### Test 5.5: Permission Denied Errors

**Steps:**

```bash
# Try to kill a protected process
curl -X POST http://localhost:8000/api/process/4/kill
```

**Expected Results:**

- ✅ Returns 403 Forbidden
- ✅ Helpful error message
- ✅ Suggests running as admin/sudo

---

## **Category 6: Performance Testing**

### Test 6.1: CPU Usage (Both Platforms)

**Steps:**

1. Start backend
2. Monitor CPU usage for 5 minutes
3. Make 100 API requests

**Expected Results:**

- ✅ Idle CPU < 5%
- ✅ Under load CPU < 20%
- ✅ CPU returns to idle after load

---

### Test 6.2: Memory Usage (Both Platforms)

**Steps:**

1. Start full stack
2. Monitor memory for 10 minutes
3. Check for memory leaks

**Expected Results:**

- ✅ Backend memory < 100MB
- ✅ Frontend (Electron) memory < 200MB
- ✅ Frontend (Browser) memory < 100MB
- ✅ No continuous memory growth

---

### Test 6.3: Response Time

**Steps:**

```bash
# Time API requests
time curl http://localhost:8000/api/processes
```

**Expected Results:**

- ✅ Response time < 100ms for system stats
- ✅ Response time < 200ms for process list
- ✅ Response time < 50ms for single process

---

## **Category 7: Platform-Specific Features**

### Test 7.1: Windows-Specific Features

**Steps:**

1. Run on Windows
2. Check process list

**Expected Results:**

- ✅ Windows processes visible (explorer.exe, dwm.exe)
- ✅ C:\ disk path used
- ✅ Windows system info correct
- ✅ No Mac/Linux-only attributes cause errors

---

### Test 7.2: Mac-Specific Features

**Steps:**

1. Run on macOS
2. Check process attributes

**Expected Results:**

- ✅ `num_fds` attribute present
- ✅ `nice` value present
- ✅ Root path `/` used for disk
- ✅ Darwin detected as OS
- ✅ macOS processes visible (WindowServer, etc.)

---

### Test 7.3: GPU Monitoring (If Available)

**Steps:**

```bash
curl http://localhost:8000/api/system/stats
```

**Expected Results:**

- ✅ If GPU present: GPU data in response
- ✅ If no GPU: `gpu: null`, `gpu_available: false`
- ✅ No crashes when GPU unavailable

---

## **Category 8: Security Testing**

### Test 8.1: CORS Protection

**Steps:**

```bash
# Try to access API from unauthorized origin
curl -H "Origin: http://malicious-site.com" http://localhost:8000/api/processes
```

**Expected Results:**

- ✅ Only localhost origins allowed
- ✅ CORS headers present for allowed origins

---

### Test 8.2: Process Protection

**Steps:**

```bash
# Try to kill critical system processes
curl -X POST http://localhost:8000/api/process/0/kill  # System Idle
curl -X POST http://localhost:8000/api/process/4/kill  # System
```

**Expected Results:**

- ✅ All attempts rejected
- ✅ 403 Forbidden returned
- ✅ Processes remain running

---

### Test 8.3: Input Validation

**Steps:**

```bash
# Invalid PID
curl http://localhost:8000/api/process/abc

# Negative PID
curl http://localhost:8000/api/process/-1
```

**Expected Results:**

- ✅ Validation error returned
- ✅ No server crashes
- ✅ Appropriate HTTP status codes

---

## 📊 Test Results Template

Use this template to record test results:

```markdown
## Test Execution Results

**Date:** YYYY-MM-DD
**Tester:** Name
**Platform:** Windows 10/11 or macOS X.XX
**Python Version:** X.X.X
**Node Version:** X.X.X

### Summary

- Total Tests: XX
- Passed: XX ✅
- Failed: XX ❌
- Skipped: XX ⏭️

### Failed Tests

1. Test X.X: [Description]
   - Error: [Error message]
   - Steps to reproduce: [Steps]
   - Screenshot: [If applicable]

### Notes

- [Any additional observations]
```

---

## 🔧 Automated Testing Script

### Windows Test Script

Create `test.ps1`:

```powershell
Write-Host "Starting Task Manager Pro Tests..." -ForegroundColor Green

# Test 1: Backend Health
Write-Host "`nTest 1: Backend Health Check..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "http://localhost:8000" -ErrorAction SilentlyContinue
if ($response) {
    Write-Host "✅ Backend is running" -ForegroundColor Green
} else {
    Write-Host "❌ Backend not responding" -ForegroundColor Red
}

# Test 2: System Stats API
Write-Host "`nTest 2: System Stats API..." -ForegroundColor Yellow
$stats = Invoke-RestMethod -Uri "http://localhost:8000/api/system/stats" -ErrorAction SilentlyContinue
if ($stats.cpu) {
    Write-Host "✅ System stats API working" -ForegroundColor Green
    Write-Host "   CPU: $($stats.cpu.percent)%" -ForegroundColor Cyan
    Write-Host "   Memory: $($stats.memory.percent)%" -ForegroundColor Cyan
} else {
    Write-Host "❌ System stats API failed" -ForegroundColor Red
}

# Test 3: Process List API
Write-Host "`nTest 3: Process List API..." -ForegroundColor Yellow
$processes = Invoke-RestMethod -Uri "http://localhost:8000/api/processes" -ErrorAction SilentlyContinue
if ($processes) {
    Write-Host "✅ Process list API working" -ForegroundColor Green
    Write-Host "   Total processes: $($processes.Count)" -ForegroundColor Cyan
} else {
    Write-Host "❌ Process list API failed" -ForegroundColor Red
}

Write-Host "`nTests completed!" -ForegroundColor Green
```

### Mac Test Script

Create `test.sh`:

```bash
#!/bin/bash

echo "🧪 Starting Task Manager Pro Tests..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Backend Health
echo -e "\n${YELLOW}Test 1: Backend Health Check...${NC}"
if curl -s http://localhost:8000 > /dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend not responding${NC}"
fi

# Test 2: System Stats
echo -e "\n${YELLOW}Test 2: System Stats API...${NC}"
stats=$(curl -s http://localhost:8000/api/system/stats)
if [ ! -z "$stats" ]; then
    echo -e "${GREEN}✅ System stats API working${NC}"
    echo "$stats" | python3 -m json.tool | head -20
else
    echo -e "${RED}❌ System stats API failed${NC}"
fi

# Test 3: Process List
echo -e "\n${YELLOW}Test 3: Process List API...${NC}"
processes=$(curl -s http://localhost:8000/api/processes)
if [ ! -z "$processes" ]; then
    echo -e "${GREEN}✅ Process list API working${NC}"
    count=$(echo "$processes" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))")
    echo -e "   Total processes: $count"
else
    echo -e "${RED}❌ Process list API failed${NC}"
fi

echo -e "\n${GREEN}Tests completed!${NC}"
```

---

## ✅ Final Checklist

Before releasing:

### Windows Verification

- [ ] All dependencies install via `setup.bat`
- [ ] Backend starts without errors
- [ ] Frontend (browser) works
- [ ] Frontend (Electron) works
- [ ] Process management works
- [ ] No AttributeErrors in logs
- [ ] Performance acceptable

### macOS Verification

- [ ] All dependencies install via `setup.sh`
- [ ] Scripts execute with proper permissions
- [ ] Backend uses `python3` correctly
- [ ] Mac-specific attributes work
- [ ] No platform-specific crashes
- [ ] Electron respects macOS conventions
- [ ] Performance acceptable

### Cross-Platform

- [ ] API responses consistent
- [ ] UI renders correctly on both
- [ ] Data format identical
- [ ] Error handling works
- [ ] Documentation accurate

---

## 🐛 Bug Reporting Template

```markdown
**Platform:** Windows/macOS
**OS Version:**
**Python Version:**
**Node Version:**

**Description:**
[Describe the bug]

**Steps to Reproduce:**

1.
2.
3.

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[If applicable]

**Logs:**
```

[Paste relevant logs]

```

**Additional Context:**
[Any other information]
```

---

## 📞 Support

- **Documentation:** See [00_DOCUMENTATION_INDEX.md](./00_DOCUMENTATION_INDEX.md)
- **Troubleshooting:** See [07_TROUBLESHOOTING.md](./07_TROUBLESHOOTING.md)
- **Mac Guide:** See [MAC_QUICKSTART.md](./MAC_QUICKSTART.md)
- **Windows Guide:** See [01_QUICKSTART.md](./01_QUICKSTART.md)

---

**Happy Testing! 🚀**
