import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Cpu,
  HardDrive,
  Activity,
  Network,
  Server,
  TrendingUp,
  Zap,
  LucideIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AlertBanner from "./AlertBanner";
import type { SystemStats, Process, SimpleChartDataPoint } from "../types";

interface DashboardProps {
  systemStats: SystemStats | null;
  processes: Process[];
  loading: boolean;
}

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  trend?: string;
}

export default function Dashboard({
  systemStats,
  processes,
  loading,
}: DashboardProps) {
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(20).fill(0));
  const [memHistory, setMemHistory] = useState<number[]>(Array(20).fill(0));

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  useEffect(() => {
    if (systemStats) {
      setCpuHistory((prev) => [...prev.slice(1), systemStats.cpu.percent]);
      setMemHistory((prev) => [...prev.slice(1), systemStats.memory.percent]);
    }
  }, [systemStats]);

  const chartData: SimpleChartDataPoint[] = cpuHistory.map((cpu, index) => ({
    index,
    cpu,
    memory: memHistory[index],
  }));

  if (loading || !systemStats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color,
    trend,
  }: StatCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
      if (cardRef.current && !hasAnimated.current) {
        hasAnimated.current = true;
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
      }
    }, []);

    return (
      <div
        ref={cardRef}
        className="stat-card group hover:scale-[1.02] hover:-translate-y-1 transition-transform duration-300"
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className="flex items-center space-x-1 text-accent-success text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
          {value}
        </p>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">System Overview</h2>
        <p className="text-gray-400">
          Monitor your system performance in real-time
        </p>
      </div>

      {/* Alert Banner */}
      {systemStats.alerts && systemStats.alerts.length > 0 && (
        <AlertBanner alerts={systemStats.alerts} />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          icon={Cpu}
          title="CPU Usage"
          value={`${systemStats.cpu.percent.toFixed(1)}%`}
          subtitle={`${systemStats.cpu.cores.logical} cores`}
          color="from-blue-500 to-purple-500"
        />

        <StatCard
          icon={Activity}
          title="Memory Usage"
          value={systemStats.memory.used_formatted}
          subtitle={`${systemStats.memory.percent.toFixed(1)}% of ${
            systemStats.memory.total_formatted
          }`}
          color="from-purple-500 to-pink-500"
        />

        <StatCard
          icon={HardDrive}
          title="Disk Usage"
          value={systemStats.disk.used_formatted}
          subtitle={`${systemStats.disk.percent.toFixed(1)}% of ${
            systemStats.disk.total_formatted
          }`}
          color="from-orange-500 to-red-500"
        />

        {systemStats.gpu && (
          <StatCard
            icon={Zap}
            title="GPU Usage"
            value={`${systemStats.gpu.load.toFixed(1)}%`}
            subtitle={`${systemStats.gpu.memory_used_formatted} / ${systemStats.gpu.memory_total_formatted}`}
            color="from-yellow-500 to-orange-500"
          />
        )}

        <StatCard
          icon={Server}
          title="Processes"
          value={processes.length}
          subtitle={`${
            processes.filter((p) => p.status === "running").length
          } running`}
          color="from-green-500 to-teal-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Chart */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-accent-primary" />
            CPU History
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="index" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a24",
                  border: "1px solid #2a2a3a",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
              <Area
                type="monotone"
                dataKey="cpu"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#cpuGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Chart */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-accent-secondary" />
            Memory History
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="index" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a24",
                  border: "1px solid #2a2a3a",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
              <Area
                type="monotone"
                dataKey="memory"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#memGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Info */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Network className="w-5 h-5 mr-2 text-accent-success" />
          Network Activity
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Sent</p>
            <p className="text-2xl font-bold text-white">
              {systemStats.network.bytes_sent_formatted}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Received</p>
            <p className="text-2xl font-bold text-white">
              {systemStats.network.bytes_recv_formatted}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Bytes Sent</p>
            <p className="text-2xl font-bold text-white">
              {systemStats.network.bytes_sent_formatted}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Bytes Received</p>
            <p className="text-2xl font-bold text-white">
              {systemStats.network.bytes_recv_formatted}
            </p>
          </div>
        </div>
      </div>

      {/* Top Processes */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">System Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Operating System</p>
            <p className="text-white font-medium">{systemStats.system.os}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">CPU Cores</p>
            <p className="text-white font-medium">
              {systemStats.cpu.cores.physical} Physical /{" "}
              {systemStats.cpu.cores.logical} Logical
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Uptime</p>
            <p className="text-white font-medium">
              {formatUptime(systemStats.system.uptime_seconds)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
