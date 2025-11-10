# 🍎 Task Manager Pro - Mac Quick Start Guide

> **macOS-specific setup and usage instructions**

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **macOS 10.15+** (Catalina or later)
- **Python 3.8+** installed
  ```bash
  python3 --version  # Check version
  ```
- **Node.js 16+** and npm
  ```bash
  node --version     # Check version
  npm --version
  ```
- **Homebrew** (recommended for installing dependencies)
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```

### Installing Python & Node (if needed):

```bash
# Install Python via Homebrew
brew install python3

# Install Node.js via Homebrew
brew install node

# Verify installations
python3 --version
node --version
npm --version
```

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Automated Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/AkshatTm/TRIAL-OS-CA-term-paper-Task-Manager-Pro.git
cd TRIAL-OS-CA-term-paper-Task-Manager-Pro

# 2. Make scripts executable (Mac-specific step)
chmod +x setup.sh start.sh

# 3. Run setup script
./setup.sh

# 4. Start the application
./start.sh
```

**That's it!** The app will prompt you to choose between Web Browser or Electron Desktop mode.

---

### Option 2: Manual Setup

```bash
# 1. Clone the repository
git clone https://github.com/AkshatTm/TRIAL-OS-CA-term-paper-Task-Manager-Pro.git
cd TRIAL-OS-CA-term-paper-Task-Manager-Pro

# 2. Install Backend Dependencies
cd backend
pip3 install -r requirements.txt
cd ..

# 3. Install Frontend Dependencies
cd frontend
npm install
cd ..
```

**Run the application:**

```bash
# Terminal 1 - Start Backend
cd backend
python3 main.py

# Terminal 2 - Start Frontend (choose one)
cd frontend
npm run electron-dev    # For Desktop App
# OR
npm run dev            # For Web Browser (http://localhost:5173)
```

---

## 🔑 Mac-Specific Differences

### 1. **Permission Issues**

Mac requires executable permissions for shell scripts:

```bash
# Make scripts executable (one-time setup)
chmod +x setup.sh start.sh
```

### 2. **Python Command**

Use `python3` instead of `python`:

```bash
# Mac
python3 main.py

# NOT: python main.py (might use Python 2.x)
```

### 3. **Process Paths**

- **Mac disk path:** `/` (root)
- **Windows:** `C:\`

The app automatically detects this.

### 4. **Protected Processes**

Mac protects system processes differently than Windows. You may need to:

```bash
# Run with sudo for system-level process management
sudo python3 main.py  # Backend
```

**⚠️ Note:** Running with `sudo` is NOT recommended for normal use. Only use for testing system process management.

### 5. **Electron App Behavior**

On Mac, closing the last window doesn't quit the app (standard Mac behavior):

- Use `Cmd + Q` to fully quit
- Or quit from the menu bar

---

## 🛠️ Troubleshooting Mac Issues

### Issue 1: "Permission Denied" when running scripts

**Error:**
```bash
zsh: permission denied: ./setup.sh
```

**Fix:**
```bash
chmod +x setup.sh start.sh
```

---

### Issue 2: Python command not found

**Error:**
```bash
python: command not found
```

**Fix:**
```bash
# Use python3 instead
python3 --version

# Or create an alias (add to ~/.zshrc or ~/.bash_profile)
echo "alias python=python3" >> ~/.zshrc
source ~/.zshrc
```

---

### Issue 3: pip3 not found

**Fix:**
```bash
# Install pip for Python 3
python3 -m ensurepip --upgrade

# Or via Homebrew
brew install python3
```

---

### Issue 4: Node/npm not found

**Fix:**
```bash
# Install via Homebrew
brew install node

# Verify
node --version
npm --version
```

---

### Issue 5: Port 8000 already in use

**Error:**
```
ERROR: [Errno 48] Address already in use
```

**Fix:**
```bash
# Find and kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
cd backend
uvicorn main:app --host 0.0.0.0 --port 8001
```

---

### Issue 6: Cannot access processes (Access Denied)

**Cause:** macOS restricts access to some system processes

**Fix:**
```bash
# Grant Terminal/iTerm Full Disk Access
# 1. Go to System Preferences → Security & Privacy → Privacy
# 2. Select "Full Disk Access"
# 3. Click the lock to make changes
# 4. Add your terminal app (Terminal.app or iTerm.app)
# 5. Restart terminal
```

---

### Issue 7: Electron app won't start

**Error:**
```
Error: Electron failed to install correctly
```

**Fix:**
```bash
cd frontend
rm -rf node_modules
npm cache clean --force
npm install
npm run electron-dev
```

---

## 🎯 Mac-Specific Features

### 1. **Native macOS Menu Bar**

The Electron app integrates with macOS menu bar:
- Standard keyboard shortcuts work (`Cmd+Q`, `Cmd+W`)
- Native notifications support

### 2. **Spotlight Integration**

Add to Spotlight for quick launch:
```bash
# Create alias in Applications folder
cd frontend
npm run build
# App will be in dist/mac/Task Manager Pro.app
```

### 3. **Activity Monitor Integration**

Task Manager Pro shows similar info to macOS Activity Monitor but with:
- Web-based interface
- Real-time API
- Custom filtering and sorting
- Process management via REST API

---

## 📊 Performance Notes for Mac

### Resource Usage:
- **Backend:** ~50MB RAM, ~1% CPU (idle)
- **Frontend (Electron):** ~150MB RAM, ~2% CPU (idle)
- **Frontend (Browser):** ~80MB RAM, ~1% CPU (idle)

### Optimization Tips:
```bash
# Use browser mode for lower memory usage
npm run dev  # Instead of npm run electron-dev

