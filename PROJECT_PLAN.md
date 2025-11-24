# Real-Time Process Monitoring Dashboard
## Operating System Project Plan

**Course**: Operating Systems  
**Year**: 2nd Year B.Tech CSE  
**Project Type**: Real-Time System Monitoring & Management Tool  
**Date**: November 2024

---

## 📋 Problem Statement

Create a graphical dashboard that displays real-time information about process states, CPU usage, and memory consumption. The tool should allow administrators to manage processes efficiently and identify potential issues promptly.

---

## 🎯 Project Objectives

1. **Real-Time Monitoring**: Display live system metrics (CPU, Memory, Process States)
2. **Process Management**: Allow administrators to manage processes (kill, pause, resume)
3. **Visual Dashboard**: Create an intuitive graphical interface
4. **Performance Analysis**: Identify resource-intensive processes
5. **System Health**: Provide alerts for potential issues

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (v18+)
- **UI Library**: Material-UI (MUI) or Chakra UI
- **Charts/Visualization**: 
  - Chart.js with react-chartjs-2
  - Recharts (alternative)
- **State Management**: React Context API or Redux
- **Real-time Updates**: Socket.IO Client or Polling with Axios
- **Styling**: Tailwind CSS or CSS Modules

### Backend
- **Language**: Python (v3.8+)
- **Framework**: Flask or FastAPI
- **Real-time Communication**: 
  - Socket.IO (Flask-SocketIO)
  - WebSocket support
- **System Monitoring Libraries**:
  - `psutil` - Cross-platform process and system utilities
  - `GPUtil` - GPU monitoring (optional)
- **API Documentation**: Swagger/OpenAPI (with FastAPI)

### Development Tools
- **Version Control**: Git & GitHub
- **Package Managers**: 
  - npm/yarn (Frontend)
  - pip/poetry (Backend)
- **Development**: 
  - VS Code
  - React Developer Tools
  - Postman (API testing)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  ┌──────────────┬──────────────┬─────────────────────┐ │
│  │  Dashboard   │   Process    │   System Stats      │ │
│  │  Overview    │   Manager    │   Graphs/Charts     │ │
│  └──────────────┴──────────────┴─────────────────────┘ │
│                          ↕                               │
│                  Socket.IO / REST API                    │
│                          ↕                               │
│                  Python Backend (Flask/FastAPI)          │
│  ┌──────────────┬──────────────┬─────────────────────┐ │
│  │   API        │   WebSocket  │   Process           │ │
│  │   Routes     │   Server     │   Controller        │ │
│  └──────────────┴──────────────┴─────────────────────┘ │
│                          ↕                               │
│                      psutil Library                      │
│                          ↕                               │
│                   Operating System                       │
│            (Process, CPU, Memory, Disk, Network)         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Features Breakdown

### 1. Dashboard Overview
- **System Summary Card**
  - Total CPU Usage (%)
  - Total Memory Usage (GB/%)
  - Disk Usage
  - Network I/O
  - System Uptime
  - Active Processes Count

### 2. Real-Time Metrics
- **CPU Monitoring**
  - Overall CPU usage
  - Per-core CPU usage
  - CPU frequency
  - Historical graph (last 60 seconds)

- **Memory Monitoring**
  - RAM usage (used/available/total)
  - Swap memory usage
  - Memory percentage
  - Real-time graph

### 3. Process Management
- **Process List Table**
  - PID (Process ID)
  - Name
  - User
  - CPU % usage
  - Memory % usage
  - Status (Running, Sleeping, Zombie, etc.)
  - Threads count
  - Start time
  
- **Process Actions**
  - Kill process
  - Terminate gracefully
  - Suspend/Resume (if supported)
  - View detailed process info
  - Sort by CPU/Memory/PID
  - Search/Filter processes

### 4. Alerts & Notifications
- High CPU usage alert (>80%)
- High Memory usage alert (>85%)
- Zombie process detection
- Process crash notifications

### 5. Additional Features (Optional/Advanced)
- Dark/Light theme toggle
- Export data to CSV
- Process tree visualization
- Historical data analysis
- Disk I/O monitoring
- Network monitoring per process
- Auto-refresh interval configuration

---

## 📁 Project Structure

