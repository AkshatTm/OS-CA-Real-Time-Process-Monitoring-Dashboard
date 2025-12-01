# API Reference

Complete documentation for all API endpoints in the Task Manager Pro hybrid system.

## Base URLs

```
Rust Backend:   http://localhost:8000
Python Backend: http://localhost:8001
Frontend:       http://localhost:5173
```

---

## Rust Backend API (Port 8000)

High-performance endpoints for system stats, GPU monitoring, and process control.

### System Statistics

#### GET /api/stats

Get comprehensive system statistics including CPU, RAM, disk, network, and GPU.

**Response:**

```json
{
  "cpu_usage": 45.2,
  "memory_total": 17179869184,
  "memory_used": 8589934592,
  "memory_percent": 50.0,
  "disk_total": 512110190592,
  "disk_used": 256055095296,
  "disk_percent": 50.0,
  "disk_read": 1073741824,
  "disk_write": 2147483648,
  "network_sent": 5368709120,
  "network_recv": 10737418240,
  "gpu_usage": 35.5,
  "gpu_memory_used": 2048,
  "gpu_memory_total": 8192,
  "gpu_temperature": 65.0
}
```

**Fields:**

| Field              | Type  | Description                            |
| ------------------ | ----- | -------------------------------------- |
| `cpu_usage`        | float | Overall CPU usage (0-100%)             |
| `memory_total`     | int   | Total RAM in bytes                     |
| `memory_used`      | int   | Used RAM in bytes                      |
| `memory_percent`   | float | RAM usage percentage (0-100%)          |
| `disk_total`       | int   | Total disk space in bytes              |
| `disk_used`        | int   | Used disk space in bytes               |
| `disk_percent`     | float | Disk usage percentage (0-100%)         |
| `disk_read`        | int   | Cumulative bytes read from disk        |
| `disk_write`       | int   | Cumulative bytes written to disk       |
| `network_sent`     | int   | Cumulative bytes sent over network     |
| `network_recv`     | int   | Cumulative bytes received over network |
| `gpu_usage`        | float | GPU usage (0-100%), null if no GPU     |
| `gpu_memory_used`  | int   | GPU memory used in MB, null if no GPU  |
| `gpu_memory_total` | int   | Total GPU memory in MB, null if no GPU |
| `gpu_temperature`  | float | GPU temperature in °C, null if no GPU  |

**Performance:** ~5-10ms response time

---

### Process Management

#### POST /api/process/:pid/kill

Terminate a process by PID.

**Requires:** Administrator privileges

**Parameters:**

- `pid` (path) - Process ID to kill

**Request:**

```http
POST /api/process/1234/kill
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Process killed successfully"
}
```

**Error Responses:**

| Status | Body                                                      | Reason                                    |
| ------ | --------------------------------------------------------- | ----------------------------------------- |
| 404    | `{"success": false, "message": "Process not found"}`      | PID doesn't exist                         |
| 403    | `{"success": false, "message": "Permission denied"}`      | Not running as admin or protected process |
| 500    | `{"success": false, "message": "Failed to kill process"}` | System error                              |

**Example Usage:**

```javascript
const response = await axios.post(
  `http://localhost:8000/api/process/1234/kill`
);
```

---

#### GET /api/process/:pid/info

Get detailed information about a specific process.

**Parameters:**

- `pid` (path) - Process ID

**Request:**

```http
GET /api/process/5678/info
```

**Response (200):**

```json
{
  "pid": 5678,
  "name": "chrome.exe",
  "cpu_usage": 12.5,
  "memory": 524288000,
  "status": "Running",
  "path": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "user": "DESKTOP-ABC\\User",
  "threads": 42,
  "handles": 1250
}
```

**Fields:**

| Field       | Type   | Description                               |
| ----------- | ------ | ----------------------------------------- |
| `pid`       | int    | Process ID                                |
| `name`      | string | Process executable name                   |
| `cpu_usage` | float  | Current CPU usage (0-100%)                |
| `memory`    | int    | Memory usage in bytes                     |
| `status`    | string | "Running", "Sleeping", "Idle", etc.       |
| `path`      | string | Full executable path, null if unavailable |
| `user`      | string | Process owner, null if unavailable        |
| `threads`   | int    | Number of threads                         |
| `handles`   | int    | Number of handles (Windows)               |

**Error Response (404):**

```json
{
  "error": "Process not found"
}
```

---

#### POST /api/app/close

Close an application by its window title.

**Requires:** Administrator privileges

**Request Body:**

```json
{
  "title": "Google Chrome"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Application closed successfully"
}
```

**Error Responses:**

| Status | Body                                                           | Reason                 |
| ------ | -------------------------------------------------------------- | ---------------------- |
| 404    | `{"success": false, "message": "Application not found"}`       | No app with that title |
| 403    | `{"success": false, "message": "Permission denied"}`           | Not running as admin   |
| 500    | `{"success": false, "message": "Failed to close application"}` | System error           |

---

## Python Backend API (Port 8001)

Accurate CPU monitoring using psutil.

### Process List

#### GET /api/processes

Get list of all running processes with accurate CPU percentages.

**Response:**

```json
{
  "processes": [
    {
      "pid": 1234,
      "name": "chrome.exe",
      "cpu_percent": 5.2,
      "memory": 524288000,
      "num_threads": 42,
      "status": "running"
    },
    {
      "pid": 5678,
      "name": "code.exe",
      "cpu_percent": 2.1,
      "memory": 268435456,
      "num_threads": 28,
      "status": "running"
    }
  ]
}
```

**Fields:**

| Field         | Type   | Description                              |
| ------------- | ------ | ---------------------------------------- |
| `pid`         | int    | Process ID                               |
| `name`        | string | Process executable name                  |
| `cpu_percent` | float  | **Accurate** CPU usage (0-100%)          |
| `memory`      | int    | Memory usage in bytes                    |
| `num_threads` | int    | Number of threads                        |
| `status`      | string | Process status (running, sleeping, etc.) |

**Performance:** ~50-100ms response time (slower but accurate)

**Note:** CPU percentages are calculated using:

```python
cpu_val = (pinfo.get('cpu_percent') or 0) / num_cpus
```

This provides accurate per-core CPU usage, unlike sysinfo's cumulative percentage.

---

### Application List

#### GET /api/apps

Get grouped list of applications with combined statistics.

**Response:**

```json
{
  "apps": [
    {
      "name": "Google Chrome",
      "pids": [1234, 5678, 9012],
      "cpu_percent": 8.5,
      "memory": 1073741824,
      "num_threads": 112,
      "window_title": "Google Chrome"
    },
    {
      "name": "Visual Studio Code",
      "pids": [3456],
      "cpu_percent": 3.2,
      "memory": 536870912,
      "num_threads": 45,
      "window_title": "Visual Studio Code"
    }
  ]
}
```

**Fields:**

| Field          | Type   | Description                             |
| -------------- | ------ | --------------------------------------- |
| `name`         | string | Application name                        |
| `pids`         | array  | List of all PIDs belonging to this app  |
| `cpu_percent`  | float  | **Accurate** combined CPU usage         |
| `memory`       | int    | Combined memory usage in bytes          |
| `num_threads`  | int    | Total thread count across all processes |
| `window_title` | string | Main window title, null if no window    |

**Performance:** ~100-200ms response time (slower but accurate)

**Grouping Logic:**
Processes are grouped by:

1. Executable name (e.g., all "chrome.exe" processes)
2. Parent-child relationships
3. Window titles for GUI applications

---

## Frontend Integration

### Smart Routing

The frontend intelligently routes requests to the appropriate backend:

**Performance Tab:**

```typescript
// Fast stats from Rust
const { data } = await axios.get(`${RUST_API_URL}/api/stats`);
```

**Processes Tab:**

```typescript
// Accurate CPU from Python
const { data } = await axios.get(`${PYTHON_API_URL}/api/processes`);
```

**Apps Tab:**

```typescript
// Accurate grouped stats from Python
const { data } = await axios.get(`${PYTHON_API_URL}/api/apps`);
```

**Process Control:**

```typescript
// Kill via Rust (requires admin)
await axios.post(`${RUST_API_URL}/api/process/${pid}/kill`);

