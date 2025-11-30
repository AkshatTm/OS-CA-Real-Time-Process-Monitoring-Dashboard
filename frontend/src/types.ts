// Type definitions for the Task Manager Pro application

export interface SystemStats {
  timestamp: string;
  alerts?: Alert[];
  cpu: CPUStats;
  memory: MemoryStats;
  disk: DiskStats;
  network: NetworkStats;
  system: SystemInfo;
  gpu?: GPUStats;
}

export interface Alert {
  type: "cpu" | "memory" | "disk";
  severity: "warning" | "critical";
  message: string;
  value: number;
}

export interface CPUStats {
  percent: number;
  cores: {
    physical: number;
    logical: number;
  };
  per_core: number[];
}

export interface MemoryStats {
  total: number;
  available: number;
  used: number;
  percent: number;
  total_formatted: string;
  used_formatted: string;
}

export interface DiskStats {
  total: number;
  used: number;
  free: number;
  percent: number;
  total_formatted: string;
  used_formatted: string;
}

export interface NetworkStats {
  bytes_sent: number;
  bytes_recv: number;
  bytes_sent_formatted: string;
  bytes_recv_formatted: string;
}

export interface GPUStats {
  name: string;
  load: number;
  memory_used: number;
  memory_total: number;
  memory_percent: number;
  memory_used_formatted: string;
  memory_total_formatted: string;
  temperature: number | null;
}

export interface GPUInfo {
  id: number;
  name: string;
  load: number;
  memory_used: number;
  memory_total: number;
  memory_percent: number;
  temperature: number;
  uuid: string;
}

export interface SystemInfo {
  os: string;
  uptime_seconds: number;
}

export interface Process {
  pid: number;
  name: string;
  username: string;
  cpu_percent: number;
  memory_percent: number;
  memory_mb: number;
  status: string;
  num_threads: number;
  create_time: number;
  exe?: string;
  cwd?: string;
  cmdline?: string[];
  is_protected: boolean;
}

export interface ProcessListResponse {
  processes: Process[];
  total_count: number;
}

export interface AppGroup {
  name: string;
  pids: number[];
  cpu_percent: number;
  memory_mb: number;
  memory_percent: number;
  status: string;
  process_count: number;
  exe: string;
  is_closeable: boolean;
}

export interface AppsListResponse {
  apps: AppGroup[];
  total_count: number;
}

export type TabType = "dashboard" | "apps" | "performance" | "processes";

export interface ChartDataPoint {
  time: number;
  value: number;
}

export interface SimpleChartDataPoint {
  index: number;
  cpu: number;
  memory: number;
}