```
os-process-monitor/
│
├── frontend/                    # React Application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   ├── SystemOverview.jsx
│   │   │   │   ├── CPUChart.jsx
│   │   │   │   ├── MemoryChart.jsx
│   │   │   │   └── Dashboard.jsx
│   │   │   │
│   │   │   ├── ProcessManager/
│   │   │   │   ├── ProcessTable.jsx
│   │   │   │   ├── ProcessRow.jsx
│   │   │   │   ├── ProcessDetails.jsx
│   │   │   │   └── ProcessActions.jsx
│   │   │   │
│   │   │   ├── Common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Alert.jsx
│   │   │   │   └── LoadingSpinner.jsx
│   │   │   │
│   │   │   └── Charts/
│   │   │       ├── LineChart.jsx
│   │   │       ├── PieChart.jsx
│   │   │       └── BarChart.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js              # API calls
│   │   │   └── socket.js           # Socket.IO connection
│   │   │
│   │   ├── context/
│   │   │   └── SystemContext.jsx   # Global state
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSystemData.js
│   │   │   └── useProcesses.js
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.js       # Data formatting
│   │   │   └── constants.js
│   │   │
│   │   ├── styles/
│   │   │   └── App.css
│   │   │
│   │   ├── App.jsx
│   │   └── index.js
│   │
│   ├── package.json
│   └── README.md
│
├── backend/                     # Python Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # Flask/FastAPI app initialization
│   │   │
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── system.py       # System info endpoints
│   │   │   └── process.py      # Process management endpoints
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── monitor.py      # System monitoring logic
│   │   │   └── process_manager.py  # Process operations
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py      # Data models/schemas
│   │   │
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── helpers.py
│   │   │
│   │   └── websocket/
│   │       ├── __init__.py
│   │       └── handlers.py     # WebSocket event handlers
│   │
│   ├── requirements.txt
│   ├── config.py
│   └── README.md
│
├── docs/                        # Documentation
│   ├── API.md
│   ├── SETUP.md
│   └── DEPLOYMENT.md
│
├── tests/                       # Testing
│   ├── frontend/
│   └── backend/
│
├── .gitignore
├── README.md
└── PROJECT_PLAN.md             # This file
```

---

## 🔌 API Endpoints Design

### REST API Endpoints

#### System Information
```
GET /api/system/info
Response: {
  "cpu": {
    "percent": 45.2,
    "count": 8,
    "frequency": 2400.0
  },
  "memory": {
    "total": 16000000000,
    "available": 8000000000,
    "percent": 50.0,
    "used": 8000000000
  },
  "disk": {
    "total": 500000000000,
    "used": 250000000000,
    "free": 250000000000,
    "percent": 50.0
  },
  "uptime": 86400,
  "boot_time": 1700000000
}
```

#### CPU Stats
```
GET /api/system/cpu
Response: {
  "overall": 45.2,
  "per_core": [40.0, 42.5, 48.3, 46.1, 44.0, 43.2, 47.8, 45.5],
  "frequency": {
    "current": 2400.0,
    "min": 800.0,
    "max": 3200.0
  }
}
```

#### Memory Stats
```
GET /api/system/memory
Response: {
  "virtual": {
    "total": 16000000000,
    "available": 8000000000,
    "used": 8000000000,
    "percent": 50.0
  },
  "swap": {
    "total": 2000000000,
    "used": 500000000,
    "free": 1500000000,
    "percent": 25.0
  }
}
```

#### Process List
```
GET /api/processes
Query Params: ?sort=cpu&order=desc&limit=50
Response: {
  "processes": [
    {
      "pid": 1234,
      "name": "chrome",
      "username": "admin",
      "status": "running",
      "cpu_percent": 25.5,
      "memory_percent": 15.2,
      "num_threads": 24,
      "create_time": 1700000000
    },
    ...
  ],
  "total": 150
}
```

#### Process Details
```
GET /api/processes/{pid}
Response: {
  "pid": 1234,
  "name": "chrome",
  "exe": "/usr/bin/chrome",
  "cwd": "/home/user",
  "username": "admin",
  "status": "running",
  "cpu_percent": 25.5,
  "memory_percent": 15.2,
  "memory_info": {
    "rss": 244723712,
    "vms": 1073741824
  },
  "num_threads": 24,
  "create_time": 1700000000,
  "cmdline": ["chrome", "--flag"],
  "connections": [],
  "open_files": []
}
```

#### Process Management
```
POST /api/processes/{pid}/kill
Response: {
  "success": true,
  "message": "Process killed successfully"
}

POST /api/processes/{pid}/terminate
Response: {
  "success": true,
  "message": "Process terminated successfully"
}

POST /api/processes/{pid}/suspend
Response: {
  "success": true,
  "message": "Process suspended successfully"
}

POST /api/processes/{pid}/resume
Response: {
  "success": true,
  "message": "Process resumed successfully"
}
```

### WebSocket Events

#### Client → Server
- `connect` - Establish connection
- `subscribe_updates` - Subscribe to real-time updates
- `unsubscribe_updates` - Unsubscribe from updates

#### Server → Client
- `system_update` - System metrics update (every 1-2 seconds)
- `process_update` - Process list update (every 2-3 seconds)
- `alert` - System alert/warning
- `error` - Error message

