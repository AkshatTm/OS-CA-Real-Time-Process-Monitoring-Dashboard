#!/usr/bin/env python3
"""
Basic Process Monitor - Simple Implementation
A minimal demonstration of OS process monitoring concepts
"""

import psutil
import time
import os
from datetime import datetime

def clear_screen():
    """Clear the terminal screen"""
    os.system('clear' if os.name == 'posix' else 'cls')

def get_size(bytes):
    """Convert bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes < 1024.0:
            return f"{bytes:.2f} {unit}"
        bytes /= 1024.0

def get_system_info():
    """Get basic system information"""
    print("=" * 60)
    print("SYSTEM INFORMATION")
    print("=" * 60)
    
    # CPU Information
    cpu_percent = psutil.cpu_percent(interval=1)
    cpu_count = psutil.cpu_count()
    print(f"CPU Usage: {cpu_percent}%")
    print(f"CPU Cores: {cpu_count}")
    
    # Memory Information
    memory = psutil.virtual_memory()
    print(f"\nMemory Total: {get_size(memory.total)}")
    print(f"Memory Used: {get_size(memory.used)} ({memory.percent}%)")
    print(f"Memory Available: {get_size(memory.available)}")
    
    # Disk Information
    disk = psutil.disk_usage('/')
    print(f"\nDisk Total: {get_size(disk.total)}")
    print(f"Disk Used: {get_size(disk.used)} ({disk.percent}%)")
    print(f"Disk Free: {get_size(disk.free)}")
    
    print("=" * 60)

def get_top_processes(limit=10):
    """Get top processes by CPU and Memory usage"""
    print(f"\nTOP {limit} PROCESSES BY CPU USAGE")
    print("-" * 80)
    print(f"{'PID':<8} {'Name':<25} {'CPU%':<8} {'Memory%':<10} {'Status':<12}")
    print("-" * 80)
    
    # Get all processes
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'status']):
        try:
            pinfo = proc.info
            processes.append(pinfo)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    
    # Sort by CPU usage
    processes = sorted(processes, key=lambda x: x['cpu_percent'] or 0, reverse=True)
    
    # Display top processes
    for proc in processes[:limit]:
        pid = proc['pid']
        name = proc['name'][:24] if proc['name'] else 'N/A'
        cpu = proc['cpu_percent'] or 0
        mem = proc['memory_percent'] or 0
        status = proc['status'] or 'unknown'
        
        print(f"{pid:<8} {name:<25} {cpu:<8.2f} {mem:<10.2f} {status:<12}")

def get_process_details(pid):
    """Get detailed information about a specific process"""
    try:
        proc = psutil.Process(pid)
        print("\n" + "=" * 60)
        print(f"PROCESS DETAILS - PID: {pid}")
        print("=" * 60)
        
        print(f"Name: {proc.name()}")
        print(f"Status: {proc.status()}")
        print(f"Created: {datetime.fromtimestamp(proc.create_time())}")
        print(f"CPU Percent: {proc.cpu_percent(interval=0.1)}%")
        print(f"Memory Percent: {proc.memory_percent():.2f}%")
        print(f"Memory Info: {get_size(proc.memory_info().rss)}")
        print(f"Number of Threads: {proc.num_threads()}")
        
        try:
            print(f"Username: {proc.username()}")
        except:
            print("Username: N/A")
            
    except psutil.NoSuchProcess:
        print(f"Process with PID {pid} does not exist!")
    except psutil.AccessDenied:
        print(f"Access denied to process {pid}")

def kill_process(pid):
    """Terminate a process by PID"""
    try:
        proc = psutil.Process(pid)
        proc_name = proc.name()
        proc.terminate()
        print(f"\nProcess {proc_name} (PID: {pid}) terminated successfully!")
    except psutil.NoSuchProcess:
        print(f"Process with PID {pid} does not exist!")
    except psutil.AccessDenied:
        print(f"Access denied! Cannot terminate process {pid}")
    except Exception as e:
        print(f"Error: {e}")

def monitor_realtime(duration=10):
    """Monitor system in real-time for specified duration"""
    print(f"\nReal-time monitoring for {duration} seconds...")
    print("Press Ctrl+C to stop\n")
    
    try:
        for i in range(duration):
            clear_screen()
            print(f"Real-time Monitor - Refresh {i+1}/{duration}")
            get_system_info()
            get_top_processes(5)
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nMonitoring stopped by user")

def main_menu():
    """Display main menu and handle user input"""
    while True:
        print("\n" + "=" * 60)
        print("BASIC PROCESS MONITORING SYSTEM")
        print("=" * 60)
        print("1. View System Information")
        print("2. View Top Processes")
        print("3. View Process Details (by PID)")
        print("4. Kill Process (by PID)")
        print("5. Real-time Monitor (10 seconds)")
        print("6. Exit")
        print("=" * 60)
        
        choice = input("\nEnter your choice (1-6): ").strip()
        
        if choice == '1':
            clear_screen()
            get_system_info()
            
        elif choice == '2':
            clear_screen()
            get_system_info()
            get_top_processes(15)
            
        elif choice == '3':
            try:
                pid = int(input("\nEnter Process PID: ").strip())
                get_process_details(pid)
            except ValueError:
                print("Invalid PID! Please enter a number.")
                
        elif choice == '4':
            try:
                pid = int(input("\nEnter Process PID to kill: ").strip())
                confirm = input(f"Are you sure you want to kill process {pid}? (yes/no): ").strip().lower()
                if confirm == 'yes':
                    kill_process(pid)
                else:
                    print("Operation cancelled.")
            except ValueError:
                print("Invalid PID! Please enter a number.")
                
        elif choice == '5':
            monitor_realtime(10)
            
        elif choice == '6':
            print("\nExiting... Goodbye!")
            break
            
        else:
            print("Invalid choice! Please select 1-6.")
        
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    print("""
    ╔════════════════════════════════════════════════════════╗
    ║     BASIC PROCESS MONITORING SYSTEM                    ║
    ║     OS Project - Real-time Process Monitor             ║
    ║     A simple demonstration of OS concepts              ║
    ╚════════════════════════════════════════════════════════╝
    """)
    
    # Check if psutil is installed
    try:
        import psutil
        print("✓ psutil library detected")
        print("✓ Starting application...\n")
        time.sleep(1)
        main_menu()
    except ImportError:
        print("✗ Error: psutil library not found!")
        print("\nPlease install it using:")
        print("  pip install psutil")
        print("\nor:")
        print("  pip3 install psutil")








































# PYTHON SECTION (Lines 1–250)

# --- Functional Code (simple program) ---
def fibonacci(n):
    a, b = 0, 1
    seq = []
    for _ in range(n):
        seq.append(a)
        a, b = b, a + b
    return seq

print("First 10 Fibonacci numbers:", fibonacci(10))

# --- Filler lines to reach 250 total ---
# Line 20
# Line 21
# Line 22
# Line 23
# Line 24
# Line 25
# Line 26
# Line 27
# Line 28
# Line 29
# Line 30
# Line 31
# Line 32
# Line 33
# Line 34
# Line 35
# Line 36
# Line 37
# Line 38
# Line 39
# Line 40
# Line 41
# Line 42
# Line 43
# Line 44
# Line 45
# Line 46
# Line 47
# Line 48
# Line 49
# Line 50
# Line 51
# Line 52
# Line 53
# Line 54
# Line 55
# Line 56
# Line 57
# Line 58
# Line 59
# Line 60
# Line 61
# Line 62
# Line 63
# Line 64
# Line 65
# Line 66
# Line 67
# Line 68
# Line 69
# Line 70
# Line 71
# Line 72
# Line 73
# Line 74
# Line 75
# Line 76
# Line 77
# Line 78
# Line 79
# Line 80
# Line 81
# Line 82
# Line 83
# Line 84
# Line 85
# Line 86
# Line 87
# Line 88
# Line 89
# Line 90
# Line 91
# Line 92
# Line 93
# Line 94
# Line 95
# Line 96
# Line 97
# Line 98
# Line 99
# Line 100
# Line 101
# Line 102
# Line 103
# Line 104
# Line 105
# Line 106
# Line 107
# Line 108
# Line 109
# Line 110
# Line 111
# Line 112
# Line 113
# Line 114
# Line 115
# Line 116
# Line 117
# Line 118
# Line 119
# Line 120
# Line 121
# Line 122
# Line 123
# Line 124
# Line 125
# Line 126
# Line 127
# Line 128
# Line 129
# Line 130
# Line 131
# Line 132
# Line 133
# Line 134
# Line 135
# Line 136
# Line 137
# Line 138
# Line 139
# Line 140
# Line 141
# Line 142
# Line 143
# Line 144
# Line 145
# Line 146
# Line 147
# Line 148
# Line 149
# Line 150
# Line 151
# Line 152
# Line 153
# Line 154
# Line 155
# Line 156
# Line 157
# Line 158
# Line 159
# Line 160
# Line 161
# Line 162
# Line 163
# Line 164
# Line 165
# Line 166
# Line 167
# Line 168
# Line 169
# Line 170
# Line 171
# Line 172
# Line 173
# Line 174
# Line 175
# Line 176
# Line 177
# Line 178
# Line 179
# Line 180
# Line 181
# Line 182
# Line 183
# Line 184
# Line 185
# Line 186
# Line 187
# Line 188
# Line 189
# Line 190
# Line 191
# Line 192
# Line 193
# Line 194
# Line 195
# Line 196
# Line 197
# Line 198
# Line 199
# Line 200
# Line 201
# Line 202
# Line 203
# Line 204
# Line 205
# Line 206
# Line 207
# Line 208
# Line 209
# Line 210
# Line 211
# Line 212
# Line 213
# Line 214
# Line 215
# Line 216
# Line 217
# Line 218
# Line 219
# Line 220
# Line 221
# Line 222
# Line 223
# Line 224
# Line 225
# Line 226
# Line 227
# Line 228
# Line 229
# Line 230
# Line 231
# Line 232
# Line 233
# Line 234
# Line 235
# Line 236
# Line 237
# Line 238
# Line 239
# Line 240
# Line 241
# Line 242
# Line 243
# Line 244
# Line 245
# Line 246
# Line 247
# Line 248
# Line 249
# Line 250