# Close dev tools in production
# Remove this line from electron.js:
# win.webContents.openDevTools();
```

---

## 🔐 Security Considerations

### macOS Gatekeeper

If you build the Electron app, Mac will warn about unsigned apps:

```bash
# To allow the app
# Right-click → Open (first time only)
# Or in Terminal:
xattr -cr "/path/to/Task Manager Pro.app"
```

### Process Management Permissions

- Some processes require root access
- Use `sudo` only when necessary
- Normal user processes work without sudo

---

## 🚦 Quick Commands Reference

```bash
# Setup
chmod +x setup.sh start.sh    # Make executable
./setup.sh                     # Install dependencies

# Run (Automated)
./start.sh                     # Start everything

# Run (Manual)
python3 backend/main.py        # Backend only
npm --prefix frontend run dev  # Frontend browser mode
npm --prefix frontend run electron-dev  # Frontend desktop

# Stop
Ctrl + C                       # Stop current process
pkill -f "python3 main.py"    # Kill backend
pkill -f "electron"           # Kill electron

# Clean
rm -rf frontend/node_modules   # Clean node modules
rm -rf backend/__pycache__     # Clean Python cache
```

---

## 📱 Platform-Specific API Differences

The backend automatically handles Mac-specific differences:

| Feature | Windows | macOS | Handled By |
|---------|---------|-------|------------|
| Disk Path | `C:\` | `/` | `platform.system()` |
| Process Attributes | Full set | Mac subset | Conditional loading |
| File Descriptors | ❌ | ✅ `num_fds` | Platform check |
| I/O Priority | `ionice` | Limited | Linux-only feature |
| Process Nice | Limited | ✅ Full support | Platform check |

---

## 🎓 Next Steps

Once running, explore:

1. **📖 [Architecture Documentation](./03_ARCHITECTURE.md)** - Understand the technical design
2. **🎯 [How It Works](./04_HOW_IT_WORKS.md)** - Deep dive into implementation
3. **📊 [Diagrams](./05_DIAGRAMS.md)** - Visual architecture overview
4. **🔧 [Troubleshooting Guide](./07_TROUBLESHOOTING.md)** - Common issues & solutions

---

## 💡 Mac Pro Tips

### 1. **Create a Launch Alias**

Add to `~/.zshrc` or `~/.bash_profile`:

```bash
alias taskmanager='cd ~/path/to/task-manager-pro && ./start.sh'
```

Then just type `taskmanager` from anywhere!

### 2. **Use iTerm2 Split Panes**

```bash
# Split horizontally: Cmd + Shift + D
# Split vertically: Cmd + D
# Run backend in one pane, frontend in another
```

### 3. **Background Mode**

```bash
# Run backend in background
cd backend
nohup python3 main.py > /dev/null 2>&1 &

# Run frontend in background
cd frontend
nohup npm run dev > /dev/null 2>&1 &

# View running processes
ps aux | grep "python3 main.py"
ps aux | grep "npm"
```

### 4. **Auto-Start on Login**

Create a Launch Agent:

```bash
# Create plist file
nano ~/Library/LaunchAgents/com.taskmanager.backend.plist

# Add this content:
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.taskmanager.backend</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/python3</string>
        <string>/path/to/backend/main.py</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>

# Load the agent
launchctl load ~/Library/LaunchAgents/com.taskmanager.backend.plist
```

---

## 🆘 Need Help?

- **Issues:** Check [Troubleshooting Guide](./07_TROUBLESHOOTING.md)
- **Questions:** See [Documentation Index](./00_DOCUMENTATION_INDEX.md)
- **Bugs:** Open an issue on GitHub
- **Contributing:** See [Contributing Guide](./08_CONTRIBUTING.md)

---

## ✨ Enjoy Task Manager Pro on Mac!

**Happy Monitoring! 🚀**