---

## 🔧 Implementation Plan

### Phase 1: Backend Development (Week 1)
**Day 1-2: Setup & Basic API**
- [ ] Initialize Python project
- [ ] Install dependencies (Flask/FastAPI, psutil, flask-socketio)
- [ ] Create basic project structure
- [ ] Implement system info endpoint
- [ ] Test with psutil library

**Day 3-4: Process Management**
- [ ] Implement process listing endpoint
- [ ] Implement process details endpoint
- [ ] Implement process management actions (kill, terminate)
- [ ] Add error handling and validation
- [ ] Test all endpoints

**Day 5-7: WebSocket Implementation**
- [ ] Set up Socket.IO server
- [ ] Implement real-time system updates
- [ ] Implement real-time process updates
- [ ] Add rate limiting and optimization
- [ ] Test WebSocket connections

### Phase 2: Frontend Development (Week 2)
**Day 1-2: Setup & Basic UI**
- [ ] Initialize React project (Vite or Create React App)
- [ ] Install dependencies (MUI, Chart.js, Socket.IO client)
- [ ] Create basic layout (Header, Sidebar)
- [ ] Set up routing
- [ ] Create API service layer

**Day 3-4: Dashboard Components**
- [ ] System Overview component
- [ ] CPU monitoring chart
- [ ] Memory monitoring chart
- [ ] Connect to backend API
- [ ] Implement real-time updates

**Day 5-7: Process Manager**
- [ ] Process table component
- [ ] Process actions (kill, terminate)
- [ ] Process details modal
- [ ] Search and filter functionality
- [ ] Sort functionality

### Phase 3: Integration & Enhancement (Week 3)
**Day 1-2: Integration**
- [ ] Connect all frontend components to backend
- [ ] Test WebSocket real-time updates
- [ ] Fix bugs and issues
- [ ] Optimize performance

**Day 3-4: Polish & Features**
- [ ] Add alerts and notifications
- [ ] Implement theme toggle
- [ ] Add loading states
- [ ] Error handling UI
- [ ] Responsive design

**Day 5-7: Testing & Documentation**
- [ ] Write API documentation
- [ ] Create user guide
- [ ] Test on different platforms (Windows, Linux, macOS)
- [ ] Performance testing
- [ ] Prepare demo presentation

---

