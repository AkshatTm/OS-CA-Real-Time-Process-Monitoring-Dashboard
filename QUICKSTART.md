# Quick Start Guide

**Task Manager Pro** - Academic Operating Systems Course Project

Get our hybrid Rust + Python + TypeScript system monitoring dashboard running in under 5 minutes.

**Team:** Akshat Tomar, Kulvinder, Priyanshu Kamal

## Prerequisites

- **Rust**: Latest stable version ([rustup.rs](https://rustup.rs))
- **Python 3.8+**: With pip installed
- **Node.js 18+**: With npm ([nodejs.org](https://nodejs.org))
- **Supported OS**: 
  - Windows 10/11 (x64)
  - macOS 10.15+ (Intel or Apple Silicon)
  - Linux (Ubuntu 20.04+, Fedora 35+, Arch Linux)
- **Admin/sudo rights**: Required for process termination

## Installation

### 1. Install Dependencies

```bash
# Install Python dependencies
cd backend-v1-fastapi
pip install fastapi uvicorn psutil orjson

# Install Node dependencies
cd ../frontend
npm install
```

### 2. Build Rust Backend

```bash
cd ../backend
cargo build --release
```

## Running the Application

### Option 1: Automatic Startup (Recommended)

**Windows:**
```bash
# Run as Administrator
START_ALL.bat
```

**macOS/Linux:**
```bash
# Make executable (first time only)
chmod +x start_all.sh

# Run the script
./start_all.sh
```

This will:

- Start Python backend (port 8001)
- Start Rust backend (port 8000) with admin/sudo
- Start React frontend (port 5173)
- Open browser automatically

### Option 2: Manual Startup

**Terminal 1 - Python Backend:**

```bash
# Navigate to Python backend
cd "older versions/v1-python-only/backend-v1-fastapi"

# Run server
python main.py
```

**Terminal 2 - Rust Backend:**

*Windows (as Administrator):*
```bash
START_RUST_ADMIN.bat
```

*macOS/Linux:*
```bash
cd backend
sudo cargo run --release
```

**Terminal 3 - Frontend:**

```bash
cd frontend
npm run dev
```

Open http://localhost:5173

## Quick Test

1. **Performance Tab**: View CPU, Memory, Disk, Network, GPU stats
2. **Processes Tab**: See all running processes with accurate CPU%
3. **Apps Tab**: View grouped applications
4. **Try Killing a Process**: Select a process → End Task

## Troubleshooting

| Issue                 | Solution                                             |
| --------------------- | ---------------------------------------------------- |
| Port 8000/8001 in use | Kill existing processes or change ports              |
| Rust backend fails    | Run as Administrator                                 |
| Python backend errors | Install: `pip install fastapi uvicorn psutil orjson` |
| Frontend won't start  | Run: `npm install` then `npm run dev`                |

## Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the hybrid system
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed help
