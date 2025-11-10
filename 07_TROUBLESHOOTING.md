# 🔧 Troubleshooting Guide

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Backend Issues](#backend-issues)
3. [Frontend Issues](#frontend-issues)
4. [Electron Issues](#electron-issues)
5. [Process Management Issues](#process-management-issues)
6. [Performance Issues](#performance-issues)
7. [Cross-Platform Issues](#cross-platform-issues)
8. [Common Error Messages](#common-error-messages)

---

## 📦 Installation Issues

### Python Version Issues

**Problem:** `Python version is too old`

**Solution:**

```bash
# Check your Python version
python --version

# Should be 3.8 or higher
# If not, download from https://www.python.org/downloads/
```

---

### Node.js Version Issues

**Problem:** `npm ERR! engine Unsupported engine`

**Solution:**

```bash
# Check your Node.js version
node --version

# Should be 18 or higher
# Update Node.js from https://nodejs.org/
```

---

### pip Not Found

**Problem:** `'pip' is not recognized as an internal or external command`

**Solution:**

```bash
# Windows
python -m pip install -r requirements.txt

# Ensure Python is in PATH
# During Python installation, check "Add Python to PATH"
```

---

### npm Install Fails

**Problem:** `npm ERR! code EACCES` or permission errors

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install again
npm install

# If on Linux/Mac, avoid using sudo
# Fix permissions:
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

---

## 🐍 Backend Issues

### Port 8000 Already in Use

**Problem:** `ERROR: [Errno 10048] Only one usage of each socket address`

**Solution:**

**Windows:**

```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual PID)
taskkill /PID <PID> /F
```

**Mac/Linux:**

```bash
# Find and kill process
lsof -ti:8000 | xargs kill -9

# Or change port in backend/main.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

---

### Module Not Found Errors

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**

```bash
# Make sure you're in backend directory
cd backend

# Install all dependencies
pip install -r requirements.txt

# If issue persists, upgrade pip
python -m pip install --upgrade pip

# Then install again
pip install -r requirements.txt --upgrade
```

---

### psutil Permission Errors

**Problem:** `psutil.AccessDenied: (pid=1234)`

**Solution:**

**Windows:**

```powershell
# Run Command Prompt as Administrator
# Right-click cmd.exe -> "Run as administrator"
cd backend
python main.py
```

**Mac/Linux:**

```bash
# Run with sudo
sudo python main.py

# Or better, add user to appropriate group
# Mac: sudo dseditgroup -o edit -a $USER -t user admin
# Linux: sudo usermod -a -G adm $USER
```

---

### CORS Errors

**Problem:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**

```python
# In backend/main.py, ensure CORS middleware includes your port
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite
        "http://localhost:3000",  # React
        "http://localhost:8080",  # Add your custom port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Backend Won't Start

**Problem:** Backend crashes immediately

**Solution:**

```bash
# Check for syntax errors
python -m py_compile main.py

# Run with verbose output
python main.py

# Check if all dependencies are installed
pip list

# Verify required packages
pip show fastapi psutil uvicorn
```

---

## ⚛️ Frontend Issues

### Port 5173 Already in Use

**Problem:** `Port 5173 is already in use`

**Solution:**

```bash
# Kill Vite dev server
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9

# Or change port in package.json
vite --port 3000
```

---

### npm run dev Fails

**Problem:** `Error: Cannot find module 'vite'`

**Solution:**

```bash
# Clear everything
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Install dependencies
npm install

# If problem persists, check Node.js version
node --version  # Should be 18+
```

---

### Blank Page / White Screen

**Problem:** Application loads but shows blank page

**Solution:**

```bash
# Open browser console (F12)
# Check for JavaScript errors

# Common fixes:

# 1. Backend not running
# Start backend first: cd backend && python main.py

# 2. Wrong API URL
# Check frontend/src/App.jsx
# const API_URL = "http://localhost:8000";

# 3. Clear browser cache
# Ctrl+Shift+Delete or Cmd+Shift+Delete
```

---

### API Connection Failed

**Problem:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution:**

```bash
# 1. Ensure backend is running
curl http://localhost:8000

# 2. Check firewall settings
# Windows: Allow Python through Windows Firewall
# Mac: System Preferences -> Security -> Firewall

# 3. Check backend logs
# Look for errors in backend terminal

# 4. Test API directly
# Visit http://localhost:8000/docs
# Try API endpoints in browser
```

---

### Charts Not Displaying

**Problem:** Graphs/charts are not rendering

**Solution:**

```javascript
// Check browser console for errors

// Common fixes:

// 1. Recharts not installed
npm install recharts

// 2. Data format incorrect
// Verify systemStats exists and has correct structure
console.log(systemStats);

// 3. Component not receiving props
// Check prop passing from parent component
```

---

## 🖥️ Electron Issues

### Electron Won't Start

**Problem:** `npm run electron-dev` doesn't work

**Solution:**

```bash
# Ensure Vite dev server is running first
npm run dev

# In another terminal
npm run electron

# Or use combined command
npm run electron-dev

# If error persists, rebuild electron
npm rebuild electron
```

---

### Electron Shows Blank Window

**Problem:** Electron window opens but is blank

**Solution:**

```javascript
// Check electron.js configuration

// 1. Ensure correct URL
win.loadURL("http://localhost:5173"); // In development

// 2. Check if Vite server is running
// Should see "Local: http://localhost:5173" in terminal

// 3. Open DevTools to see errors
// In electron.js, add:
win.webContents.openDevTools();
```

---

### Electron Build Errors

**Problem:** Cannot package Electron app

**Solution:**

```bash
# Install electron-builder
npm install electron-builder --save-dev

# Clear cache
rm -rf dist

# Build frontend first
npm run build

# Then package
npm run electron-build
```

---

## 🔐 Process Management Issues

### Cannot Kill Process

**Problem:** `Access denied. Cannot kill process`

**Solution:**

**Windows:**

```powershell
# Run backend as Administrator
# Right-click Command Prompt -> Run as administrator
cd backend
python main.py
```

**Mac/Linux:**

```bash
# Run with sudo
sudo python main.py

# Or for specific processes only
# Check process owner
ps aux | grep <process_name>
```

---

### Cannot Kill System Process

**Problem:** `Cannot terminate 'system'. This is a protected system process.`

**Explanation:** This is intentional security feature.

**Protected processes include:**

- system, csrss.exe, wininit.exe
- services.exe, lsass.exe
- explorer.exe, svchost.exe
- Processes with PID ≤ 10

**Solution:** Don't terminate these processes - they're critical for OS stability.

---

### Process Suspend/Resume Not Working

**Problem:** Suspend/Resume buttons don't work

**Solution:**

**Windows:**

```powershell
# Some processes cannot be suspended
# Requires Administrator privileges

# Run backend as Admin
# Right-click cmd -> Run as administrator
python main.py
```

**Mac:**

```bash
# Suspend/Resume has limited support on macOS
# Some processes may not respond

# Try with sudo
sudo python main.py
```

---

### Process List Not Updating

**Problem:** Process list appears frozen

**Solution:**

```javascript
// Check if auto-refresh is working

// 1. Verify interval is running
// In App.jsx, check useEffect cleanup

// 2. Check for JavaScript errors
// Open browser console (F12)

// 3. Manually refresh
// Click browser refresh button

// 4. Restart both backend and frontend
```

---

## ⚡ Performance Issues

### High CPU Usage

**Problem:** Task Manager Pro uses too much CPU

**Solution:**

```javascript
// Increase refresh interval
// In frontend/src/App.jsx

useEffect(() => {
  const interval = setInterval(() => {
    fetchSystemStats();
    fetchProcesses();
  }, 5000); // Change from 2000 to 5000 (5 seconds)

  return () => clearInterval(interval);
}, []);
```

---

### Slow Process List

**Problem:** Process list is slow with many processes

**Solution:**

```python
# In backend/main.py
# Optimize process iteration

# Only fetch required attributes
for proc in psutil.process_iter([
    'pid', 'name', 'cpu_percent', 'memory_percent'
    # Remove unused attributes
]):
    # Process data
```

```javascript
// Frontend: Implement pagination or virtual scrolling
// Install react-window
npm install react-window

// Use FixedSizeList for large lists
```

---

### Memory Leaks

**Problem:** Application memory usage grows over time

**Solution:**

```javascript
// Ensure cleanup in useEffect

useEffect(() => {
  const interval = setInterval(() => {
    // Fetch data
  }, 2000);

  // IMPORTANT: Cleanup function
  return () => clearInterval(interval);
}, []);

// Also clear history arrays periodically
setCpuHistory((prev) => prev.slice(-60)); // Keep only last 60
```

---

## 🌍 Cross-Platform Issues

### macOS: psutil Installation Fails

**Problem:** `error: command 'clang' failed`

**Solution:**

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Then install psutil
pip3 install psutil
```

---

### macOS: Permission Denied

**Problem:** Cannot access process information

**Solution:**

```bash
# Grant Full Disk Access
# System Preferences -> Security & Privacy -> Privacy
# Full Disk Access -> Add Terminal or Python

# Or run with sudo
sudo python3 main.py
```

---

### Linux: Process Information Limited

**Problem:** Some process info not available

**Solution:**

```bash
# Run with appropriate permissions
sudo python3 main.py

# Or add user to proc group
sudo usermod -a -G proc $USER

# Logout and login for changes to take effect
```

---

### Windows: Scripts Disabled

**Problem:** `cannot be loaded because running scripts is disabled`

**Solution:**

```powershell
# Check execution policy
Get-ExecutionPolicy

# Set to RemoteSigned
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run script
.\setup.bat
```

---

## ❌ Common Error Messages

### "Failed to fetch"

**Cause:** Backend not running or wrong URL

**Fix:**

```bash
# Start backend
cd backend
python main.py

# Verify it's running
curl http://localhost:8000
```

---

### "Process does not exist anymore"

**Cause:** Process terminated between fetch and action

**Fix:** This is normal. The process was terminated by another application or user. Refresh the list.

---

### "EADDRINUSE"

**Cause:** Port already in use

**Fix:**

```bash
# Windows
netstat -ano | findstr :<PORT>
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:<PORT> | xargs kill -9
```

---

### "ModuleNotFoundError"

**Cause:** Python dependency not installed

**Fix:**

```bash
cd backend
pip install -r requirements.txt --upgrade
```

---

### "Cannot find module"

**Cause:** Node.js dependency not installed

**Fix:**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

### "net::ERR_CONNECTION_REFUSED"

**Cause:** Backend server not reachable

**Fix:**

```bash
# 1. Check backend is running
cd backend
python main.py

# 2. Check firewall
# Allow Python through firewall

# 3. Verify port
# Backend should show: Uvicorn running on http://0.0.0.0:8000
```

---

## 🆘 Still Having Issues?

### Collect Diagnostic Information

```bash
# Python version
python --version

# Node version
node --version

# npm version
npm --version

# Installed Python packages
pip list

# Installed npm packages
npm list --depth=0

# Check if ports are available
netstat -ano | findstr :8000
netstat -ano | findstr :5173
```

### Check Logs

**Backend Logs:**

- Look at terminal where `python main.py` is running
- Check for error messages or stack traces

**Frontend Logs:**

- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Debug Mode

**Backend:**

```python
# In backend/main.py
uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
```

**Frontend:**

```javascript
// Add console logs
console.log("System Stats:", systemStats);
console.log("Processes:", processes);
```

---

## 📞 Getting Help

1. Check existing documentation
2. Search for error message online
3. Check GitHub issues (if applicable)
4. Provide full error message and context when asking for help

---

**Most issues can be resolved by:**

1. ✅ Running as Administrator/sudo
2. ✅ Ensuring both backend and frontend are running
3. ✅ Checking firewall settings
4. ✅ Verifying all dependencies are installed
5. ✅ Using correct ports (8000 for backend, 5173 for frontend)

**Good luck! 🚀**