## 📦 Dependencies

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@mui/material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "socket.io-client": "^4.7.0",
    "axios": "^1.6.0",
    "date-fns": "^2.30.0"
  }
}
```

### Backend (requirements.txt)
```
Flask==3.0.0
flask-cors==4.0.0
flask-socketio==5.3.6
python-socketio==5.10.0
psutil==5.9.6
pydantic==2.5.0
python-dotenv==1.0.0
```

Alternative with FastAPI:
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-socketio==5.10.0
psutil==5.9.6
pydantic==2.5.0
python-dotenv==1.0.0
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- npm or yarn
- pip

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app/main.py
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🎨 UI Design Considerations

### Color Scheme
- Primary: Blue (#1976d2)
- Secondary: Green (#4caf50)
- Warning: Orange (#ff9800)
- Danger: Red (#f44336)
- Background: Light gray (#f5f5f5) / Dark (#121212)

### Key Metrics Display
- Large numbers for CPU/Memory percentages
- Color-coded status indicators
- Progress bars for usage metrics
- Line charts for historical data
- Tables for process lists

### Responsive Design
- Desktop: Full dashboard with sidebar
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation, stacked cards

---

## 🔒 Security Considerations

1. **Authentication** (Optional but recommended)
   - Basic authentication for admin actions
   - JWT tokens for API access

2. **Process Management Permissions**
   - Only allow killing user's own processes
   - Require elevated permissions for system processes

3. **CORS Configuration**
   - Restrict to specific origins in production

4. **Rate Limiting**
   - Limit API requests to prevent abuse
   - Throttle WebSocket updates

5. **Input Validation**
   - Validate all PID inputs
   - Sanitize process search queries

---

## 🧪 Testing Strategy

### Backend Testing
- Unit tests for psutil wrapper functions
- Integration tests for API endpoints
- WebSocket connection tests
- Cross-platform compatibility tests

### Frontend Testing
- Component unit tests (Jest + React Testing Library)
- Integration tests
- UI/UX testing
- Browser compatibility testing

---

## 📈 Performance Optimization

1. **Backend**
   - Cache system info for short intervals
   - Limit process list size (pagination)
   - Optimize psutil calls
   - Use async operations where possible

2. **Frontend**
   - Implement virtual scrolling for large process lists
   - Debounce search inputs
   - Optimize chart re-renders
   - Lazy load components
   - Memoize expensive calculations

3. **WebSocket**
   - Configurable update intervals
   - Only send changed data
   - Compress large payloads

---

## 📝 OS Concepts Demonstrated

This project demonstrates understanding of:

1. **Process Management**
   - Process states (Running, Sleeping, Zombie, etc.)
   - Process lifecycle
   - Process control (creation, termination)
   - Process attributes (PID, PPID, priority)

2. **CPU Scheduling**
   - CPU utilization monitoring
   - Multi-core processing
   - Process CPU time

3. **Memory Management**
   - Virtual memory
   - Physical memory (RAM)
   - Swap space
   - Memory allocation per process

4. **System Calls**
   - Process control system calls
   - Information maintenance system calls

5. **Inter-Process Communication**
   - Real-time data communication
   - Client-server architecture

---

## 🎓 Learning Outcomes

By completing this project, you will:
- Understand OS-level process management
- Learn real-time system monitoring
- Gain experience with full-stack development
- Master React.js and Python integration
- Implement WebSocket for real-time updates
- Work with system-level APIs (psutil)
- Create professional dashboards
- Practice DevOps and deployment

---

## 📚 Resources & References

### Documentation
- [psutil Documentation](https://psutil.readthedocs.io/)
- [React Documentation](https://react.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Material-UI Documentation](https://mui.com/)

### Tutorials
- Operating System concepts (Process management)
- WebSocket implementation guide
- React performance optimization
- Python psutil library examples

---

## 🎯 Evaluation Criteria

### Functionality (40%)
- Real-time monitoring works correctly
- Process management features functional
- Accurate data display
- Error handling

### User Interface (20%)
- Clean, intuitive design
- Responsive layout
- Good visualization of data
- User-friendly interactions

### Technical Implementation (25%)
- Code quality and organization
- Proper architecture
- Performance optimization
- Security considerations

### Documentation (10%)
- Clear README
- API documentation
- Code comments
- Setup instructions

### Presentation (5%)
- Demo quality
- Explanation of concepts
- Q&A handling

---

## 🚧 Future Enhancements

1. **Advanced Features**
   - Historical data storage (database)
   - Process scheduling insights
   - CPU affinity management
   - Network monitoring per process
   - GPU monitoring

2. **Analytics**
   - Generate reports
   - Trend analysis
   - Predictive alerts
   - Resource usage patterns

3. **Multi-System Monitoring**
   - Monitor multiple machines
   - Centralized dashboard
   - Remote process management

4. **Container Support**
   - Docker container monitoring
   - Kubernetes integration

---

## 📞 Support & Collaboration

- **Git Repository**: [OS-CA-Real-Time-Process-Monitoring-Dashboard](https://github.com/AkshatTm/OS-CA-Real-Time-Process-Monitoring-Dashboard)
- **Issues**: Track bugs and features on [GitHub Issues](https://github.com/AkshatTm/OS-CA-Real-Time-Process-Monitoring-Dashboard/issues)
- **Wiki**: Additional documentation
- **Discussions**: Q&A and ideas

---

## ✅ Checklist

### Before Starting
- [ ] Read all sections of this plan
- [ ] Install required software (Node.js, Python)
- [ ] Set up development environment
- [x] Create Git repository: https://github.com/AkshatTm/OS-CA-Real-Time-Process-Monitoring-Dashboard
- [ ] Clone the repository locally
- [ ] Understand OS concepts (processes, CPU, memory)

### During Development
- [ ] Follow the implementation plan
- [ ] Test frequently
- [ ] Commit code regularly
- [ ] Document as you go
- [ ] Keep track of challenges faced

### Before Submission
- [ ] All features working
- [ ] Code is clean and commented
- [ ] Documentation complete
- [ ] Tested on target platform
- [ ] Demo prepared
- [ ] Presentation ready

---

## 📅 Timeline Summary

| Week | Focus | Deliverables |
|------|-------|--------------|
| Week 1 | Backend Development | Working API + WebSocket server |
| Week 2 | Frontend Development | Complete React dashboard |
| Week 3 | Integration & Polish | Final tested application |

**Total Duration**: 3 weeks (adjustable based on complexity and requirements)

---

## 💡 Tips for Success

1. **Start Simple**: Get basic functionality working first, then add features
2. **Test Early**: Test each component as you build it
3. **Use Version Control**: Commit frequently with meaningful messages
4. **Ask for Help**: Consult documentation and seek guidance when stuck
5. **Time Management**: Stick to the timeline but be flexible
6. **Code Quality**: Write clean, readable code with comments
7. **Regular Backups**: Keep your work backed up
8. **Documentation**: Document as you code, not at the end

---

## 📄 License

This is an educational project for academic purposes.

---

**Good luck with your Operating System project! 🚀**

*Remember: The goal is not just to build a working application, but to understand the operating system concepts behind it.*
