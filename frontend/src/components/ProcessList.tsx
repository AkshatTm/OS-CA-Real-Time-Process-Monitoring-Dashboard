import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Search, X, RefreshCw, Shield, Info } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import type { Process } from "../types";

// Backend URLs
const RUST_API_URL = "http://localhost:8000"; // Rust backend for killing processes

interface ProcessInfo {
  pid: number;
  name: string;
  status: string;
  username: string;
  create_time: number;
  cpu_percent: number;
  memory_info: {
    rss: number;
    vms: number;
    rss_formatted: string;
    vms_formatted: string;
  };
  num_threads: number;
  exe: string;
  cwd: string;
  cmdline: string;
  connections: number;
  open_files: number;
}

interface ProcessListProps {
  processes: Process[];
  loading: boolean;
  onRefresh: () => void;
}

export default function ProcessList({
  processes,
  loading,
  onRefresh,
}: ProcessListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Process>("cpu_percent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showKillModal, setShowKillModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [processInfo, setProcessInfo] = useState<ProcessInfo | null>(null);
  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  // GSAP stagger animation for table rows
  useEffect(() => {
    if (tableRowsRef.current.length > 0) {
      gsap.fromTo(
        tableRowsRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.02,
          ease: "power2.out",
        }
      );
    }
  }, [filteredProcesses]);

  // Filter and sort processes
  const filteredProcesses = processes
    .filter(
      (proc) =>
        proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.pid.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      const aVal = a[sortBy] as number;
      const bVal = b[sortBy] as number;
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

  const handleSort = (column: keyof Process) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleKillProcess = (proc: Process) => {
    if (proc.is_protected) {
      toast.error(
        `Cannot terminate "${proc.name}". This is a protected system process.`,
        {
          duration: 4000,
          icon: "🛡️",
        }
      );
      return;
    }
    setSelectedProcess(proc);
    setShowKillModal(true);
  };

  const confirmKillProcess = async () => {
    if (!selectedProcess) return;
    const loadingToast = toast.loading("Ending process...");

    try {
      // Use Rust backend for killing processes
      await axios.post(
        `${RUST_API_URL}/api/process/${selectedProcess.pid}/kill`
      );
      toast.success(`Process ${selectedProcess.name} ended successfully`, {
        id: loadingToast,
      });
      setShowKillModal(false);
      setSelectedProcess(null);
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to end process", {
        id: loadingToast,
      });
    }
  };

  const handleShowInfo = async (proc: Process) => {
    setSelectedProcess(proc);
    setShowInfoModal(true);

    try {
      // Use Rust backend for process info
      const response = await axios.get(
        `${RUST_API_URL}/api/process/${proc.pid}/info`
      );
      setProcessInfo(response.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail || "Failed to fetch process info"
      );
      setProcessInfo(null);
    }
  };

  const SortIcon = ({ column }: { column: keyof Process }) => {
    if (sortBy !== column) return null;
    return (
      <span className="ml-1 text-blue-400">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  if (loading) {
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

  return (
    <div className="flex flex-col h-full">
      {/* Modern Header with Gradient */}
      <div className="glass-card p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Processes
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {filteredProcesses.length} active processes
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="group p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or PID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-dark-elevated/50 text-white rounded-xl border border-dark-border/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Modern Table with Glass Morphism */}
      <div className="glass-card flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-dark-elevated/90 backdrop-blur-xl border-b border-dark-border/50">
                <th className="text-left px-6 py-4 text-gray-300 font-semibold text-sm">
                  PID
                </th>
                <th
                  className="text-left px-6 py-4 cursor-pointer hover:bg-dark-surface/30 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center text-gray-300 font-semibold text-sm">
                    Name
                    <SortIcon column="name" />
                  </div>
                </th>
                <th className="text-left px-6 py-4 text-gray-300 font-semibold text-sm">
                  User
                </th>
                <th
                  className="text-right px-6 py-4 cursor-pointer hover:bg-dark-surface/30 transition-colors"
                  onClick={() => handleSort("cpu_percent")}
                >
                  <div className="flex items-center justify-end text-gray-300 font-semibold text-sm">
                    CPU %
                    <SortIcon column="cpu_percent" />
                  </div>
                </th>
                <th
                  className="text-right px-6 py-4 cursor-pointer hover:bg-dark-surface/30 transition-colors"
                  onClick={() => handleSort("memory_mb")}
                >
                  <div className="flex items-center justify-end text-gray-300 font-semibold text-sm">
                    Memory
                    <SortIcon column="memory_mb" />
                  </div>
                </th>
                <th className="text-center px-6 py-4 text-gray-300 font-semibold text-sm">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-gray-300 font-semibold text-sm w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProcesses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="w-12 h-12 text-gray-600" />
                      <p>No processes found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProcesses.map((proc, index) => (
                  <tr
                    key={proc.pid}
                    ref={(el) => {
                      if (el) tableRowsRef.current[index] = el;
                    }}
                    className="border-b border-dark-border/30 hover:bg-dark-surface/20 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                      {proc.pid}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">
                          {proc.name}
                        </span>
                        {proc.is_protected && (
                          <span
                            title="Protected system process"
                            className="flex items-center"
                          >
                            <Shield className="w-4 h-4 text-yellow-400" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {proc.username}
                    </td>
                    <td className="text-right px-6 py-4">
                      <span
                        className={`font-mono text-sm font-semibold ${
                          proc.cpu_percent > 50
                            ? "text-red-400"
                            : proc.cpu_percent > 20
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {proc.cpu_percent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right px-6 py-4 text-white font-mono text-sm">
                      {proc.memory_mb.toFixed(1)} MB
                    </td>
                    <td className="text-center px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          proc.status === "running"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : proc.status === "sleeping"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}
                      >
                        {proc.status}
                      </span>
                    </td>
                    <td className="text-right px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleShowInfo(proc)}
                          className="p-2 hover:bg-blue-500/20 rounded-lg transition-all duration-200 group/btn border border-transparent hover:border-blue-500/30"
                          title="Process Info"
                        >
                          <Info className="w-4 h-4 text-blue-400 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleKillProcess(proc)}
                          disabled={proc.is_protected}
                          className={`p-2 rounded-lg transition-all duration-200 group/btn border border-transparent ${
                            proc.is_protected
                              ? "opacity-30 cursor-not-allowed"
                              : "hover:bg-red-500/20 hover:border-red-500/30"
                          }`}
                          title="End Task"
                        >
                          <X className="w-4 h-4 text-red-400 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modern Stats Footer */}
        <div className="px-6 py-4 bg-dark-elevated/50 backdrop-blur-xl border-t border-dark-border/50">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Total</span>
              <span className="text-white font-semibold">
                {processes.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Running</span>
              <span className="text-green-400 font-semibold">
                {processes.filter((p) => p.status === "running").length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Total CPU</span>
              <span className="text-blue-400 font-semibold font-mono">
                {processes
                  .reduce((sum, p) => sum + p.cpu_percent, 0)
                  .toFixed(1)}
                %
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Total Memory</span>
              <span className="text-purple-400 font-semibold font-mono">
                {processes.reduce((sum, p) => sum + p.memory_mb, 0).toFixed(1)}{" "}
                MB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Kill Confirmation Modal */}
      {showKillModal && selectedProcess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-8 max-w-md w-full mx-4 border-2 border-red-500/30"
          >
            <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              End Task
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Are you sure you want to end{" "}
              <span className="font-bold text-white bg-dark-elevated px-2 py-1 rounded">
                {selectedProcess.name}
              </span>{" "}
              <span className="text-gray-500">
                (PID: {selectedProcess.pid})
              </span>
              ?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowKillModal(false);
                  setSelectedProcess(null);
                }}
                className="px-6 py-3 bg-dark-elevated/80 hover:bg-dark-elevated text-white rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmKillProcess}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 font-medium"
              >
                End Task
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modern Process Info Modal */}
      {showInfoModal && selectedProcess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto border-2 border-blue-500/30"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Process Information
              </h3>
              <button
                onClick={() => {
                  setShowInfoModal(false);
                  setSelectedProcess(null);
                  setProcessInfo(null);
                }}
                className="p-2 hover:bg-dark-surface/50 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            {!processInfo ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-400 mt-6 font-medium">
                  Loading process information...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-card-elevated p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Name</p>
                    <p className="text-white font-semibold text-lg">
                      {processInfo.name}
                    </p>
                  </div>
                  <div className="glass-card-elevated p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">PID</p>
                    <p className="text-white font-mono text-lg font-semibold">
                      {processInfo.pid}
                    </p>
                  </div>
                  <div className="glass-card-elevated p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <p className="text-white capitalize font-medium">
                      {processInfo.status}
                    </p>
                  </div>
                  <div className="glass-card-elevated p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">User</p>
                    <p className="text-white font-medium">
                      {processInfo.username}
                    </p>
                  </div>
                  <div className="glass-card-elevated p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">CPU Usage</p>
                    <p className="text-blue-400 font-mono text-lg font-bold">
                      {processInfo.cpu_percent.toFixed(1)}%
                    </p>
                  </div>
                  <div className="glass-card-elevated p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Threads</p>
                    <p className="text-purple-400 font-semibold text-lg">
                      {processInfo.num_threads}
                    </p>
                  </div>
                  <div className="glass-card-elevated p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Memory (RSS)</p>
                    <p className="text-green-400 font-mono font-semibold">
                      {processInfo.memory_info.rss_formatted}
                    </p>
                  </div>
                  <div className="glass-card-elevated p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Memory (VMS)</p>
                    <p className="text-green-400 font-mono font-semibold">
                      {processInfo.memory_info.vms_formatted}
                    </p>
                  </div>
                  <div className="glass-card-elevated p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Connections</p>
                    <p className="text-yellow-400 font-semibold text-lg">
                      {processInfo.connections}
                    </p>
                  </div>
                  <div className="glass-card-elevated p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Open Files</p>
                    <p className="text-yellow-400 font-semibold text-lg">
                      {processInfo.open_files}
                    </p>
                  </div>
                </div>

                <div className="glass-card-elevated p-4 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2">Executable Path</p>
                  <p className="text-white text-sm break-all font-mono bg-dark-bg/50 p-3 rounded-lg">
                    {processInfo.exe}
                  </p>
                </div>

                <div className="glass-card-elevated p-4 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2">
                    Working Directory
                  </p>
                  <p className="text-white text-sm break-all font-mono bg-dark-bg/50 p-3 rounded-lg">
                    {processInfo.cwd}
                  </p>
                </div>

                <div className="glass-card-elevated p-4 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2">Command Line</p>
                  <p className="text-white text-sm break-all font-mono bg-dark-bg/50 p-3 rounded-lg">
                    {processInfo.cmdline}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
