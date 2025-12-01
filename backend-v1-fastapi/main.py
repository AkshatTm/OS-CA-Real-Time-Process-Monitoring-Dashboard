"""
Task Manager Pro - Python Backend for Accurate CPU Monitoring
Purpose: Provides accurate CPU percentages for processes and apps
Note: All process killing is handled by Rust backend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
import psutil
from datetime import datetime
from typing import List, Dict
from collections import defaultdict
import asyncio
from concurrent.futures import ThreadPoolExecutor
import time

# Thread pool for CPU-intensive operations
executor = ThreadPoolExecutor(max_workers=4)

# Global cache for process objects to track CPU over time
_process_objects = {}
_last_cpu_call = 0

# System process names to exclude from Apps
SYSTEM_PROCESSES = {
    'system', 'registry', 'smss.exe', 'csrss.exe', 'wininit.exe',
    'services.exe', 'lsass.exe', 'winlogon.exe', 'dwm.exe', 'svchost.exe',
    'explorer.exe', 'taskeng.exe', 'taskhostw.exe', 'sihost.exe',
    'runtimebroker.exe', 'searchindexer.exe', 'searchprotocolhost.exe',
    'searchfilterhost.exe', 'wmiprvse.exe', 'spoolsv.exe', 'conhost.exe',
    'fontdrvhost.exe', 'lsaiso.exe', 'memory compression', 'system idle process'
}

app = FastAPI(
    title="Task Manager Pro - Python CPU Backend",
    version="2.0.0"
)

# CORS with optimized settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET"],  # Only GET methods needed
    allow_headers=["*"],
    max_age=3600
)

def is_system_process(process_name: str) -> bool:
    """Check if a process is a system process"""
    return process_name.lower() in SYSTEM_PROCESSES

def is_user_app(proc_info: dict) -> bool:
    """Determine if a process is a user-launchable application"""
    name = proc_info['name'].lower()
    
    # Exclude system processes
    if is_system_process(name):
        return False
    
    # Exclude Windows system folders
    exe = proc_info.get('exe', '')
    if exe:
        exe_lower = exe.lower()
        system_paths = ['\\windows\\', '\\program files\\windows', '\\windowsapps\\']
        if any(path in exe_lower for path in system_paths):
            # But include some known apps from WindowsApps
            allowed_apps = ['microsoft.windowsterminal', 'windowscommunicationsapps']
            if not any(app in exe_lower for app in allowed_apps):
                return False
    
    # Must have a window or be a known GUI app
    return True

async def get_processes_fast():
    """Fetch processes with accurate CPU percentages"""
    def fetch_processes():
        processes = []
        num_cpus = psutil.cpu_count()
        
        # Minimal attributes for performance
        attrs = ['pid', 'name', 'username', 'memory_percent', 
                 'memory_info', 'status', 'num_threads']
        
        try:
            for proc in psutil.process_iter(attrs, ad_value=None):
                try:
                    pinfo = proc.info
                    if not pinfo or pinfo['pid'] == 0:
                        continue
                    
                    # Get CPU percent - will be 0 on first call, accurate after
                    cpu_val = 0.0
                    try:
                        cpu_raw = proc.cpu_percent(interval=0)
                        cpu_val = cpu_raw / num_cpus if num_cpus > 0 else 0.0
                    except:
                        cpu_val = 0.0
                    
                    processes.append({
                        'pid': pinfo['pid'],
                        'name': pinfo['name'],
                        'username': pinfo.get('username') or 'N/A',
                        'cpu_percent': round(cpu_val, 1),
                        'memory_percent': round(pinfo.get('memory_percent') or 0, 1),
                        'memory_mb': round((pinfo['memory_info'].rss / 1048576), 1) if pinfo.get('memory_info') else 0,
                        'status': pinfo.get('status') or 'unknown',
                        'num_threads': pinfo.get('num_threads') or 0,
                        'create_time': 0,
                        'exe': '',
                        'is_protected': is_system_process(pinfo['name'])
                    })
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                    continue
        except Exception as e:
            print(f"Error in process iteration: {e}")
        
        return processes
    
    # Run in thread pool with timeout
    loop = asyncio.get_event_loop()
    try:
        processes = await asyncio.wait_for(
            loop.run_in_executor(executor, fetch_processes),
            timeout=8.0
        )
        print(f"✅ Fetched {len(processes)} processes")
        return {'processes': processes, 'total_count': len(processes)}
    except asyncio.TimeoutError:
        print("⚠️ Process fetching timed out!")
        return {'processes': [], 'total_count': 0}
    except Exception as e:
        print(f"❌ Error: {e}")
        return {'processes': [], 'total_count': 0}

async def get_apps_grouped():
    """Group processes by application name with accurate CPU percentages - optimized"""
    proc_data = await get_processes_fast()
    processes = proc_data['processes']
    
    if not processes:
        return []
    
    apps_dict = defaultdict(lambda: {
        'name': '',
        'pids': [],
        'cpu_percent': 0.0,
        'memory_mb': 0.0,
        'memory_percent': 0.0,
        'status': 'running',
        'process_count': 0,
        'exe': '',
        'is_closeable': True
    })
    
    for proc in processes:
        # Skip if it's a system process AND running as SYSTEM account
        if is_system_process(proc['name']) and proc['username'] in ['SYSTEM', 'N/A', 'NT AUTHORITY\\SYSTEM']:
            continue
        
        # Get base name (remove .exe suffix)
        base_name = proc['name'].replace('.exe', '').replace('.com', '')
        
        # Group by name
        app = apps_dict[base_name]
        app['name'] = base_name
        app['pids'].append(proc['pid'])
        app['cpu_percent'] += proc['cpu_percent']
        app['memory_mb'] += proc['memory_mb']
        app['memory_percent'] += proc['memory_percent']
        app['process_count'] += 1
        
        if proc['status'] != 'running':
            app['status'] = proc['status']
    
    # Convert to list and round values
    apps_list = []
    for name, app in apps_dict.items():
        if app['process_count'] > 0:
            apps_list.append({
                'name': app['name'],
                'pids': app['pids'],
                'cpu_percent': round(app['cpu_percent'], 1),
                'memory_mb': round(app['memory_mb'], 1),
                'memory_percent': round(app['memory_percent'], 1),
                'status': app['status'],
                'process_count': app['process_count'],
                'exe': app['exe'],
                'is_closeable': True
            })
    
    return apps_list

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Task Manager Pro - Python CPU Backend",
        "version": "2.0.0",
        "purpose": "Accurate CPU monitoring for processes and apps",
        "note": "Process killing handled by Rust backend on port 8000",
        "endpoints": [
            "/api/processes - Get all processes with accurate CPU%",
            "/api/apps - Get grouped apps with accurate CPU%"
        ]
    }

@app.get("/api/processes")
async def get_processes():
    """Get all processes with accurate CPU percentages"""
    try:
        return await get_processes_fast()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/apps")
async def get_apps():
    """Get grouped applications with accurate CPU percentages"""
    try:
        apps = await get_apps_grouped()
        return {
            "apps": apps,
            "total_count": len(apps)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 Task Manager Pro - Python CPU Backend")
    print("📡 API: http://localhost:8001")
    print("🎯 Purpose: Accurate CPU monitoring for processes and apps")
    print("⚡ Note: Process killing handled by Rust backend on port 8000")
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8001,
        log_level="info",  # Changed to info for debugging
        access_log=True,  # Enable access log
        workers=1,
        timeout_keep_alive=30,  # Increased
        limit_concurrency=100
    )
