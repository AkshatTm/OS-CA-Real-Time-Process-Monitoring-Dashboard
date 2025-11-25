# 🏗️ Architecture & Technical Documentation

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [API Design](#api-design)
6. [Frontend Architecture](#frontend-architecture)
7. [Backend Architecture](#backend-architecture)
8. [Security Considerations](#security-considerations)

---

## 🎯 System Architecture

Task Manager Pro follows a **client-server architecture** with three main layers:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Electron App (Desktop) or Web Browser          │   │
│  │  - React UI Components                          │   │
│  │  - State Management                             │   │
│  │  - Real-time Updates                            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  FastAPI Backend Server                         │   │
│  │  - REST API Endpoints                           │   │
│  │  - Request Validation                           │   │
│  │  - Error Handling                               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↕ System Calls
┌─────────────────────────────────────────────────────────┐
│                      System Layer                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Operating System                               │   │
│  │  - Process Management (psutil)                  │   │
│  │  - CPU Monitoring                               │   │
│  │  - Memory Management                            │   │
│  │  - Disk & Network I/O                           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend Stack

| Technology          | Purpose                 | Version |
| ------------------- | ----------------------- | ------- |
| **React**           | UI Framework            | 18.3.1  |
| **Electron**        | Desktop App Framework   | 33.2.0  |
| **Vite**            | Build Tool & Dev Server | 6.0.3   |
| **TailwindCSS**     | CSS Framework           | 3.4.17  |
| **Framer Motion**   | Animation Library       | 11.15.0 |
| **Recharts**        | Data Visualization      | 2.15.0  |
| **Axios**           | HTTP Client             | 1.7.7   |
| **Lucide React**    | Icon Library            | 0.468.0 |
| **React Hot Toast** | Notifications           | 2.4.1   |
| **Zustand**         | State Management        | 5.0.2   |

### Backend Stack

| Technology  | Purpose              | Version |
| ----------- | -------------------- | ------- |
| **Python**  | Programming Language | 3.8+    |
| **FastAPI** | Web Framework        | 0.115.5 |
| **Uvicorn** | ASGI Server          | 0.32.1  |
| **psutil**  | System Monitoring    | 6.1.0   |
| **GPUtil**  | GPU Monitoring       | 1.4.0   |

---

## 🧩 Component Architecture

### Frontend Components Hierarchy

```
App.jsx (Root Component)
├── Toaster (Notifications)
├── Sidebar (Navigation)
│   ├── Dashboard Link
│   ├── Performance Link
│   └── Processes Link
├── Header (Top Bar)
│   ├── Logo
│   └── System Stats Summary
└── Main Content (Dynamic)
    ├── Dashboard Component
    │   ├── Stat Cards (CPU, Memory, Disk, Processes)
    │   ├── CPU History Graph
    │   ├── Memory History Graph
    │   ├── Network Stats
    │   └── System Information
    ├── PerformanceTab Component
    │   ├── CPU Performance Graph
    │   ├── Memory Performance Graph
    │   ├── Disk I/O Graph
    │   ├── CPU Per-Core Chart
    │   └── Network Stats
    └── ProcessList Component
        ├── Search Bar
        ├── Process Table
        │   ├── Sortable Headers
        │   ├── Process Rows
        │   └── Action Buttons
        └── Process Details Modal
            ├── Process Information
            └── Close Button
```

### Backend Module Structure

```
backend/
├── main.py (Main Application)
    ├── FastAPI App Instance
    ├── CORS Middleware
    ├── Utility Functions
    │   ├── get_size()
    │   ├── is_protected_process()
    │   └── get_gpu_info()
    ├── API Endpoints
    │   ├── root()
    │   ├── get_system_stats()
    │   ├── get_processes()
    │   ├── get_process_details()
    │   ├── kill_process()
    │   ├── suspend_process()
    │   └── resume_process()
    └── Server Configuration
```

---

## 🔄 Data Flow

### 1. System Monitoring Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│ Operating│         │  psutil  │         │  FastAPI │         │  React   │
│  System  │────────▶│  Library │────────▶│  Backend │────────▶│ Frontend │
│          │         │          │         │          │         │          │
│ Provides │         │ Collects │         │ Formats  │         │ Displays │
│ System   │         │ & Parses │         │ as JSON  │         │ in UI    │
│ Data     │         │ Data     │         │ via REST │         │          │
└──────────┘         └──────────┘         └──────────┘         └──────────┘
```

**Detailed Steps:**

1. **OS Layer:** Operating system maintains process control blocks, CPU usage counters, memory allocation tables
2. **psutil Layer:** Python library reads system files (`/proc` on Linux, Windows APIs) and system calls
3. **API Layer:** FastAPI endpoint receives request, calls psutil, formats response as JSON
4. **Transport Layer:** HTTP response sent to frontend via Axios
5. **UI Layer:** React component receives data, updates state, triggers re-render with new data

### 2. Process Management Flow

```
User Action (Kill Process)
        ↓
Frontend sends POST request
        ↓
Backend validates request
        ↓
Check if process is protected
        ↓
    ┌───┴───┐
    │       │
Protected  Not Protected
    │       │
    ↓       ↓
  Error    Continue
  403      ↓
        Call psutil.Process(pid).kill()
        ↓
    OS terminates process
        ↓
    Success response 200
        ↓
    Frontend shows notification
        ↓
    Refresh process list
```

### 3. Real-Time Update Cycle

```
Component Mount
        ↓
Initial data fetch
        ↓
    ┌──────────────┐
    │              │
    ↓              │
Fetch system stats │
    ↓              │
Fetch processes    │
    ↓              │
Update UI state    │
    ↓              │
Wait 2 seconds     │
    │              │
    └──────────────┘
    (Repeat cycle)
```

---

## 🌐 API Design

### Base URL

```
http://localhost:8000
```

### Endpoints

#### 1. Root Endpoint

```http
GET /
```

**Response:**

```json
{
  "message": "Task Manager Pro API",
  "version": "1.0.0",
  "endpoints": ["...", "..."]
}
```

#### 2. System Statistics

```http
GET /api/system/stats
```

**Response:**

```json
{
  "timestamp": "2025-11-07T10:30:00",
  "cpu": {
    "percent": 45.2,
    "cores": { "physical": 4, "logical": 8 },
    "frequency": { "current": 2400, "min": 800, "max": 3600 },
    "per_core": [45.0, 50.0, 40.0, 48.0, ...]
  },
  "memory": {
    "total": 17179869184,
    "used": 8589934592,
    "available": 8589934592,
    "percent": 50.0,
    "total_formatted": "16.0 GB",
    "used_formatted": "8.0 GB"
  },
  "disk": {
    "total": 500000000000,
    "used": 250000000000,
    "free": 250000000000,
    "percent": 50.0,
    "io": {
      "read_bytes": 1000000000,
      "write_bytes": 500000000
    }
  },
  "network": {
    "bytes_sent": 1000000000,
    "bytes_recv": 2000000000,
    "packets_sent": 1000000,
    "packets_recv": 1500000
  },
  "gpu": [...],
  "system": {
    "os": "Windows",
    "release": "10",
    "machine": "AMD64",
    "processor": "Intel64 Family 6 Model 142",
    "uptime_seconds": 86400
  }
}
```

#### 3. Process List

```http
GET /api/processes
```

**Response:**

```json
{
  "count": 245,
  "processes": [
    {
      "pid": 1234,
      "name": "chrome.exe",
      "username": "User",
      "cpu_percent": 2.5,
      "memory_percent": 3.2,
      "memory_mb": 512.5,
      "status": "running",
      "threads": 24,
      "create_time": "2025-11-07T08:00:00",
      "protected": false
    }
  ]
}
```

#### 4. Process Details

```http
GET /api/process/{pid}
```

**Path Parameters:**

- `pid` (integer): Process ID

**Response:**

```json
{
  "pid": 1234,
  "name": "chrome.exe",
  "username": "User",
  "status": "running",
  "cpu_percent": 2.5,
  "memory_percent": 3.2,
  "memory_mb": 512.5,
  "num_threads": 24,
  "exe": "C:\\Program Files\\Google\\Chrome\\chrome.exe",
  "cwd": "C:\\Program Files\\Google\\Chrome",
  "cmdline": ["chrome.exe", "--flag"],
  "ppid": 1000,
  "connections": 45,
  "open_files": 12
}
```

#### 5. Kill Process

```http
POST /api/process/{pid}/kill?force=false
```

**Path Parameters:**

- `pid` (integer): Process ID

**Query Parameters:**

- `force` (boolean): Use SIGKILL instead of SIGTERM (default: false)

**Response:**

```json
{
  "success": true,
  "message": "Process chrome.exe (PID: 1234) terminated successfully",
  "force": false
}
```

#### 6. Suspend Process

```http
POST /api/process/{pid}/suspend
```

**Response:**

```json
{
  "success": true,
  "message": "Process 1234 suspended successfully"
}
```

#### 7. Resume Process

```http
POST /api/process/{pid}/resume
```

**Response:**

```json
{
  "success": true,
  "message": "Process 1234 resumed successfully"
}
```

### Error Responses

```json
{
  "detail": "Error message here"
}
```

**Status Codes:**

- `200`: Success
- `403`: Forbidden (protected process)
- `404`: Process not found
- `500`: Internal server error

---

## 🎨 Frontend Architecture

### State Management

**Local Component State (useState):**

- Current selected tab
- System statistics
- Process list
- Loading states
- Modal visibility

**Props Flow:**

```
App.jsx (Parent State)
    ↓
systemStats & processes
    ↓
Child Components (Dashboard, Performance, ProcessList)
    ↓
Render UI based on props
```

### Data Fetching Strategy

**Polling Pattern:**

```javascript
useEffect(() => {
  // Initial fetch
  fetchSystemStats();
  fetchProcesses();

  // Set up interval for real-time updates
  const interval = setInterval(() => {
    fetchSystemStats();
    fetchProcesses();
  }, 2000); // 2 second refresh rate

  // Cleanup on unmount
  return () => clearInterval(interval);
}, []);
```

### Component Rendering Strategy

**Conditional Rendering:**

```javascript
{
  currentTab === "dashboard" && <Dashboard />;
}
{
  currentTab === "performance" && <PerformanceTab />;
}
{
  currentTab === "processes" && <ProcessList />;
}
```

**Animation Strategy:**

```javascript
<AnimatePresence mode="wait">
  <motion.div
    key={currentTab}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    {content}
  </motion.div>
</AnimatePresence>
```

---

## ⚙️ Backend Architecture

### Request Processing Pipeline

```
1. Client Request
        ↓
2. CORS Middleware
        ↓
3. Route Matching
        ↓
4. Request Validation
        ↓
5. Endpoint Handler
        ↓
6. psutil System Calls
        ↓
7. Data Processing
        ↓
8. JSON Serialization
        ↓
9. HTTP Response
```

### Process Protection Mechanism

```python
def is_protected_process(process_name, pid):
    """Check if a process is protected"""
    process_name_lower = process_name.lower()

    # Check against protected list
    for protected in PROTECTED_PROCESSES:
        if protected in process_name_lower:
            return True

    # Protect low PID processes (system)
    if pid <= 10:
        return True

    return False
```

**Protected Processes:**

- `system`, `system idle process`
- `csrss.exe` (Client/Server Runtime)
- `wininit.exe` (Windows Start-Up)
- `services.exe` (Service Control Manager)
- `lsass.exe` (Local Security Authority)
- `explorer.exe` (Windows Shell)
- Processes with PID ≤ 10

### Error Handling Strategy

```python
try:
    # Attempt operation
    proc = psutil.Process(pid)
    proc.terminate()
    return {"success": True}
except psutil.NoSuchProcess:
    raise HTTPException(404, "Process not found")
except psutil.AccessDenied:
    raise HTTPException(403, "Access denied")
except Exception as e:
    raise HTTPException(500, str(e))
```

---

## 🔒 Security Considerations

### 1. Process Protection

- Critical system processes cannot be terminated
- PID validation before operations
- Protected process list maintained

### 2. API Security

- CORS restricted to localhost origins
- Input validation on all endpoints
- Error messages don't expose sensitive info

### 3. Permission Handling

- Graceful degradation when permissions insufficient
- Clear error messages for permission issues
- Recommendation to run with elevated privileges

### 4. Resource Management

- Rate limiting through client-side polling
- Efficient data serialization
- Memory-efficient process iteration

---

## 📊 Performance Optimizations

### Frontend Optimizations

1. **Debounced Search:** Search input debounced to reduce re-renders
2. **Memoization:** Expensive calculations cached
3. **Virtual Scrolling:** For large process lists (if needed)
4. **Lazy Loading:** Components loaded on demand

### Backend Optimizations

1. **Single psutil Scan:** `process_iter()` used instead of multiple `Process()` calls
2. **oneshot() Context:** Batches multiple process attribute queries
3. **Efficient Serialization:** Only required data sent to frontend
4. **Connection Pooling:** HTTP connection reuse

---

## 🔄 Deployment Architecture

### Development Mode

```
Terminal 1: Uvicorn (Backend) → Port 8000
Terminal 2: Vite Dev Server (Frontend) → Port 5173
Terminal 3: Electron → Loads localhost:5173
```

### Production Mode

```
Backend: Standalone Python executable
Frontend: Built static files in Electron app
Electron: Single packaged application
```

---

## 📈 Scalability Considerations

### Current Limitations

- Single server, single client architecture
- No persistent storage
- Real-time updates via polling (not WebSockets)

### Future Enhancements

- WebSocket support for push updates
- Database for historical data
- Multi-user support with authentication
- Remote monitoring capabilities

---

**This architecture provides a solid foundation for a production-ready system monitoring application with clean separation of concerns and modern development practices.**
