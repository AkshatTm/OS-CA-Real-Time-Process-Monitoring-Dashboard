# Terminal-Based System Statistics Monitor

A Python script that displays real-time system statistics in the terminal, including CPU usage, memory consumption, disk usage, network stats, and running processes.

## Features

✅ **CPU Usage**: Real-time CPU percentage and core information  
✅ **Memory Usage**: Total RAM, used RAM, available RAM, and percentage  
✅ **Disk Usage**: Total disk space, used space, free space, and percentage  
✅ **Network Stats**: Bytes sent and received  
✅ **Running Processes**: Top 10 processes sorted by CPU usage with PID, name, CPU%, and memory%  
✅ **Auto-refresh**: Updates every 2 seconds  
✅ **Clean Display**: Clears terminal screen before each update  
✅ **Graceful Exit**: Exit with Ctrl+C

## Requirements

- Python 3.x
- psutil library

## Installation

The `psutil` library is already installed in your environment. If you need to install it elsewhere, use:

```bash
pip install psutil
```

## Usage

Run the script using Python:

```bash
python system_monitor.py
```

Or using the conda environment:

```bash
C:/ProgramData/anaconda3/Scripts/conda.exe run -p C:\ProgramData\anaconda3 --no-capture-output python system_monitor.py
```

The monitor will start displaying system statistics and refresh every 2 seconds.

To exit the monitor, press **Ctrl+C**.

## Output Format

```
============================================================
=== SYSTEM MONITOR ===
============================================================
Time: 2025-11-03 13:41:05
============================================================

🖥️  CPU Usage: 45.2%
   CPU Cores: 4 Physical, 8 Logical

💾 Memory Usage:
   Total: 16.0 GB
   Used: 8.5 GB (53.1%)
   Available: 7.5 GB

💿 Disk Usage:
   Total: 500.0 GB
   Used: 250.0 GB (50.0%)
   Free: 250.0 GB

🌐 Network:
   Sent: 1.2 GB
   Received: 5.4 GB

============================================================
📊 Top 10 Processes by CPU Usage:
============================================================
PID      NAME                      CPU%     MEM%
------------------------------------------------------------
1234     chrome.exe                12.5     5.2
5678     python.exe                8.3      2.1
...

============================================================
Press Ctrl+C to exit
============================================================
```

## Customization

You can modify the refresh interval by changing the `time.sleep(2)` value in the `main()` function:

```python
time.sleep(2)  # Refresh every 2 seconds
```

Change the number `2` to any value (in seconds) you prefer.

## Technical Details

- **Cross-platform**: Works on Windows, Linux, and macOS
- **Screen clearing**: Automatically detects OS and uses appropriate clear command
- **Error handling**: Handles process access errors gracefully
- **Human-readable sizes**: Converts bytes to KB, MB, GB, TB automatically
- **Sorted processes**: Displays top processes by CPU usage

## Troubleshooting

If you encounter any permission errors when accessing process information, try running the script with administrator/root privileges:

**Windows (PowerShell as Administrator):**

```bash
python system_monitor.py
```

**Linux/Mac:**

```bash
sudo python system_monitor.py
```

## License

Free to use and modify for educational purposes.
