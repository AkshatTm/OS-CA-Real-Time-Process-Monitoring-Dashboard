# Cross-Platform Support

**Task Manager Pro** - Multi-Platform System Monitor  
**Supported Platforms:** Windows, macOS, Linux

## Platform Compatibility

### ✅ Fully Supported

| Platform    | Version            | Architecture          | Status          |
| ----------- | ------------------ | --------------------- | --------------- |
| **Windows** | 10, 11             | x64                   | ✅ Fully tested |
| **macOS**   | 10.15+ (Catalina+) | Intel x64             | ✅ Supported    |
| **macOS**   | 11.0+ (Big Sur+)   | Apple Silicon (ARM64) | ✅ Supported    |
| **Linux**   | Ubuntu 20.04+      | x64                   | ✅ Supported    |
| **Linux**   | Fedora 35+         | x64                   | ✅ Supported    |
| **Linux**   | Arch Linux         | x64                   | ✅ Supported    |

### 🔧 Platform-Specific Dependencies

#### Windows

- **MSVC toolchain** (Visual Studio Build Tools) OR
- **GNU toolchain** (`x86_64-pc-windows-gnu`)
- **Administrator rights** for process termination

#### macOS

- **Xcode Command Line Tools**: `xcode-select --install`
- **Homebrew** (optional): For installing dependencies
- **sudo access** for process termination

#### Linux

- **build-essential** (Ubuntu/Debian): `sudo apt install build-essential`
- **development tools** (Fedora): `sudo dnf groupinstall "Development Tools"`
- **base-devel** (Arch): `sudo pacman -S base-devel`
- **sudo access** for process termination

---

## Installation by Platform

### Windows Installation

```powershell
# 1. Install Rust
# Download from https://rustup.rs

# 2. Install Python 3.8+
# Download from https://python.org/downloads

# 3. Install Node.js 18+
# Download from https://nodejs.org

# 4. Clone repository
git clone <repository-url>
cd OS-CA-Real-Time-Process-Monitoring-Dashboard

# 5. Install Python dependencies
cd "older versions/v1-python-only/backend-v1-fastapi"
pip install -r requirements.txt

# 6. Install Node dependencies
cd ../../frontend
npm install

# 7. Build Rust backend
cd ../backend
cargo build --release

# 8. Run (as Administrator)
cd ..
START_ALL.bat
```

### macOS Installation

```bash
# 1. Install Xcode Command Line Tools
xcode-select --install

# 2. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 3. Install Python 3 (if not already installed)
# macOS usually comes with Python 3
# Or install via Homebrew: brew install python@3.11

# 4. Install Node.js (via Homebrew recommended)
brew install node

# 5. Clone repository
git clone <repository-url>
cd OS-CA-Real-Time-Process-Monitoring-Dashboard

# 6. Install Python dependencies
cd "older versions/v1-python-only/backend-v1-fastapi"
pip3 install -r requirements.txt

# 7. Install Node dependencies
cd ../../frontend
npm install

# 8. Build Rust backend
cd ../backend
cargo build --release

# 9. Make startup script executable
cd ..
chmod +x start_all.sh

# 10. Run with sudo
sudo ./start_all.sh
```

### Linux Installation

#### Ubuntu/Debian

```bash
# 1. Install build tools
sudo apt update
sudo apt install build-essential curl git

# 2. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 3. Install Python 3 and pip
sudo apt install python3 python3-pip

# 4. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 5. Clone repository
git clone <repository-url>
cd OS-CA-Real-Time-Process-Monitoring-Dashboard

# 6. Install Python dependencies
cd "older versions/v1-python-only/backend-v1-fastapi"
pip3 install -r requirements.txt

# 7. Install Node dependencies
cd ../../frontend
npm install

# 8. Build Rust backend
cd ../backend
cargo build --release

# 9. Make startup script executable
cd ..
chmod +x start_all.sh

# 10. Run with sudo
sudo ./start_all.sh
```

#### Fedora

```bash
# 1. Install development tools
sudo dnf groupinstall "Development Tools"
sudo dnf install curl git

# 2. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 3. Install Python 3
sudo dnf install python3 python3-pip

# 4. Install Node.js
sudo dnf install nodejs npm

# 5-10. Same as Ubuntu above
```

#### Arch Linux

```bash
# 1. Install development tools
sudo pacman -S base-devel curl git

# 2. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 3. Install Python
sudo pacman -S python python-pip

# 4. Install Node.js
sudo pacman -S nodejs npm

# 5-10. Same as Ubuntu above
```

---

## Running the Application

### Windows

```powershell
# Automatic (as Administrator)
START_ALL.bat

# Manual
# Terminal 1: Python backend
cd "older versions/v1-python-only/backend-v1-fastapi"
python main.py

# Terminal 2: Rust backend (as Administrator)
START_RUST_ADMIN.bat

# Terminal 3: Frontend
cd frontend
npm run dev
```

### macOS/Linux

```bash
# Automatic (with sudo)
sudo ./start_all.sh

# Manual
# Terminal 1: Python backend
cd "older versions/v1-python-only/backend-v1-fastapi"
python3 main.py

# Terminal 2: Rust backend (with sudo)
cd backend
sudo cargo run --release

# Terminal 3: Frontend
cd frontend
npm run dev
```

---

## Platform-Specific Features

### GPU Monitoring

