import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Cpu,
  Activity,
  HardDrive,
  Network,
  Zap,
  LucideIcon,
} from "lucide-react";
import type { SystemStats, ChartDataPoint } from "../types";

interface PerformanceTabProps {
  systemStats: SystemStats | null;
}

interface PerformanceCardProps {
  title: string;
  icon: LucideIcon;
  data: ChartDataPoint[];
  value: string;
  subtitle: string;
  color: string;
}

export default function PerformanceTab({ systemStats }: PerformanceTabProps) {
  const [cpuHistory, setCpuHistory] = useState<ChartDataPoint[]>(
    Array(60)
      .fill(0)
      .map((_, i) => ({ time: i, value: 0 }))
  );
  const [memHistory, setMemHistory] = useState<ChartDataPoint[]>(
    Array(60)
      .fill(0)
      .map((_, i) => ({ time: i, value: 0 }))
  );
  const [diskHistory, setDiskHistory] = useState<ChartDataPoint[]>(
    Array(60)
      .fill(0)
      .map((_, i) => ({ time: i, value: 0 }))
  );
  const [networkHistory, setNetworkHistory] = useState<ChartDataPoint[]>(
    Array(60)
      .fill(0)
      .map((_, i) => ({ time: i, value: 0 }))
  );
  const [gpuHistory, setGpuHistory] = useState<ChartDataPoint[]>(
    Array(60)
      .fill(0)
      .map((_, i) => ({ time: i, value: 0 }))
  );

  useEffect(() => {
    if (
      systemStats &&
      systemStats.cpu &&
      systemStats.memory &&
      systemStats.disk &&
      systemStats.network
    ) {
      setCpuHistory((prev) => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          value: systemStats.cpu.percent || 0,
        },
      ]);
      setMemHistory((prev) => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          value: systemStats.memory.percent || 0,
        },
      ]);
      setDiskHistory((prev) => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          value: systemStats.disk.percent || 0,
        },
      ]);

      // Network usage as percentage (simulated)
      const networkPercent = Math.min(
        100,
        ((systemStats.network.bytes_sent || 0) +
          (systemStats.network.bytes_recv || 0)) /
          1048576 /
          10
      );
      setNetworkHistory((prev) => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          value: networkPercent,
        },
      ]);

      // GPU usage
      if (systemStats.gpu) {
        setGpuHistory((prev) => [
          ...prev.slice(1),
          {
            time: prev[prev.length - 1].time + 1,
            value: systemStats.gpu?.load || 0,
          },
        ]);
      }
    }
  }, [systemStats]);

  if (!systemStats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const PerformanceCard = ({
    title,
    icon: Icon,
    data,
    value,
    subtitle,
    color,
  }: PerformanceCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
      if (cardRef.current && !hasAnimated.current) {
        hasAnimated.current = true;
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
      }
    }, []);

    return (
      <div ref={cardRef} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400">{subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{value}</div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="time"
                stroke="#6B7280"
                tick={{ fill: "#6B7280" }}
                tickLine={{ stroke: "#6B7280" }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: "#6B7280" }}
                tickLine={{ stroke: "#6B7280" }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                  color: "#F3F4F6",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Row: CPU and Memory (taking more space) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceCard
          title="CPU Usage"
          icon={Cpu}
          data={cpuHistory}
          value={`${systemStats.cpu.percent.toFixed(1)}%`}
          subtitle={`${systemStats.cpu.cores.logical} Logical Processors`}
          color="from-blue-500 to-cyan-500"
        />

        <PerformanceCard
          title="Memory Usage"
          icon={Activity}
          data={memHistory}
          value={`${systemStats.memory.percent.toFixed(1)}%`}
          subtitle={`${systemStats.memory.used_formatted} / ${systemStats.memory.total_formatted}`}
          color="from-purple-500 to-pink-500"
        />
      </div>

      {/* Bottom Row: Disk, Network, and GPU (if available) */}
      <div
        className={`grid grid-cols-1 ${
          systemStats.gpu ? "md:grid-cols-3" : "md:grid-cols-2"
        } gap-6`}
      >
        <PerformanceCard
          title="Disk Usage"
          icon={HardDrive}
          data={diskHistory}
          value={`${systemStats.disk.percent.toFixed(1)}%`}
          subtitle={`${systemStats.disk.used_formatted} / ${systemStats.disk.total_formatted}`}
          color="from-green-500 to-emerald-500"
        />

        <PerformanceCard
          title="Network Activity"
          icon={Network}
          data={networkHistory}
          value={systemStats.network.bytes_sent_formatted}
          subtitle={`↑ ${systemStats.network.bytes_sent_formatted} | ↓ ${systemStats.network.bytes_recv_formatted}`}
          color="from-orange-500 to-red-500"
        />

        {systemStats.gpu && (
          <PerformanceCard
            title="GPU Usage"
            icon={Zap}
            data={gpuHistory}
            value={`${systemStats.gpu.load.toFixed(1)}%`}
            subtitle={`${systemStats.gpu.memory_used_formatted} / ${systemStats.gpu.memory_total_formatted}`}
            color="from-yellow-500 to-orange-500"
          />
        )}
      </div>

      {/* Per-Core CPU Usage */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          CPU Core Usage
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {systemStats.cpu.per_core.map((usage, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-400 mb-2">Core {index}</div>
              <div className="relative h-24 bg-gray-700 rounded-lg overflow-hidden">
                <div
                  style={{ height: `${usage}%` }}
                  className={`absolute bottom-0 w-full transition-all duration-300 ${
                    usage > 80
                      ? "bg-red-500"
                      : usage > 50
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />
              </div>
              <div className="text-sm font-semibold text-white mt-2">
                {usage.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
