# Troubleshooting Guide

Common issues and solutions for Task Manager Pro.

## Installation Issues

### Rust Installation Fails

**Error:** `rustup: command not found`

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# Or on Windows, download from https://rustup.rs
```

### Python Dependencies Won't Install

**Error:** `No module named 'fastapi'`

```bash
# Install all required packages
pip install fastapi uvicorn psutil orjson

# If still fails, try:
python -m pip install --upgrade pip
pip install -r older\ versions/v1-python-only/backend-v1-fastapi/requirements.txt
```

### Node Modules Installation Fails

**Error:** `npm ERR! code ENOENT`

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Runtime Issues

### Port Already in Use

**Error:** `Address already in use (os error 10048)`

**Solution:**

```powershell
# Find what's using the port
netstat -ano | findstr :8000
netstat -ano | findstr :8001
netstat -ano | findstr :5173

# Kill the process (replace PID)
taskkill /F /PID <PID>
```

### Rust Backend Won't Start

**Error:** `Access denied` or `Permission denied`

**Solution:**

- Right-click `START_RUST_ADMIN.bat`
- Select "Run as administrator"
- Or start PowerShell/CMD as admin first

### Python Backend Crashes

**Error:** `OSError: [WinError 64] The specified network name is no longer available`

**Solution:** This is a Windows asyncio socket issue.

```bash
# Stop the backend
taskkill /F /IM python.exe

# Restart
cd backend-v1-fastapi
python main.py
```

If it persists, check `backend-v1-fastapi/main.py` has:

```python
host="127.0.0.1"  # NOT "0.0.0.0"
timeout_keep_alive=5
limit_concurrency=100
```

### Frontend Stuck on Loading Screen

**Symptoms:** "Initializing system monitoring..." never finishes

**Debug Steps:**

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

**Common Causes:**

| Error in Console                      | Solution                     |
| ------------------------------------- | ---------------------------- |
| `ERR_CONNECTION_REFUSED` on port 8000 | Start Rust backend           |
| `ERR_CONNECTION_REFUSED` on port 8001 | Start Python backend         |
| `CORS error`                          | Check backend CORS settings  |
| No errors but stuck                   | Clear browser cache, refresh |

### Process Killing Fails

**Error:** "Failed to end process"

**Causes & Solutions:**

1. **Not running as admin**

   - Restart Rust backend using `START_RUST_ADMIN.bat`

2. **System process protection**

   - Some processes (System, csrss.exe) cannot be killed
   - These are marked as "protected"

3. **Process already exited**
   - Refresh the process list

## Build Issues

### Rust Build Fails

**Error:** `error: linking with gcc failed`

**Solution:**

```bash
# Install GNU toolchain
rustup toolchain install stable-x86_64-pc-windows-gnu
rustup default stable-x86_64-pc-windows-gnu

# Rebuild
cd backend
cargo clean
cargo build --release
```

### TypeScript Compilation Errors

**Error:** `Cannot find module` or type errors

**Solution:**

```bash
cd frontend
npm install --save-dev @types/react @types/react-dom
npm run dev
```

## Performance Issues

### High CPU Usage

**Cause:** Too frequent refresh intervals

**Solution:** Edit `frontend/src/App.tsx`:

```typescript
// Change from 2000 to 3000 or 5000
}, 2000); // Refresh every 2 seconds
```

### Slow Process List Loading

**Cause:** Too many processes (>500)

**Solution:** The system handles this automatically, but you can:

- Close unnecessary applications
- Filter processes in the UI

### Memory Leaks

**Symptoms:** Browser tab using excessive memory

**Solution:**

1. Refresh the page (F5)
2. Close and reopen the tab
3. Check for console errors

## GPU Issues

### GPU Not Detected

**Error:** GPU stats show as null or N/A

**Causes:**

1. **No NVIDIA GPU**

   - GPU monitoring only supports NVIDIA cards
   - AMD/Intel GPUs not supported

2. **Missing NVIDIA drivers**

   ```bash
   # Check if drivers are installed
   nvidia-smi
   ```

   - If not found, install from [nvidia.com/drivers](https://www.nvidia.com/drivers)

3. **nvml library not found**
   - Rust backend will skip GPU monitoring if library missing
   - Check backend logs for errors

## Data Accuracy Issues

### CPU Percentages Seem Wrong

**This is expected!** Different tabs use different backends:

- **Performance Tab** (Rust): May show slightly different values
- **Processes Tab** (Python): Accurate per-process CPU%
- **Apps Tab** (Python): Accurate grouped CPU%

The hybrid system prioritizes accuracy where it matters most.

### Disk/Network Stats Not Updating

**Check:**

1. Stats are cumulative (total bytes since boot)
2. They should increase over time, not reset
3. If stuck at 0, restart Rust backend

## Browser Issues

### Blank Screen

**Solution:**

```bash
# Clear Vite cache
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### Styles Not Loading

**Solution:**

```bash
# Rebuild Tailwind
cd frontend
npm run build
npm run dev
```

## Getting Help

If you're still stuck:

1. **Check Logs:**

   - Rust backend: Check terminal output
   - Python backend: Check terminal output
   - Frontend: Check browser console (F12)

2. **Restart Everything:**

   ```bash
   # Kill all processes
   taskkill /F /IM python.exe
   taskkill /F /IM node.exe
   taskkill /F /IM task_manager_backend.exe

   # Restart
   START_ALL.bat
   ```

3. **Clean Build:**

   ```bash
   # Clean all build artifacts
   cd backend
   cargo clean
   cargo build --release

   cd ../frontend
   rm -rf node_modules dist .vite
   npm install
   npm run dev
   ```

4. **Check System Requirements:**
   - Windows 10/11
   - 4GB+ RAM
   - Administrator access
   - No antivirus blocking processes

## Common Error Codes

| Error Code | Meaning              | Solution                 |
| ---------- | -------------------- | ------------------------ |
| 10048      | Port in use          | Kill process using port  |
| 10061      | Connection refused   | Backend not running      |
| 403        | Permission denied    | Run as administrator     |
| 404        | Endpoint not found   | Check backend is running |
| 500        | Server error         | Check backend logs       |
| CORS       | Cross-origin blocked | Check CORS settings      |
