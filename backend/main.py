"""
Task Manager Pro - Python FastAPI Backend
Provides REST API endpoints for system monitoring and process management
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psutil
import platform
from datetime import datetime
from typing import List, Dict, Optional
import os
import signal

# Try to import GPUtil for GPU monitoring
try:
    import GPUtil
    GPU_AVAILABLE = True
except ImportError:
    GPU_AVAILABLE = False

# List of protected system processes that cannot be terminated
PROTECTED_PROCESSES = [
    'system', 'system idle process', 'registry', 'smss.exe', 'csrss.exe',
    'wininit.exe', 'services.exe', 'lsass.exe', 'winlogon.exe', 'dwm.exe',
    'svchost.exe', 'explorer.exe'
]

app = FastAPI(title="Task Manager Pro API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite and CRA ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_size(bytes_value):
    """Convert bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes_value < 1024.0:
            return f"{bytes_value:.1f} {unit}"
        bytes_value /= 1024.0
    return f"{bytes_value:.1f} PB"

def is_protected_process(process_name, pid):
    """Check if a process is protected and should not be terminated"""
    process_name_lower = process_name.lower()
    
    # Check against protected process list
    for protected in PROTECTED_PROCESSES:
        if protected in process_name_lower:
            return True
    
    # Protect system processes (PID 0-10)
    if pid <= 10:
        return True
    
    return False

def get_gpu_info():
    """Get GPU information if available"""
    if not GPU_AVAILABLE:
        return None
    
    try:
        gpus = GPUtil.getGPUs()
        if not gpus:
            return None
        
        gpu_data = []
        for gpu in gpus:
            gpu_data.append({
                'id': gpu.id,
                'name': gpu.name,
                'load': round(gpu.load * 100, 1),  # Convert to percentage
                'memory_used': gpu.memoryUsed,
                'memory_total': gpu.memoryTotal,
                'memory_percent': round((gpu.memoryUsed / gpu.memoryTotal) * 100, 1) if gpu.memoryTotal > 0 else 0,
                'temperature': gpu.temperature,
                'uuid': gpu.uuid
            })
        
        return gpu_data
    except Exception as e:
        print(f"GPU monitoring error: {e}")
        return None

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Task Manager Pro API",
        "version": "1.0.0",
        "endpoints": [
            "/api/system/stats",
            "/api/processes",
            "/api/process/{pid}",
            "/api/process/{pid}/kill",
            "/api/process/{pid}/suspend",
            "/api/process/{pid}/resume"
        ]
    }

