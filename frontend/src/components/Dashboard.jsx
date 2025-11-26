import { motion } from "framer-motion";
import {
  Cpu,
  HardDrive,
  Activity,
  Network,
  Server,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import AlertBanner from "./AlertBanner";

export default function Dashboard({ systemStats, processes, loading }) {
  const [cpuHistory, setCpuHistory] = useState(Array(20).fill(0));
  const [memHistory, setMemHistory] = useState(Array(20).fill(0));

  useEffect(() => {
    if (systemStats) {
      setCpuHistory((prev) => [...prev.slice(1), systemStats.cpu.percent]);
      setMemHistory((prev) => [...prev.slice(1), systemStats.memory.percent]);
    }
  }, [systemStats]);

  const chartData = cpuHistory.map((cpu, index) => ({
    index,
    cpu,
    memory: memHistory[index],
  }));

  if (loading || !systemStats) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <motion.div whileHover={{ scale: 1.02, y: -5 }} className="stat-card group">
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
    </motion.div>
  );

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* GPU Stats Row */}
      {systemStats.gpu_available &&
        systemStats.gpu &&
        systemStats.gpu.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemStats.gpu.map((gpu, index) => (
              <StatCard
                key={gpu.id}
                icon={Zap}
                title={`GPU ${index}: ${gpu.name}`}
                value={`${gpu.load.toFixed(1)}%`}
                subtitle={`${(gpu.memory_used / 1024).toFixed(1)}GB / ${(
                  gpu.memory_total / 1024
                ).toFixed(1)}GB (${gpu.memory_percent.toFixed(1)}%)`}
                color="from-yellow-500 to-orange-500"
              />
            ))}
          </div>
        )}
      {systemStats.gpu_available === false && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-3 text-gray-400">
            <Zap className="w-5 h-5" />
            <p>
              GPU monitoring not available (GPUtil not installed or no GPU
              detected)
            </p>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
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
                formatter={(value) => `${value.toFixed(1)}%`}
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
        </motion.div>

        {/* Memory Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
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
                formatter={(value) => `${value.toFixed(1)}%`}
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
        </motion.div>
      </div>

      {/* Network Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
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
            <p className="text-gray-400 text-sm mb-1">Packets Sent</p>
            <p className="text-2xl font-bold text-white">
              {systemStats.network.packets_sent.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Packets Received</p>
            <p className="text-2xl font-bold text-white">
              {systemStats.network.packets_recv.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold mb-4">System Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Operating System</p>
            <p className="text-white font-medium">
              {systemStats.system.os} {systemStats.system.release}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Processor</p>
            <p className="text-white font-medium">
              {systemStats.system.processor}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Architecture</p>
            <p className="text-white font-medium">
              {systemStats.system.machine}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
