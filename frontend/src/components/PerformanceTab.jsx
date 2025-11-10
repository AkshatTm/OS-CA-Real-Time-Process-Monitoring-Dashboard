import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { Cpu, Activity, HardDrive, Network, Zap } from "lucide-react";

export default function PerformanceTab({ systemStats }) {
  const [cpuHistory, setCpuHistory] = useState(
    Array(60)
      .fill(0)
      .map((_, i) => ({ time: i, value: 0 }))
  );
  const [memHistory, setMemHistory] = useState(
    Array(60)
      .fill(0)
      .map((_, i) => ({ time: i, value: 0 }))
  );
  const [diskHistory, setDiskHistory] = useState(
    Array(60)
      .fill(0)
      .map((_, i) => ({ time: i, value: 0 }))
  );
  const [gpuHistory, setGpuHistory] = useState(
    Array(60)
      .fill(0)
      .map((_, i) => ({ time: i, value: 0 }))
  );

  useEffect(() => {
    if (systemStats) {
      setCpuHistory((prev) => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          value: systemStats.cpu.percent,
        },
      ]);
      setMemHistory((prev) => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          value: systemStats.memory.percent,
        },
      ]);
      setDiskHistory((prev) => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          value: systemStats.disk.percent,
        },
      ]);

      // Update GPU history if available
      if (
        systemStats.gpu_available &&
        systemStats.gpu &&
        systemStats.gpu.length > 0
      ) {
        setGpuHistory((prev) => [
          ...prev.slice(1),
          {
            time: prev[prev.length - 1].time + 1,
            value: systemStats.gpu[0].load, // Track first GPU
          },
        ]);
      }
    }
  }, [systemStats]);

  if (!systemStats) {
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

  const PerformanceCard = ({
    title,
    icon: Icon,
    data,
    value,
    subtitle,
    color,
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, 100]} tick={{ fill: "#6b7280" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a24",
              border: "1px solid #2a2a3a",
              borderRadius: "8px",
            }}
            formatter={(value) => [`${value.toFixed(1)}%`, title]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={
              color.includes("blue")
                ? "#6366f1"
                : color.includes("purple")
                ? "#8b5cf6"
                : "#f59e0b"
            }
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Performance Monitor</h2>
        <p className="text-gray-400">Real-time system performance metrics</p>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceCard
          title="CPU"
          icon={Cpu}
          data={cpuHistory}
          value={`${systemStats.cpu.percent.toFixed(1)}%`}
          subtitle={`${systemStats.cpu.cores.logical} logical cores`}
          color="from-blue-500 to-purple-500"
        />

        <PerformanceCard
          title="Memory"
          icon={Activity}
          data={memHistory}
          value={`${systemStats.memory.percent.toFixed(1)}%`}
          subtitle={`${systemStats.memory.used_formatted} / ${systemStats.memory.total_formatted}`}
          color="from-purple-500 to-pink-500"
        />

        <PerformanceCard
          title="Disk"
          icon={HardDrive}
          data={diskHistory}
          value={`${systemStats.disk.percent.toFixed(1)}%`}
          subtitle={`${systemStats.disk.used_formatted} / ${systemStats.disk.total_formatted}`}
          color="from-orange-500 to-red-500"
        />

        {/* GPU Card - Show if available */}
        {systemStats.gpu_available &&
        systemStats.gpu &&
        systemStats.gpu.length > 0 ? (
          <PerformanceCard
            title={`GPU: ${systemStats.gpu[0].name}`}
            icon={Zap}
            data={gpuHistory}
            value={`${systemStats.gpu[0].load.toFixed(1)}%`}
            subtitle={`${(systemStats.gpu[0].memory_used / 1024).toFixed(
              1
            )}GB / ${(systemStats.gpu[0].memory_total / 1024).toFixed(1)}GB`}
            color="from-yellow-500 to-orange-500"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 flex items-center justify-center"
          >
            <div className="text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  GPU Not Available
                </h3>
                <p className="text-sm text-gray-400">
                  Install GPUtil or check GPU drivers
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Network</h3>
              <p className="text-sm text-gray-400">Data transfer rates</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-dark-elevated rounded-lg">
              <span className="text-gray-400">Sent</span>
              <span className="text-xl font-bold text-white">
                {systemStats.network.bytes_sent_formatted}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-dark-elevated rounded-lg">
              <span className="text-gray-400">Received</span>
              <span className="text-xl font-bold text-white">
                {systemStats.network.bytes_recv_formatted}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-dark-elevated rounded-lg">
              <span className="text-gray-400">Packets Sent</span>
              <span className="text-xl font-bold text-white">
                {systemStats.network.packets_sent.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-dark-elevated rounded-lg">
              <span className="text-gray-400">Packets Received</span>
              <span className="text-xl font-bold text-white">
                {systemStats.network.packets_recv.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CPU Per Core */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold mb-4">CPU Usage Per Core</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {systemStats.cpu.per_core.map((usage, index) => (
            <div key={index} className="text-center">
              <div className="mb-2">
                <div className="w-full h-24 bg-dark-elevated rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${usage}%` }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-accent-primary to-accent-secondary"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-400">Core {index}</p>
              <p className="text-sm font-semibold text-white">
                {usage.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* GPU Details - Show all GPUs if available */}
      {systemStats.gpu_available &&
        systemStats.gpu &&
        systemStats.gpu.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              GPU Details
            </h3>
            <div className="space-y-6">
              {systemStats.gpu.map((gpu, index) => (
                <div key={gpu.id} className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">
                    GPU {index}: {gpu.name}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-dark-elevated rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Load</p>
                      <p className="text-2xl font-bold text-white">
                        {gpu.load.toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-4 bg-dark-elevated rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Memory Used</p>
                      <p className="text-2xl font-bold text-white">
                        {(gpu.memory_used / 1024).toFixed(1)} GB
                      </p>
                    </div>
                    <div className="p-4 bg-dark-elevated rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Memory Total</p>
                      <p className="text-2xl font-bold text-white">
                        {(gpu.memory_total / 1024).toFixed(1)} GB
                      </p>
                    </div>
                    <div className="p-4 bg-dark-elevated rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Temperature</p>
                      <p className="text-2xl font-bold text-white">
                        {gpu.temperature}°C
                      </p>
                    </div>
                  </div>
                  {/* GPU Memory Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Memory Usage</span>
                      <span className="text-white font-semibold">
                        {gpu.memory_percent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-dark-elevated rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${gpu.memory_percent}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
    </div>
  );
}