@app.get("/api/system/stats")
async def get_system_stats():
    """Get overall system statistics"""
    try:
        # CPU Stats
        cpu_percent = psutil.cpu_percent(interval=0.1)
        cpu_count_physical = psutil.cpu_count(logical=False)
        cpu_count_logical = psutil.cpu_count(logical=True)
        cpu_freq = psutil.cpu_freq()
        cpu_per_core = psutil.cpu_percent(interval=0.1, percpu=True)
        
        # Memory Stats
        memory = psutil.virtual_memory()
        swap = psutil.swap_memory()
        
        # Disk Stats
        disk_path = 'C:\\' if platform.system() == "Windows" else '/'
        disk = psutil.disk_usage(disk_path)
        disk_io = psutil.disk_io_counters()
        
        # Network Stats
        net_io = psutil.net_io_counters()
        
        # System Info
        boot_time = datetime.fromtimestamp(psutil.boot_time())
        uptime = datetime.now() - boot_time
        
        # GPU Info
        gpu_info = get_gpu_info()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "cpu": {
                "percent": cpu_percent,
                "cores": {
                    "physical": cpu_count_physical,
                    "logical": cpu_count_logical
                },
                "frequency": {
                    "current": cpu_freq.current if cpu_freq else 0,
                    "min": cpu_freq.min if cpu_freq else 0,
                    "max": cpu_freq.max if cpu_freq else 0
                },
                "per_core": cpu_per_core
            },
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "used": memory.used,
                "percent": memory.percent,
                "total_formatted": get_size(memory.total),
                "available_formatted": get_size(memory.available),
                "used_formatted": get_size(memory.used)
            },
            "swap": {
                "total": swap.total,
                "used": swap.used,
                "free": swap.free,
                "percent": swap.percent
            },
            "disk": {
                "total": disk.total,
                "used": disk.used,
                "free": disk.free,
                "percent": disk.percent,
                "total_formatted": get_size(disk.total),
                "used_formatted": get_size(disk.used),
                "free_formatted": get_size(disk.free),
                "io": {
                    "read_bytes": disk_io.read_bytes if disk_io else 0,
                    "write_bytes": disk_io.write_bytes if disk_io else 0,
                    "read_formatted": get_size(disk_io.read_bytes) if disk_io else "0 B",
                    "write_formatted": get_size(disk_io.write_bytes) if disk_io else "0 B"
                }
            },
            "network": {
                "bytes_sent": net_io.bytes_sent,
                "bytes_recv": net_io.bytes_recv,
                "packets_sent": net_io.packets_sent,
                "packets_recv": net_io.packets_recv,
                "bytes_sent_formatted": get_size(net_io.bytes_sent),
                "bytes_recv_formatted": get_size(net_io.bytes_recv)
            },
            "gpu": gpu_info,
            "gpu_available": GPU_AVAILABLE,
            "system": {
                "os": platform.system(),
                "release": platform.release(),
                "version": platform.version(),
                "machine": platform.machine(),
                "processor": platform.processor(),
                "boot_time": boot_time.isoformat(),
                "uptime_seconds": uptime.total_seconds()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/processes")
async def get_processes():
    """Get all running processes"""
    try:
        processes = []
        num_cpus = psutil.cpu_count()
        
        for proc in psutil.process_iter(['pid', 'name', 'username', 'cpu_percent', 
                                          'memory_percent', 'memory_info', 'status', 
                                          'create_time', 'num_threads']):
            try:
                pinfo = proc.info
                # Normalize CPU percentage to system-wide
                cpu_normalized = (pinfo['cpu_percent'] or 0) / num_cpus
                
                # Check if process is protected
                is_protected = is_protected_process(pinfo['name'], pinfo['pid'])
                
                processes.append({
                    'pid': pinfo['pid'],
                    'name': pinfo['name'],
                    'username': pinfo['username'] or 'N/A',
                    'cpu_percent': round(cpu_normalized, 1),
                    'memory_percent': round(pinfo['memory_percent'] or 0, 1),
                    'memory_mb': round((pinfo['memory_info'].rss / 1024 / 1024), 1) if pinfo['memory_info'] else 0,
                    'status': pinfo['status'],
                    'threads': pinfo['num_threads'] or 0,
                    'create_time': datetime.fromtimestamp(pinfo['create_time']).isoformat() if pinfo['create_time'] else None,
                    'protected': is_protected
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        
        return {
            "count": len(processes),
            "processes": processes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/process/{pid}")
async def get_process_details(pid: int):
    """Get detailed information about a specific process"""
    try:
        proc = psutil.Process(pid)
        
        with proc.oneshot():
            # Get detailed info - use platform-specific attributes
            base_attrs = [
                'pid', 'name', 'username', 'status', 'create_time',
                'cpu_percent', 'memory_percent', 'memory_info',
                'num_threads', 'exe', 'cwd', 'cmdline',
                'environ', 'ppid'
            ]
            
            # Add platform-specific attributes
            if platform.system() != "Windows":
                base_attrs.extend(['num_fds', 'nice'])
                # ionice is Linux-only
                if platform.system() == "Linux":
                    base_attrs.append('ionice')
            
            pinfo = proc.as_dict(attrs=base_attrs)
            
            # Get connections
            try:
                connections = proc.connections()
                pinfo['connections'] = len(connections)
            except (psutil.AccessDenied, AttributeError):
                pinfo['connections'] = 0
            
            # Get open files
            try:
                open_files = proc.open_files()
                pinfo['open_files'] = len(open_files)
            except (psutil.AccessDenied, AttributeError):
                pinfo['open_files'] = 0
            
            # Format some fields
            if pinfo.get('create_time'):
                pinfo['create_time'] = datetime.fromtimestamp(pinfo['create_time']).isoformat()
            
            if pinfo.get('memory_info'):
                pinfo['memory_mb'] = round(pinfo['memory_info'].rss / 1024 / 1024, 1)
                pinfo['memory_formatted'] = get_size(pinfo['memory_info'].rss)
            
            return pinfo
            
    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail=f"Process {pid} not found")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail=f"Access denied to process {pid}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process/{pid}/kill")
async def kill_process(pid: int, force: bool = False):
    """Kill a process"""
    try:
        proc = psutil.Process(pid)
        proc_name = proc.name()
        
        # Check if process is protected
        if is_protected_process(proc_name, pid):
            raise HTTPException(
                status_code=403, 
                detail=f"Cannot terminate '{proc_name}'. This is a protected system process."
            )
        
        if force:
            proc.kill()  # SIGKILL
        else:
            proc.terminate()  # SIGTERM
        
        # Wait for process to terminate
        proc.wait(timeout=3)
        
        return {
            "success": True,
            "message": f"Process {proc_name} (PID: {pid}) terminated successfully",
            "force": force
        }
    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail=f"Process {pid} not found")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail=f"Access denied. Cannot kill process {pid}. Try running as administrator.")
    except psutil.TimeoutExpired:
        return {
            "success": True,
            "message": f"Process {pid} termination initiated (may take time)",
            "force": force
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process/{pid}/suspend")
async def suspend_process(pid: int):
    """Suspend a process"""
    try:
        proc = psutil.Process(pid)
        proc.suspend()
        
        return {
            "success": True,
            "message": f"Process {pid} suspended successfully"
        }
    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail=f"Process {pid} not found")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail=f"Access denied. Cannot suspend process {pid}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process/{pid}/resume")
async def resume_process(pid: int):
    """Resume a suspended process"""
    try:
        proc = psutil.Process(pid)
        proc.resume()
        
        return {
            "success": True,
            "message": f"Process {pid} resumed successfully"
        }
    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail=f"Process {pid} not found")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail=f"Access denied. Cannot resume process {pid}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Task Manager Pro Backend...")
    print("📡 API will be available at: http://localhost:8000")
    print("📚 API docs at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
