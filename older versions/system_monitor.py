import psutil

import tkinter as tk
from tkinter import ttk
import platform
from datetime import datetime
import threading
import time

import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure
from collections import deque

class SystemMonitorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("System Monitor - Real-Time Statistics")
        self.root.geometry("1400x900")
        self.root.configure(bg="#1e1e1e")
        
        # Set minimum window size
        self.root.minsize(1200, 800)
        
        # Running flag for update thread
        self.running = True
        
        # Initialize CPU monitoring (first call to set baseline)
        psutil.cpu_percent(interval=None)
        
        # Initialize data storage for graphs (last 60 data points = 2 minutes at 2-second intervals)
        self.max_data_points = 60
        self.cpu_data = deque([0] * self.max_data_points, maxlen=self.max_data_points)
        self.memory_data = deque([0] * self.max_data_points, maxlen=self.max_data_points)
        self.disk_data = deque([0] * self.max_data_points, maxlen=self.max_data_points)
        
        # Configure style
        self.setup_styles()
        
        # Create main container
        self.create_widgets()
        
        # Start update thread
        self.update_thread = threading.Thread(target=self.update_loop, daemon=True)
        self.update_thread.start()
        
        # Handle window close
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
    
    def setup_styles(self):
        """Configure ttk styles for modern look"""
        style = ttk.Style()
        style.theme_use('clam')
        
        # Configure colors
        bg_color = "#1e1e1e"
        fg_color = "#ffffff"
        accent_color = "#0078d4"
        
        style.configure("Title.TLabel", 
                       background=bg_color, 
                       foreground=fg_color, 
                       font=("Segoe UI", 16, "bold"))
        
        style.configure("Subtitle.TLabel", 
                       background=bg_color, 
                       foreground=fg_color, 
                       font=("Segoe UI", 11, "bold"))
        
        style.configure("Info.TLabel", 
                       background=bg_color, 
                       foreground="#d4d4d4", 
                       font=("Consolas", 10))
        
        style.configure("Card.TFrame", 
                       background="#2d2d2d", 
                       relief="flat")
        
        # Treeview style
        style.configure("Treeview",
                       background="#2d2d2d",
                       foreground="#ffffff",
                       fieldbackground="#2d2d2d",
                       borderwidth=0,
                       font=("Consolas", 9))
        
        style.configure("Treeview.Heading",
                       background="#0078d4",
                       foreground="#ffffff",
                       font=("Segoe UI", 10, "bold"))
        
        style.map("Treeview.Heading",
                 background=[("active", "#005a9e")])
        
        style.map("Treeview",
                 background=[("selected", "#0078d4")])
    
    def create_widgets(self):
        """Create all GUI widgets"""
        # Header
        header_frame = tk.Frame(self.root, bg="#0078d4", height=60)
        header_frame.pack(fill=tk.X, pady=(0, 10))
        header_frame.pack_propagate(False)
        
        title_label = ttk.Label(header_frame, 
                               text="⚡ System Monitor", 
                               font=("Segoe UI", 18, "bold"),
                               background="#0078d4",
                               foreground="#ffffff")
        title_label.pack(side=tk.LEFT, padx=20, pady=10)
        
        self.time_label = ttk.Label(header_frame,
                                    text="",
                                    font=("Segoe UI", 10),
                                    background="#0078d4",
                                    foreground="#ffffff")
        self.time_label.pack(side=tk.RIGHT, padx=20, pady=10)
        
        # Main content frame with two columns
        content_frame = tk.Frame(self.root, bg="#1e1e1e")
        content_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=(0, 10))
        
        # Left Column - Stats and Graphs
        left_column = tk.Frame(content_frame, bg="#1e1e1e")
        left_column.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 5))
        
        # Top section - System Stats (3 cards in a row)
        stats_frame = tk.Frame(left_column, bg="#1e1e1e")
        stats_frame.pack(fill=tk.X, pady=(0, 10))
        
        # CPU Card
        self.cpu_card = self.create_stat_card(stats_frame, "🖥️ CPU Usage", 0)
        self.cpu_label = self.create_info_label(self.cpu_card, "")
        self.cpu_detail_label = self.create_info_label(self.cpu_card, "", font_size=9)
        self.cpu_progress = ttk.Progressbar(self.cpu_card, mode='determinate', length=150)
        self.cpu_progress.pack(pady=5)
        
        # Memory Card
        self.mem_card = self.create_stat_card(stats_frame, "💾 Memory Usage", 1)
        self.mem_label = self.create_info_label(self.mem_card, "")
        self.mem_detail_label = self.create_info_label(self.mem_card, "", font_size=9)
        self.mem_progress = ttk.Progressbar(self.mem_card, mode='determinate', length=150)
        self.mem_progress.pack(pady=5)
        
        # Disk Card
        self.disk_card = self.create_stat_card(stats_frame, "💿 Disk Usage", 2)
        self.disk_label = self.create_info_label(self.disk_card, "")
        self.disk_detail_label = self.create_info_label(self.disk_card, "", font_size=9)
        self.disk_progress = ttk.Progressbar(self.disk_card, mode='determinate', length=150)
        self.disk_progress.pack(pady=5)
        
        # Graphs Section
        graphs_frame = tk.Frame(left_column, bg="#2d2d2d")
        graphs_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        graphs_header = ttk.Label(graphs_frame,
                                 text="📈 Performance Graphs (Last 2 Minutes)",
                                 style="Subtitle.TLabel")
        graphs_header.pack(anchor=tk.W, padx=10, pady=(10, 5))
        
        # Create matplotlib figure with dark theme
        self.fig = Figure(figsize=(10, 6), facecolor='#2d2d2d')
        self.fig.subplots_adjust(hspace=0.4, left=0.08, right=0.95, top=0.95, bottom=0.08)
        
        # Create three subplots
        self.ax_cpu = self.fig.add_subplot(311)
        self.ax_memory = self.fig.add_subplot(312)
        self.ax_disk = self.fig.add_subplot(313)
        
        # Configure CPU graph
        self.configure_graph(self.ax_cpu, "CPU Usage (%)", "#00d4aa")
        
        # Configure Memory graph
        self.configure_graph(self.ax_memory, "Memory Usage (%)", "#0078d4")
        
        # Configure Disk graph
        self.configure_graph(self.ax_disk, "Disk Usage (%)", "#f7630c")
        
        # Embed matplotlib figure in tkinter
        self.canvas = FigureCanvasTkAgg(self.fig, master=graphs_frame)
        self.canvas.draw()
        self.canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True, padx=10, pady=(0, 10))
        
        # Right Column - Network and Processes
        right_column = tk.Frame(content_frame, bg="#1e1e1e")
        right_column.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(5, 0))
        
        # Network Card (full width)
        net_frame = tk.Frame(right_column, bg="#1e1e1e")
        net_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.net_card = self.create_stat_card(net_frame, "🌐 Network Statistics", 0, full_width=True)
        self.net_label = self.create_info_label(self.net_card, "")
        
        # Process Table
        process_frame = tk.Frame(right_column, bg="#2d2d2d")
        process_frame.pack(fill=tk.BOTH, expand=True)
        
        process_header = ttk.Label(process_frame,
                                   text="📊 Running Processes (Top 15 by CPU)",
                                   style="Subtitle.TLabel")
        process_header.pack(anchor=tk.W, padx=10, pady=(10, 5))
        
        # Create Treeview for processes
        tree_frame = tk.Frame(process_frame, bg="#2d2d2d")
        tree_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=(0, 10))
        
        # Scrollbar
        scrollbar = ttk.Scrollbar(tree_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Treeview
        self.process_tree = ttk.Treeview(tree_frame,
                                         columns=("PID", "Name", "CPU%", "Memory%"),
                                         show="headings",
                                         yscrollcommand=scrollbar.set,
                                         height=15)
        
        scrollbar.config(command=self.process_tree.yview)
        
        # Configure columns
        self.process_tree.heading("PID", text="PID")
        self.process_tree.heading("Name", text="Process Name")
        self.process_tree.heading("CPU%", text="CPU %")
        self.process_tree.heading("Memory%", text="Memory %")
        
        self.process_tree.column("PID", width=80, anchor=tk.CENTER)
        self.process_tree.column("Name", width=200, anchor=tk.W)
        self.process_tree.column("CPU%", width=80, anchor=tk.CENTER)
        self.process_tree.column("Memory%", width=80, anchor=tk.CENTER)
        
        self.process_tree.pack(fill=tk.BOTH, expand=True)
        
        # Footer
        footer_frame = tk.Frame(self.root, bg="#0078d4", height=30)
        footer_frame.pack(fill=tk.X, side=tk.BOTTOM)
        footer_frame.pack_propagate(False)
        
        footer_label = ttk.Label(footer_frame,
                                text="Auto-refresh every 2 seconds | Graphs show last 2 minutes",
                                font=("Segoe UI", 9),
                                background="#0078d4",
                                foreground="#ffffff")
        footer_label.pack(pady=5)
    
    def configure_graph(self, ax, title, color):
        """Configure a graph with dark theme"""
        ax.set_facecolor('#1e1e1e')
        ax.set_title(title, color='#ffffff', fontsize=10, pad=5)
        ax.set_ylim(0, 100)
        ax.set_xlim(0, self.max_data_points)
        ax.tick_params(colors='#d4d4d4', labelsize=8)
        ax.spines['bottom'].set_color('#d4d4d4')
        ax.spines['top'].set_color('#d4d4d4')
        ax.spines['left'].set_color('#d4d4d4')
        ax.spines['right'].set_color('#d4d4d4')
        ax.grid(True, alpha=0.2, color='#d4d4d4')
        ax.set_ylabel('%', color='#d4d4d4', fontsize=8)
        
        # Remove x-axis labels for cleaner look
        ax.set_xticks([])
        
        # Set color for the line (will be used when plotting)
        ax.plot_color = color
    
    def create_stat_card(self, parent, title, column, full_width=False):
        """Create a stat card widget"""
        if full_width:
            card = tk.Frame(parent, bg="#2d2d2d", relief="flat", bd=0)
            card.pack(fill=tk.X, padx=5, pady=5)
        else:
            card = tk.Frame(parent, bg="#2d2d2d", relief="flat", bd=0)
            card.grid(row=0, column=column, padx=5, pady=5, sticky="nsew")
            parent.grid_columnconfigure(column, weight=1)
        
        # Card title
        title_label = ttk.Label(card, text=title, style="Subtitle.TLabel")
        title_label.pack(anchor=tk.W, padx=15, pady=(15, 5))
        
        return card
    
    def create_info_label(self, parent, text, font_size=11):
        """Create an info label"""
        label = tk.Label(parent,
                        text=text,
                        bg="#2d2d2d",
                        fg="#d4d4d4",
                        font=("Consolas", font_size),
                        justify=tk.LEFT)
        label.pack(anchor=tk.W, padx=15, pady=2)
        return label
    
    def get_size(self, bytes):
        """Convert bytes to human readable format"""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if bytes < 1024.0:
                return f"{bytes:.1f} {unit}"
            bytes /= 1024.0
        return f"{bytes:.1f} PB"
    
    def update_stats(self):
        """Update all system statistics"""
        # Update time
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.time_label.config(text=current_time)
        
        # CPU Stats - Use interval=None for non-blocking call
        cpu_percent = psutil.cpu_percent(interval=None)
        physical_cores = psutil.cpu_count(logical=False)
        logical_cores = psutil.cpu_count(logical=True)
        
        self.cpu_label.config(text=f"{cpu_percent}%")
        self.cpu_detail_label.config(text=f"Cores: {physical_cores} Physical, {logical_cores} Logical")
        self.cpu_progress['value'] = cpu_percent
        
        # Add to graph data
        self.cpu_data.append(cpu_percent)
        
        # Change progress bar color based on usage
        if cpu_percent > 80:
            self.cpu_progress.config(style="red.Horizontal.TProgressbar")
        elif cpu_percent > 50:
            self.cpu_progress.config(style="yellow.Horizontal.TProgressbar")
        else:
            self.cpu_progress.config(style="green.Horizontal.TProgressbar")
        
        # Memory Stats
        memory = psutil.virtual_memory()
        self.mem_label.config(text=f"{memory.percent}%")
        self.mem_detail_label.config(text=f"Used: {self.get_size(memory.used)} / Total: {self.get_size(memory.total)}")
        self.mem_progress['value'] = memory.percent
        
        # Add to graph data
        self.memory_data.append(memory.percent)
        
        # Disk Stats
        try:
            disk_path = 'C:\\' if platform.system() == "Windows" else '/'
            disk = psutil.disk_usage(disk_path)
            disk_percent = disk.percent
            self.disk_label.config(text=f"{disk_percent}%")
            self.disk_detail_label.config(text=f"Used: {self.get_size(disk.used)} / Total: {self.get_size(disk.total)}")
            self.disk_progress['value'] = disk_percent
            
            # Add to graph data
            self.disk_data.append(disk_percent)
        except Exception as e:
            self.disk_label.config(text="N/A")
            self.disk_detail_label.config(text=f"Error: {type(e).__name__}")
            self.disk_data.append(0)
        
        # Update graphs
        self.update_graphs()
        
        # Network Stats
        net_io = psutil.net_io_counters()
        self.net_label.config(text=f"Sent: {self.get_size(net_io.bytes_sent)}  |  Received: {self.get_size(net_io.bytes_recv)}")
        
        # Process Stats
        self.update_processes()
    
    def update_graphs(self):
        """Update all performance graphs"""
        # Clear previous plots
        self.ax_cpu.clear()
        self.ax_memory.clear()
        self.ax_disk.clear()
        
        # Reconfigure graphs
        self.configure_graph(self.ax_cpu, "CPU Usage (%)", "#00d4aa")
        self.configure_graph(self.ax_memory, "Memory Usage (%)", "#0078d4")
        self.configure_graph(self.ax_disk, "Disk Usage (%)", "#f7630c")
        
        # Plot CPU data
        x_data = list(range(len(self.cpu_data)))
        self.ax_cpu.plot(x_data, list(self.cpu_data), color="#00d4aa", linewidth=2)
        self.ax_cpu.fill_between(x_data, list(self.cpu_data), alpha=0.3, color="#00d4aa")
        
        # Plot Memory data
        self.ax_memory.plot(x_data, list(self.memory_data), color="#0078d4", linewidth=2)
        self.ax_memory.fill_between(x_data, list(self.memory_data), alpha=0.3, color="#0078d4")
        
        # Plot Disk data
        self.ax_disk.plot(x_data, list(self.disk_data), color="#f7630c", linewidth=2)
        self.ax_disk.fill_between(x_data, list(self.disk_data), alpha=0.3, color="#f7630c")
        
        # Redraw canvas
        self.canvas.draw()
    
    def update_processes(self):
        """Update process table"""
        # Clear existing items
        for item in self.process_tree.get_children():
            self.process_tree.delete(item)
        
        # Get number of CPUs for normalization
        num_cpus = psutil.cpu_count()
        
        # Get all processes
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
            try:
                proc_info = proc.info
                # Normalize CPU percentage to system-wide (divide by number of CPUs)
                cpu_normalized = (proc_info['cpu_percent'] or 0) / num_cpus
                processes.append({
                    'pid': proc_info['pid'],
                    'name': proc_info['name'],
                    'cpu': cpu_normalized,
                    'memory': proc_info['memory_percent'] or 0
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        
        # Sort by CPU and add top 15
        processes.sort(key=lambda x: x['cpu'], reverse=True)
        for proc in processes[:15]:
            self.process_tree.insert("", tk.END, values=(
                proc['pid'],
                proc['name'][:50],
                f"{proc['cpu']:.1f}%",
                f"{proc['memory']:.1f}%"
            ))
    
    def update_loop(self):
        """Background thread to update stats"""
        while self.running:
            try:
                self.update_stats()
                time.sleep(2)
            except Exception as e:
                print(f"Error updating stats: {e}")
                time.sleep(2)
    
    def on_closing(self):
        """Handle window close event"""
        self.running = False
        self.root.quit()
        self.root.destroy()

def main():
    """Main function to run the GUI"""
    root = tk.Tk()
    app = SystemMonitorGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()
