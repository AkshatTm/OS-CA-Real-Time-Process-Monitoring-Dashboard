# Task Manager Pro

**Real-Time Process Monitoring Dashboard with Hybrid Architecture**

![Rust](https://img.shields.io/badge/Rust-1.70+-orange?logo=rust)
![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python)
![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![License](https://img.shields.io/badge/License-Educational-green)

A high-performance, modern system monitoring dashboard built with a **hybrid architecture**: Rust for speed, Python for accuracy, and React + TypeScript for a beautiful UI.

## 📚 Documentation

| Document                                       | Description                         |
| ---------------------------------------------- | ----------------------------------- |
| **[QUICKSTART.md](./QUICKSTART.md)**           | Get started in 5 minutes ⚡         |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)**       | Hybrid system design & rationale 🏗️ |
| **[API_REFERENCE.md](./API_REFERENCE.md)**     | Complete API documentation 📖       |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Common issues & solutions 🔧        |
| **[older versions/](./older%20versions/)**     | Project evolution history 📜        |

---

## ✨ Features

### 🚀 **Hybrid Performance**

- **Rust Backend** - Lightning-fast system stats (5-10ms response)
- **Python Backend** - Accurate CPU monitoring with psutil
- **TypeScript Frontend** - Type-safe, modern React UI
- **Real-Time Updates** - 2-second refresh interval

### 📊 **System Monitoring**

- CPU usage (overall and per-core)
- Memory statistics (RAM usage)
- Disk I/O and storage information
- Network activity (bytes sent/received)
- **GPU Monitoring** - NVIDIA GPU stats (usage, memory, temperature)

### 🔧 **Process Management**

- View all running processes with accurate CPU percentages
- Search and filter by name or PID
- Sort by CPU, memory, name, or status
- **Terminate processes** (requires admin rights)
- Process details modal (PID, threads, handles, path)
- Application grouping (combined stats for multi-process apps)

### 🎨 **Modern UI**

- Dark theme with glassmorphism effects
- Smooth animations (Framer Motion)
- Responsive layout
- Toast notifications for user feedback
- Interactive data tables

---

## 🎯 Problem Statement & Solution

### 📝 Original Requirements
**Create a graphical dashboard that displays real-time information about process states, CPU usage, and memory consumption. The tool should allow administrators to manage processes efficiently and identify potential issues promptly.**

### ✅ How We Solved It
Our hybrid architecture solution exceeds the original requirements:

| Requirement | Our Implementation | Enhancement |
|-------------|-------------------|-------------|
| **Real-time process information** | ✅ 2-second refresh with dual backends | Added GPU monitoring, disk/network stats |
| **Process states display** | ✅ Complete process status tracking | Color-coded status indicators |
| **CPU usage monitoring** | ✅ Accurate per-process CPU percentages | Overall + per-core visualization |
| **Memory consumption tracking** | ✅ Real-time memory usage | Memory percentage + absolute values |
| **Administrator management** | ✅ Process termination with admin rights | Process details, application grouping |
| **Issue identification** | ✅ Sort by CPU/Memory, search/filter | Performance graphs, trend analysis |

**Innovation:** Hybrid Rust + Python architecture for optimal speed + accuracy balance.

---

## 🛠️ Technology Stack

| Layer                  | Technology         | Purpose                          | Why?                               |
| ---------------------- | ------------------ | -------------------------------- | ---------------------------------- |
| **Backend (Speed)**    | Rust + Axum        | Fast stats, GPU, process control | 10-20x faster than Python          |
| **Backend (Accuracy)** | Python + FastAPI   | Accurate CPU percentages         | psutil gold standard               |
| **Frontend**           | React + TypeScript | UI/UX                            | Type safety, component reusability |
| **Build**              | Vite + Cargo       | Fast builds                      | Hot reload, optimized bundling     |
| **Styling**            | Tailwind CSS       | Modern design                    | Utility-first, responsive          |

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed rationale.**

---

## ⚡ Quick Start

### Prerequisites

- **Rust 1.70+** - [Install](https://rustup.rs)
- **Python 3.8+** - [Download](https://python.org/downloads)
- **Node.js 18+** - [Download](https://nodejs.org)
- **Supported OS:** Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+, Fedora, Arch)
- **Administrator/sudo access** (required for process termination)

### One-Command Startup

**Windows:**
```bash
START_ALL.bat
```

**macOS/Linux:**
```bash
chmod +x start_all.sh
./start_all.sh
```

This script:

1. ✅ Starts Python backend (port 8001)
2. ✅ Starts Rust backend with sudo/admin (port 8000)
3. ✅ Starts React frontend (port 5173)

**See [QUICKSTART.md](./QUICKSTART.md) for manual setup and troubleshooting.**

---

## 🏗️ Hybrid Architecture

```
┌─────────────────────────────────────────┐
│   React Frontend (TypeScript)           │
│   http://localhost:5173                 │
│   - Performance Tab → Rust API          │
│   - Processes Tab → Python API          │
│   - Apps Tab → Python API               │
│   - Kill Process → Rust API             │
└────────┬───────────────────┬────────────┘
         │                   │
         ↓                   ↓
┌──────────────────┐  ┌──────────────────┐
│  Rust Backend    │  │  Python Backend  │
│  Port 8000       │  │  Port 8001       │
│  (Axum + Tokio)  │  │  (FastAPI)       │
│                  │  │                  │
│  - System Stats  │  │  - Process List  │
│  - GPU Monitor   │  │  - App List      │
│  - Kill Process  │  │  - Accurate CPU% │
│  - Process Info  │  │                  │
└──────────────────┘  └──────────────────┘
         │                   │
         ↓                   ↓
┌─────────────────────────────────────────┐
│   Operating System (Cross-Platform)     │
│   Windows 10/11 | macOS 10.15+ | Linux  │
│   - sysinfo (Rust - cross-platform)     │
│   - psutil (Python - cross-platform)    │
│   - nvml-wrapper (GPU - NVIDIA only)    │
└─────────────────────────────────────────┘
```

**Why Hybrid?**

- Rust's `sysinfo` CPU% = cumulative (100%+ on multi-core)
- Python's `psutil` CPU% = per-core accurate
- **Solution:** Use both! Rust for speed, Python for accuracy.

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete details.**

---

## 📊 Performance

| Metric         | Rust Backend   | Python Backend       |
| -------------- | -------------- | -------------------- |
| Stats Endpoint | **5-10ms**     | 100-150ms            |
| Process List   | **20-30ms**    | 50-100ms             |
| CPU Accuracy   | Good (95%)     | **Excellent (100%)** |
| Memory Usage   | **15-20 MB**   | 40-60 MB             |
| Admin Required | Yes (kill ops) | No                   |

**Trade-off:** Rust = Fast but less accurate CPU, Python = Slow but accurate CPU  
**Solution:** Hybrid architecture combines both strengths.

---

## 🔑 Key Endpoints

### Rust Backend (Port 8000)

```typescript
GET  /api/stats              // System stats + GPU
GET  /api/process/:pid/info  // Process details
POST /api/process/:pid/kill  // Terminate process (admin)
POST /api/app/close          // Close application (admin)
```

### Python Backend (Port 8001)

```typescript
GET / api / processes; // All processes with accurate CPU%
GET / api / apps; // Grouped apps with combined stats
```

**See [API_REFERENCE.md](./API_REFERENCE.md) for complete documentation.**

---

## 🎯 Use Cases

### Performance Monitoring

Use the **Performance** tab to view:

- Real-time CPU usage graph
- Memory consumption
- Disk read/write stats
- Network activity
- GPU utilization (NVIDIA only)

### Process Analysis

Use the **Processes** tab to:

- Find CPU-intensive processes (accurate percentages from Python)
- Monitor memory hogs
- View process details (PID, threads, handles, path)
- Kill unresponsive processes (admin required)

### Application Management

Use the **Apps** tab to:

- See grouped application stats (e.g., all Chrome processes)
- Monitor multi-process applications
- Close entire applications

---

## 🔧 Troubleshooting

### Common Issues

| Issue                    | Solution                                                                    |
| ------------------------ | --------------------------------------------------------------------------- |
| Port already in use      | **Windows:** `netstat -ano \| findstr :8000` then `taskkill /F /PID <PID>`<br>**macOS/Linux:** `lsof -ti:8000 \| xargs kill -9` |
| Rust backend won't start | **Windows:** Run `START_RUST_ADMIN.bat`<br>**macOS/Linux:** `sudo cargo run --release` |
| Python backend crashes   | Check it's using `host="127.0.0.1"` not `"0.0.0.0"`                         |
| Frontend stuck loading   | Check both backends are running                                             |
| Process killing fails    | **All platforms:** Backend must run with admin/sudo privileges              |
| GPU not detected         | Only NVIDIA GPUs supported (all platforms), install drivers                 |

**See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for complete guide.**

---

## 📂 Project Structure

```
task-manager-pro/
├── backend/                      # Rust backend
│   ├── src/
│   │   └── main.rs              # Axum server + sysinfo
│   ├── Cargo.toml
│   └── Cargo.lock
├── older versions/
│   └── v1-python-only/
│       └── backend-v1-fastapi/   # Python backend
│           ├── main.py          # FastAPI server + psutil
│           └── requirements.txt
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── App.tsx              # Main app with dual backend
│   │   └── components/
│   │       ├── PerformanceTab.tsx
│   │       ├── ProcessList.tsx
│   │       └── AppList.tsx
│   ├── package.json
│   └── tsconfig.json
├── START_ALL.bat                 # One-command startup
├── START_RUST_ADMIN.bat          # Rust backend (admin)
├── QUICKSTART.md
├── ARCHITECTURE.md
├── API_REFERENCE.md
├── TROUBLESHOOTING.md
└── README.md                     # This file
```

---

## 🎓 Educational Value

This project was developed as an **Operating Systems course assignment** and demonstrates key OS concepts while solving the given problem statement.

### Academic Learning Outcomes

1. **Process Management**

   - Process states (running, sleeping, zombie)
   - Process Control Block (PCB) information
   - Process termination via system calls
   - Process scheduling and prioritization

2. **CPU Scheduling**

   - Multi-core CPU utilization
   - Per-process CPU consumption
   - Load balancing visualization
   - Real-time performance monitoring

3. **Memory Management**

   - Virtual vs physical memory
   - Memory allocation tracking
   - Memory usage by process
   - Resource contention

4. **System Resources**
   - Disk I/O operations
   - Network activity monitoring
   - GPU resource management
   - System call interfaces

**Perfect for OS coursework and understanding system internals.**

---

## 🚀 Future Enhancements

- [x] **Cross-platform support** (Windows, macOS, Linux) ✅
- [ ] Historical data storage (database)
- [ ] Export reports (PDF/CSV)
- [ ] Performance alerts/notifications
- [ ] Process priority management
- [ ] Network connections viewer
- [ ] Startup programs manager
- [ ] WebSocket for real-time updates
- [ ] Docker containerization
- [ ] ARM64 support (Apple Silicon)
- [ ] Dark/Light theme toggle

---

## 🎓 Academic Project Information

### 👥 Team Members
- **Akshat Tomar**
- **Kulvinder**  
- **Priyanshu Kamal**

### 📋 Project Details
**Title:** Real-Time Process Monitoring Dashboard

**Problem Statement:**  
Create a graphical dashboard that displays real-time information about process states, CPU usage, and memory consumption. The tool should allow administrators to manage processes efficiently and identify potential issues promptly.

**Course:** Operating Systems  
**Academic Year:** 2025

---

## 🙏 Acknowledgments

### Libraries & Frameworks

- **[sysinfo](https://github.com/GuillaumeGomez/sysinfo)** - Rust system information
- **[psutil](https://github.com/giampaolo/psutil)** - Python system utilities
- **[Axum](https://github.com/tokio-rs/axum)** - Rust web framework
- **[FastAPI](https://fastapi.tiangolo.com/)** - Python web framework
- **[React](https://react.dev/)** - UI library
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - CSS framework
- **[nvml-wrapper](https://github.com/Cldfire/nvml-wrapper)** - NVIDIA GPU monitoring

### Inspiration

- Windows Task Manager
- htop (Linux)
- Activity Monitor (macOS)

---

## 📞 Support

- **Documentation:** See comprehensive docs above
- **Issues:** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Evolution:** Read [older versions/EVOLUTION.md](./older%20versions/) for project history

---

## ⭐ Show Your Support

If you find this project helpful for learning OS concepts:

- ⭐ Star this repository
- 🐛 Report bugs or issues
- 💡 Suggest new features
- 🤝 Contribute improvements
- 📖 Help improve documentation

---

**Task Manager Pro - Academic Project Demonstrating OS Concepts Through High-Performance System Monitoring** 🎓🚀