// Get info from Rust (fast)
await axios.get(`${RUST_API_URL}/api/process/${pid}/info`);
```

### Error Handling

All endpoints use consistent error handling:

```typescript
try {
  const response = await axios.get(url, {
    timeout: 5000,
    headers: { Connection: "close" },
  });
} catch (error) {
  if (error.code === "ECONNREFUSED") {
    // Backend not running
  } else if (error.response?.status === 403) {
    // Permission denied
  } else if (error.response?.status === 404) {
    // Not found
  }
}
```

---

## Rate Limiting

**Current Configuration:**

- Frontend polls every 2 seconds
- No server-side rate limiting
- Concurrent connection limit: 100 (Python)

**Recommendations for Production:**

- Implement WebSocket for real-time updates
- Add rate limiting middleware
- Use connection pooling

---

## CORS Configuration

**Rust Backend:**

```rust
let cors = CorsLayer::new()
    .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
    .allow_methods([Method::GET, Method::POST])
    .allow_headers([CONTENT_TYPE]);
```

**Python Backend:**

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Performance Comparison

| Endpoint                 | Backend | Avg Response Time | Accuracy  |
| ------------------------ | ------- | ----------------- | --------- |
| `/api/stats`             | Rust    | 5-10ms            | Good      |
| `/api/processes`         | Python  | 50-100ms          | Excellent |
| `/api/apps`              | Python  | 100-200ms         | Excellent |
| `/api/process/:pid/kill` | Rust    | <5ms              | N/A       |
| `/api/process/:pid/info` | Rust    | <5ms              | Good      |

**Trade-off Summary:**

- **Rust:** 10-20x faster, slightly less accurate CPU%
- **Python:** Slower, highly accurate CPU% (psutil gold standard)

---

## Example Client Code

### Fetch System Stats

```javascript
const stats = await axios.get("http://localhost:8000/api/stats");
console.log(`CPU: ${stats.data.cpu_usage}%`);
console.log(`RAM: ${stats.data.memory_percent}%`);
console.log(`GPU: ${stats.data.gpu_usage}%`);
```

### Kill a Process

```javascript
try {
  await axios.post(`http://localhost:8000/api/process/1234/kill`);
  console.log("Process terminated");
} catch (error) {
  if (error.response?.status === 403) {
    console.error("Admin rights required");
  }
}
```

### Get Process List

```javascript
const { processes } = await axios.get("http://localhost:8001/api/processes");
processes.forEach((proc) => {
  console.log(`${proc.name}: ${proc.cpu_percent}% CPU`);
});
```

---

## Status Codes

| Code | Meaning             | When It Occurs            |
| ---- | ------------------- | ------------------------- |
| 200  | OK                  | Request succeeded         |
| 403  | Forbidden           | Missing admin privileges  |
| 404  | Not Found           | Process/app doesn't exist |
| 500  | Server Error        | Internal backend error    |
| 503  | Service Unavailable | Backend not running       |

---

## Development Tips

1. **Use browser DevTools Network tab** to inspect API calls
2. **Check response times** - Python should be 50-100ms, Rust <10ms
3. **Test admin operations** using `START_RUST_ADMIN.bat`
4. **Monitor backend logs** for detailed error messages
5. **Use Postman/Insomnia** for API testing outside the frontend