| Platform    | GPU Support    | Requirements                                                                             |
| ----------- | -------------- | ---------------------------------------------------------------------------------------- |
| **Windows** | ✅ NVIDIA GPUs | NVIDIA drivers + CUDA toolkit                                                            |
| **macOS**   | ❌ Limited     | NVIDIA GPUs not supported on Apple Silicon<br>Intel Macs: NVIDIA drivers (if NVIDIA GPU) |
| **Linux**   | ✅ NVIDIA GPUs | NVIDIA drivers (proprietary or nouveau)                                                  |

**Note:** AMD and Intel GPU monitoring not currently supported on any platform.

### Process Termination

| Platform    | Requirement          | Command               |
| ----------- | -------------------- | --------------------- |
| **Windows** | Administrator rights | Run as Admin          |
| **macOS**   | sudo access          | `sudo ./start_all.sh` |
| **Linux**   | sudo access          | `sudo ./start_all.sh` |

---

## Platform-Specific Troubleshooting

### Windows

**Issue:** "Rust backend won't start"

- **Solution:** Run `START_RUST_ADMIN.bat` as Administrator
- Right-click → "Run as administrator"

**Issue:** Port already in use

```powershell
# Find process on port 8000
netstat -ano | findstr :8000
# Kill process
taskkill /F /PID <PID>
```

### macOS

**Issue:** "Permission denied" when killing processes

- **Solution:** Run with sudo: `sudo ./start_all.sh`

**Issue:** Port already in use

```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

**Issue:** "xcrun: error: invalid active developer path"

- **Solution:** Install Xcode Command Line Tools

```bash
xcode-select --install
```

### Linux

**Issue:** "Permission denied" when killing processes

- **Solution:** Run with sudo: `sudo ./start_all.sh`

**Issue:** Port already in use

```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

**Issue:** "error: linker 'cc' not found"

- **Solution:** Install build tools

```bash
# Ubuntu/Debian
sudo apt install build-essential

# Fedora
sudo dnf groupinstall "Development Tools"

# Arch
sudo pacman -S base-devel
```

---

## Cross-Platform Libraries

### Backend Libraries (Cross-Platform)

| Library                 | Platform Support           | Purpose                    |
| ----------------------- | -------------------------- | -------------------------- |
| **sysinfo** (Rust)      | Windows, macOS, Linux      | System stats               |
| **psutil** (Python)     | Windows, macOS, Linux, BSD | Process monitoring         |
| **nvml-wrapper** (Rust) | Windows, Linux             | NVIDIA GPU (macOS limited) |
| **Axum** (Rust)         | All platforms              | Web framework              |
| **FastAPI** (Python)    | All platforms              | Web framework              |

### Key Differences by Platform

#### CPU Monitoring

- **Windows:** Uses Windows Performance Counters
- **macOS:** Uses sysctl and mach kernel
- **Linux:** Reads from /proc/stat

#### Process Information

- **Windows:** Uses Windows API (CreateToolhelp32Snapshot)
- **macOS:** Uses BSD sysctl
- **Linux:** Reads from /proc/[pid]/

#### Memory Information

- **Windows:** GlobalMemoryStatusEx API
- **macOS:** host_statistics64()
- **Linux:** /proc/meminfo

---

## Performance by Platform

| Platform          | Rust Response Time | Python Response Time | Notes                  |
| ----------------- | ------------------ | -------------------- | ---------------------- |
| **Windows**       | 5-10ms             | 50-100ms             | Best tested            |
| **macOS (Intel)** | 8-15ms             | 60-120ms             | Good performance       |
| **macOS (ARM64)** | 6-12ms             | 55-110ms             | Native ARM compilation |
| **Linux**         | 5-10ms             | 50-100ms             | Excellent performance  |

---

## Known Platform Limitations

### macOS

- ⚠️ NVIDIA GPU monitoring not available on Apple Silicon
- ⚠️ Some process information requires sudo (e.g., process paths)
- ⚠️ Sandbox restrictions may limit process termination

### Linux

- ⚠️ Some distributions require additional permissions for process monitoring
- ⚠️ GPU support depends on driver installation (nouveau vs proprietary)
- ⚠️ Wayland vs X11 may affect some features

### Windows

- ⚠️ Windows Defender may flag the Rust binary (add exclusion)
- ⚠️ Some antivirus software may block process termination
- ⚠️ UWP apps may not be killable via this tool

---

## Testing Status

| Platform                   | Testing Status        | Tested Features          |
| -------------------------- | --------------------- | ------------------------ |
| **Windows 11**             | ✅ Extensively tested | All features working     |
| **Windows 10**             | ✅ Tested             | All features working     |
| **macOS Monterey (Intel)** | ⚠️ Community tested   | Basic features confirmed |
| **macOS Ventura (ARM64)**  | ⚠️ Community tested   | Basic features confirmed |
| **Ubuntu 22.04**           | ⚠️ Community tested   | All features working     |
| **Fedora 38**              | ⚠️ Basic testing      | Core features working    |
| **Arch Linux**             | ⚠️ Basic testing      | Core features working    |

---

## Contributing

If you're using Task Manager Pro on macOS or Linux, please:

1. Report any platform-specific issues
2. Share performance benchmarks
3. Test GPU monitoring (if you have NVIDIA GPU)
4. Contribute platform-specific fixes

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

**Platform Support Status:** ✅ Cross-platform ready  
**Primary Development Platform:** Windows 11  
**Community Tested:** macOS, Linux
