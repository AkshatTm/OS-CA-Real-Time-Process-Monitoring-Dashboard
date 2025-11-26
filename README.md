# 🚀 Task Manager Pro

**Project Title:** Real-Time Process Monitoring Dashboard
**Team:** Kulvinder, Priyanshu Kamal, Akshat

A modern, professional **Real-Time Process Monitoring Dashboard** built with **Electron**, **React**, **TailwindCSS**, and **Python FastAPI**. This project demonstrates core Operating System concepts including process management, CPU scheduling, memory management, and system monitoring.

![Task Manager Pro](https://img.shields.io/badge/Status-Production%20Ready-success)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Electron](https://img.shields.io/badge/Electron-33.2-blue)
![License](https://img.shields.io/badge/License-Educational-green)

## 📚 Complete Documentation

**📖 Files are numbered in recommended reading order for beginners!**

| #     | Document                                                  | Description                                |
| ----- | --------------------------------------------------------- | ------------------------------------------ |
| **0** | **[📖 Documentation Index](./00_DOCUMENTATION_INDEX.md)** | **START HERE - Complete navigation guide** |
| **1** | **[Quick Start Guide](./01_QUICKSTART.md)**               | Get started in 5 minutes ⚡                |
| **2** | **[Problem Statement](./02_PROBLEM_STATEMENT.md)**        | Project requirements & objectives 🎯       |
| **3** | **[Architecture](./03_ARCHITECTURE.md)**                  | Technical architecture & design 🏗️         |
| **4** | **[How It Works](./04_HOW_IT_WORKS.md)**                  | Deep dive with explanations 🎓             |
| **5** | **[Visual Diagrams](./05_DIAGRAMS.md)**                   | Flowcharts & visual guides 📊              |
| **6** | **[Project Summary](./06_PROJECT_SUMMARY.md)**            | Complete academic summary 📋               |
| **7** | **[Troubleshooting](./07_TROUBLESHOOTING.md)**            | Common issues & solutions 🔧               |
| **8** | **[Contributing](./08_CONTRIBUTING.md)**                  | Contribution guidelines 🤝                 |

**📖 Recommended Path:** 0 → 1 → 2 → 3 → 4 → 5 (7 for issues, 8 for contributing)

> **💡 Total Documentation: 10 comprehensive files | 4,100+ lines | 180+ KB**  
> **For complete navigation, start with [00_DOCUMENTATION_INDEX.md](./00_DOCUMENTATION_INDEX.md)**

---

## ✨ Features

### 🎨 **Modern UI/UX**

- **Glassmorphism Design** - Translucent cards with backdrop blur effects
- **Dark Theme** - Easy on the eyes with professional color scheme
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Layout** - Adapts to different screen sizes
- **Interactive Charts** - Real-time data visualization

### 📊 **System Monitoring**

- **Real-time CPU Monitoring** - Overall and per-core usage
- **Memory Statistics** - RAM and swap memory tracking
- **Disk Usage** - Storage space and I/O statistics
- **Network Activity** - Bytes sent/received and packet counts
- **System Information** - OS, processor, architecture details
- **Performance Graphs** - Historical data visualization (last 2 minutes)

### 🔧 **Process Management**

- **View All Processes** - Complete list with detailed information
- **Search & Filter** - Quick process lookup
- **Sort by Metrics** - CPU, Memory, PID, Name, Status
- **End Process** - Terminate running processes
- **Suspend/Resume** - Pause and resume processes
- **Process Details** - View detailed information (PID, Memory, Threads, Path, etc.)
- **Status Indicators** - Color-coded process states

### 🎯 **Advanced Features**

- **Auto-refresh** - Updates every 2 seconds
- **Toast Notifications** - User feedback for actions
- **Modal Dialogs** - Detailed process information
- **Keyboard Navigation** - Efficient workflow
- **Error Handling** - Graceful error management
- **REST API** - Backend API for extensibility

## 🛠️ Technology Stack

### Frontend

| Technology    | Purpose       | Version |
| ------------- | ------------- | ------- |
| React         | UI Framework  | 18.3.1  |
| Electron      | Desktop App   | 33.2.0  |
| Vite          | Build Tool    | 6.0.3   |
| TailwindCSS   | Styling       | 3.4.17  |
| Framer Motion | Animations    | 11.15.0 |
| Recharts      | Visualization | 2.15.0  |
| Axios         | HTTP Client   | 1.7.7   |

### Backend

| Technology | Purpose           | Version |
| ---------- | ----------------- | ------- |
| Python     | Language          | 3.8+    |
| FastAPI    | Web Framework     | 0.115.5 |
| Uvicorn    | ASGI Server       | 0.32.1  |
| psutil     | System Monitoring | 6.1.0   |
| GPUtil     | GPU Monitoring    | 1.4.0   |

**📖 Detailed tech stack in [Architecture Documentation](./03_ARCHITECTURE.md)**

---

## ⚡ Quick Start

### Prerequisites

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation & Running

**Windows:**

```bash
# Install dependencies
setup.bat

# Run application
start.bat
```

**Mac/Linux:**

```bash
# Make scripts executable
chmod +x setup.sh start.sh

# Install dependencies
./setup.sh

# Run application
./start.sh
```

**Manual Setup:**

```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**📖 For detailed instructions, see [Quick Start Guide](./01_QUICKSTART.md)**

## 🎓 Educational Value

This project demonstrates key **Operating System concepts**:

### Core OS Concepts Covered

1. **Process Management**

   - Process states (running, sleeping, stopped, zombie)
   - Process Control Block (PCB) information
   - Process creation and termination
   - Parent-child process relationships

2. **CPU Scheduling**

   - CPU utilization monitoring
   - Per-core CPU distribution
   - Process CPU consumption tracking
   - Multi-core processing visualization

3. **Memory Management**

   - Virtual memory concepts
   - Physical vs available memory
   - Memory allocation to processes
   - Swap space utilization

4. **Inter-Process Communication**

   - System calls for process control
   - Signal handling (SIGTERM, SIGKILL)
   - Process suspension and resumption

5. **System Monitoring**
   - Real-time system statistics
   - Disk I/O operations
   - Network activity monitoring
   - Resource utilization tracking

**📖 Learn more in [Problem Statement](./02_PROBLEM_STATEMENT.md) and [How It Works](./04_HOW_IT_WORKS.md)**

---

## 📸 Features Overview

### 🎨 Modern UI/UX

- Glassmorphism design with translucent cards
- Dark theme optimized for extended use
- Smooth animations powered by Framer Motion
- Responsive layout for all screen sizes

### 📊 Real-Time System Monitoring

- CPU usage (overall and per-core)
- Memory statistics (RAM and swap)
- Disk I/O and storage information
- Network activity (bytes sent/received)
- System information panel

### 🔧 Advanced Process Management

- View all running processes with details
- Search and filter by name or PID
- Sort by CPU, memory, name, or status
- Terminate processes safely
- Suspend and resume process execution
- Protected system process safeguards

### 📈 Data Visualization

- Real-time performance graphs
- Historical data (last 2 minutes)
- Color-coded status indicators
- Interactive charts and tables

**📖 See [Architecture Documentation](./03_ARCHITECTURE.md) for technical details**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────┐
│     Frontend (React + Electron)     │
│   - Modern UI with TailwindCSS      │
│   - Real-time data visualization    │
│   - Process management interface    │
└─────────────┬───────────────────────┘
              │ HTTP/REST API
              ↕
┌─────────────────────────────────────┐
│      Backend (Python FastAPI)       │
│   - REST API endpoints              │
│   - Process management logic        │
│   - System statistics aggregation   │
└─────────────┬───────────────────────┘
              │ psutil Library
              ↕
┌─────────────────────────────────────┐
│      Operating System (OS)          │
│   - Process Control Blocks          │
│   - CPU/Memory management           │
│   - System calls                    │
└─────────────────────────────────────┘
```

**📖 Full architecture details in [Architecture Documentation](./03_ARCHITECTURE.md)**

---

## � Platform Support

### ✅ Windows (Fully Supported)

- All features work out of the box
- Full process management capabilities
- GPU monitoring support

### ⚠️ macOS (With Modifications)

- Core features work (90% compatible)
- Process management requires modifications
- GPU monitoring limited
- Requires shell scripts (setup.sh, start.sh)

### 🔄 Linux (Compatible)

- Requires permissions for process management
- Most features supported
- Use shell scripts for setup

**📖 See [Troubleshooting Guide](./07_TROUBLESHOOTING.md) for platform-specific issues**

---

## � API Documentation

### Base URL

```
http://localhost:8000
```

### Key Endpoints

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| GET    | `/api/system/stats`          | Complete system statistics |
| GET    | `/api/processes`             | List all processes         |
| GET    | `/api/process/{pid}`         | Process details            |
| POST   | `/api/process/{pid}/kill`    | Terminate process          |
| POST   | `/api/process/{pid}/suspend` | Suspend process            |
| POST   | `/api/process/{pid}/resume`  | Resume process             |

**Interactive API docs:** http://localhost:8000/docs

**📖 Complete API documentation in [Architecture Documentation](./03_ARCHITECTURE.md)**

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./08_CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**📖 Full guidelines in [Contributing Guide](./08_CONTRIBUTING.md)**

---

## � Troubleshooting

Having issues? Check our comprehensive [Troubleshooting Guide](./07_TROUBLESHOOTING.md).

### Common Issues

- **Port already in use** - Backend or frontend port conflicts
- **Permission denied** - Some actions require elevated privileges (Windows: run PowerShell as Administrator and re-run `start.bat`)
- **Module not found** - Dependencies not installed correctly
- **Blank screen** - Backend not running or connection issues

**📖 Solutions in [Troubleshooting Guide](./07_TROUBLESHOOTING.md)**

---

## 📝 Project Structure

```
task-manager-pro/
├── backend/
│   ├── main.py                 # FastAPI application
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── components/        # React components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PerformanceTab.jsx
│   │   │   └── ProcessList.jsx
│   │   └── styles/            # CSS files
│   ├── electron.js            # Electron configuration
│   └── package.json           # Node dependencies
├── setup.bat / setup.sh       # Setup scripts
├── start.bat / start.sh       # Start scripts
├── QUICKSTART.md              # Quick start guide
├── PROBLEM_STATEMENT.md       # Project requirements
├── ARCHITECTURE.md            # Technical architecture
├── HOW_IT_WORKS.md           # Deep dive & flowcharts
├── TROUBLESHOOTING.md        # Issue resolution
├── CONTRIBUTING.md           # Contribution guide
└── README.md                 # This file
```

---

## 🎯 Future Enhancements

- [ ] Historical data storage with database
- [ ] Export system reports (PDF/CSV)
- [ ] Performance alerts and notifications
- [ ] Process priority management (extended presets and safeguards)
- [ ] Network connections viewer
- [ ] Startup programs manager
- [ ] Temperature monitoring (CPU/GPU)
- [ ] Dark/Light theme toggle
- [ ] System tray integration
- [ ] Multi-language support
- [ ] Electron packaging (electron-builder)
- [ ] Remote monitoring capabilities

**Want to contribute? See [Contributing Guide](./08_CONTRIBUTING.md)**

---

## 📝 License

This project is developed for **educational purposes** as part of an Operating Systems course project.

**Project ID:** 12406898  
**Institution:** [Your Institution Name]  
**Course:** Operating Systems

Free to use for educational and personal purposes. For commercial use, please contact the authors.

---

## 👥 Team

**Team Members:**

- Kulvinder
- Priyanshu Kamal
- Akshat

Built with ❤️ for learning and demonstrating Operating System concepts.

---

## 🙏 Acknowledgments

### Libraries & Frameworks

- **[psutil](https://github.com/giampaolo/psutil)** - Cross-platform system and process utilities
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web framework
- **[React](https://react.dev/)** - JavaScript library for building user interfaces
- **[Electron](https://www.electronjs.org/)** - Build cross-platform desktop apps
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library for React
- **[Recharts](https://recharts.org/)** - Composable charting library

### Inspiration

- Windows Task Manager
- macOS Activity Monitor
- Linux System Monitor (htop, top)

---

## 📞 Support & Contact

- **Documentation:** Check our comprehensive docs above
- **Issues:** Open an issue on GitHub
- **Questions:** Review [Troubleshooting Guide](./07_TROUBLESHOOTING.md)

---

## ⭐ Show Your Support

If you find this project helpful:

- ⭐ Star this repository
- 🐛 Report bugs
- 💡 Suggest new features
- 🤝 Contribute code
- 📖 Improve documentation

---

**Task Manager Pro - Making System Monitoring Beautiful & Accessible** 🚀
