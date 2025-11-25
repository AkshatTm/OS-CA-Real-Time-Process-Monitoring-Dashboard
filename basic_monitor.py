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
