# Architecture Overview

Task Manager Pro uses a **hybrid architecture** combining Rust and Python to deliver both speed and accuracy.

## System Design

```
┌─────────────────────────────────────────┐
│         React Frontend (TS)             │
│         Port: 5173                      │
│  - Real-time UI updates (2s interval)  │
│  - TypeScript for type safety           │
└─────────────┬───────────────────────────┘
              │
              ├──────────────┬─────────────┐
              │              │             │
              ▼              ▼             │
    ┌──────────────┐  ┌──────────────┐   │
    │ Rust Backend │  │Python Backend│   │
    │  Port: 8000  │  │  Port: 8001  │   │
    │              │  │              │   │
    │ • Fast stats │  │ • Accurate   │   │
    │ • Disk/Net   │  │   CPU calc   │   │
    │ • GPU data   │  │ • Process    │   │
    │ • Kill ops   │  │   listing    │   │
    └──────────────┘  └──────────────┘   │
              │              │            │
              └──────┬───────┘            │
                     ▼                    │
              ┌──────────────┐            │
              │ Windows OS   │◄───────────┘
              │   (Admin)    │ Direct access
              └──────────────┘ for killing
```

## Why Hybrid Architecture?

### The Problem

- **Rust (sysinfo)**: Fast but inaccurate CPU percentages
- **Python (psutil)**: Accurate CPU but slower performance

### The Solution

Use both! Each backend handles what it does best:

| Feature                       | Backend    | Reason                     |
| ----------------------------- | ---------- | -------------------------- |
| CPU/Memory/Disk/Network Stats | **Rust**   | 10-20x faster              |
| GPU Monitoring (NVIDIA)       | **Rust**   | Native library support     |
| Process Killing               | **Rust**   | Runs with admin privileges |
| Process List                  | **Python** | Accurate CPU percentages   |
| App Grouping                  | **Python** | Accurate CPU percentages   |

## Backend Details

### Rust Backend (Port 8000)

- **Framework**: Axum 0.7
- **Async Runtime**: Tokio 1.48
- **System Monitoring**: sysinfo 0.32
- **GPU**: nvml-wrapper 0.10

**Endpoints:**

```
GET  /api/stats              → System performance stats
POST /api/process/:pid/kill  → Kill a process
POST /api/app/close          → Kill all processes of an app
GET  /api/process/:pid/info  → Get process details
```

### Python Backend (Port 8001)

- **Framework**: FastAPI
- **Server**: Uvicorn
- **Monitoring**: psutil

**Endpoints:**

```
GET /api/processes  → All processes with accurate CPU%
GET /api/apps       → Grouped apps with accurate CPU%
```

### Frontend (Port 5173)

- **Framework**: React 18.3.1
- **Language**: TypeScript 5.x
- **Build**: Vite 6.0.3
- **UI**: Tailwind CSS + Framer Motion

**Smart Routing:**

```typescript
// Stats from Rust (fast)
const stats = await axios.get("http://localhost:8000/api/stats");

// Processes from Python (accurate)
const processes = await axios.get("http://localhost:8001/api/processes");

// Kill via Rust (has admin rights)
await axios.post("http://localhost:8000/api/process/123/kill");
```

## Data Flow

### 1. System Stats (Performance Tab)

```
User opens Performance tab
  → Frontend calls Rust /api/stats
  → Rust reads system with sysinfo
  → Returns: CPU, Memory, Disk, Network, GPU
  → Frontend displays charts/graphs
  → Refresh every 2 seconds
```

### 2. Process List (Processes Tab)

```
User opens Processes tab
  → Frontend calls Python /api/processes
  → Python uses psutil.process_iter()
  → Calculates accurate CPU% per process
  → Returns process list
  → Frontend displays sortable table
  → Refresh every 2 seconds
```

### 3. Kill Process

```
User clicks "End Task"
  → Confirmation modal appears
  → User confirms
  → Frontend calls Rust /api/process/:pid/kill
  → Rust (running as admin) kills process
  → Success/error notification
  → Both process lists refresh
```

## Performance Characteristics

| Operation        | Rust Backend              | Python Backend          |
| ---------------- | ------------------------- | ----------------------- |
| Get system stats | ~1-2ms                    | ~5-10ms                 |
| Get process list | ~10-15ms (inaccurate CPU) | ~20-30ms (accurate CPU) |
| Kill process     | ~1-2ms                    | N/A (not implemented)   |
| Memory usage     | ~15-20MB                  | ~40-50MB                |

## Security Considerations

- **Admin Rights**: Rust backend requires admin to kill processes
- **CORS**: Both backends restrict origins to localhost
- **No Auth**: Designed for local use only
- **Process Protection**: System processes marked as protected

## Scalability

- **Single User**: Optimized for one local user
- **Real-time Updates**: 2-second polling (not WebSockets)
- **Resource Usage**: Minimal - suitable for running 24/7
- **Concurrent Requests**: Both backends handle concurrent API calls

## Technology Choices

### Why Rust?

- **Speed**: Near-native performance
- **Safety**: Memory-safe without GC
- **Concurrency**: Async/await with Tokio
- **GPU Support**: Native NVIDIA bindings

### Why Python?

- **Accuracy**: psutil provides precise CPU calculations
- **Ecosystem**: Rich system monitoring libraries
- **Simplicity**: Fast prototyping for data processing

### Why TypeScript?

- **Type Safety**: Catch errors at compile time
- **Developer Experience**: Better IDE support
- **Maintainability**: Self-documenting code
