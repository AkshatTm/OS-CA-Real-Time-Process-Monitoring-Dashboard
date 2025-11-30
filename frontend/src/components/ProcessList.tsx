import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, RefreshCw, Shield, Info, Pause, Play } from "lucide-react";
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

  const handleSuspendProcess = async (proc: Process) => {
    // Suspend/Resume not implemented in current backend
    toast.error("Suspend/Resume feature not available in current version", {
      duration: 3000,
      icon: "⚠️",
    });
    return;
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
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-white">Processes</h2>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">
              {filteredProcesses.length} processes
            </div>
            <button
              onClick={onRefresh}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or PID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr className="border-b border-gray-700">
              <th className="text-left px-4 py-3 text-gray-300 font-semibold">
                PID
              </th>
              <th
                className="text-left px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center text-gray-300 font-semibold">
                  Name
                  <SortIcon column="name" />
                </div>
              </th>
              <th className="text-left px-4 py-3 text-gray-300 font-semibold">
                User
              </th>
              <th
                className="text-right px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort("cpu_percent")}
              >
                <div className="flex items-center justify-end text-gray-300 font-semibold">
                  CPU %
                  <SortIcon column="cpu_percent" />
                </div>
              </th>
              <th
                className="text-right px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort("memory_mb")}
              >
                <div className="flex items-center justify-end text-gray-300 font-semibold">
                  Memory
                  <SortIcon column="memory_mb" />
                </div>
              </th>
              <th className="text-center px-4 py-3 text-gray-300 font-semibold">
                Status
              </th>
              <th className="text-right px-4 py-3 text-gray-300 font-semibold w-48">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProcesses.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No processes found
                </td>
              </tr>
            ) : (
              filteredProcesses.map((proc) => (
                <tr
                  key={proc.pid}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-300 font-mono">
                    {proc.pid}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {proc.name}
                      </span>
                      {proc.is_protected && (
                        <span title="Protected system process">
                          <Shield className="w-4 h-4 text-yellow-500" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {proc.username}
                  </td>
                  <td className="text-right px-4 py-3">
                    <span
                      className={`font-mono ${
                        proc.cpu_percent > 50
                          ? "text-red-400"
                          : proc.cpu_percent > 20
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      {proc.cpu_percent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right px-4 py-3 text-white font-mono">
                    {proc.memory_mb.toFixed(1)} MB
                  </td>
                  <td className="text-center px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        proc.status === "running"
                          ? "bg-green-900 text-green-300"
                          : proc.status === "sleeping"
                          ? "bg-blue-900 text-blue-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {proc.status}
                    </span>
                  </td>
                  <td className="text-right px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleShowInfo(proc)}
                        className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors group"
                        title="Process Info"
                      >
                        <Info className="w-4 h-4 text-blue-500 group-hover:text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleSuspendProcess(proc)}
                        disabled={proc.is_protected}
                        className={`p-2 rounded-lg transition-colors group ${
                          proc.is_protected
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-yellow-600/20"
                        }`}
                        title={proc.status === "stopped" ? "Resume" : "Suspend"}
                      >
                        {proc.status === "stopped" ? (
                          <Play className="w-4 h-4 text-green-500 group-hover:text-green-400" />
                        ) : (
                          <Pause className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleKillProcess(proc)}
                        disabled={proc.is_protected}
                        className={`p-2 rounded-lg transition-colors group ${
                          proc.is_protected
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-red-600/20"
                        }`}
                        title="End Task"
                      >
                        <X className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats footer */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex justify-between text-xs text-gray-400">
        <div>Total Processes: {processes.length}</div>
        <div>
          Running: {processes.filter((p) => p.status === "running").length}
        </div>
        <div>
          Total CPU:{" "}
          {processes.reduce((sum, p) => sum + p.cpu_percent, 0).toFixed(1)}%
        </div>
        <div>
          Total Memory:{" "}
          {processes.reduce((sum, p) => sum + p.memory_mb, 0).toFixed(1)} MB
        </div>
      </div>

      {/* Kill Confirmation Modal */}
      {showKillModal && selectedProcess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">End Task</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to end{" "}
              <span className="font-semibold text-white">
                {selectedProcess.name}
              </span>{" "}
              (PID: {selectedProcess.pid})?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowKillModal(false);
                  setSelectedProcess(null);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmKillProcess}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                End Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process Info Modal */}
      {showInfoModal && selectedProcess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 border border-gray-700 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Process Information
              </h3>
              <button
                onClick={() => {
                  setShowInfoModal(false);
                  setSelectedProcess(null);
                  setProcessInfo(null);
                }}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {!processInfo ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-400 mt-4">
                  Loading process information...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Name</p>
                    <p className="text-white font-semibold">
                      {processInfo.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">PID</p>
                    <p className="text-white font-mono">{processInfo.pid}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Status</p>
                    <p className="text-white">{processInfo.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">User</p>
                    <p className="text-white">{processInfo.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">CPU Usage</p>
                    <p className="text-white font-mono">
                      {processInfo.cpu_percent.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Threads</p>
                    <p className="text-white">{processInfo.num_threads}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Memory (RSS)</p>
                    <p className="text-white font-mono">
                      {processInfo.memory_info.rss_formatted}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Memory (VMS)</p>
                    <p className="text-white font-mono">
                      {processInfo.memory_info.vms_formatted}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Connections</p>
                    <p className="text-white">{processInfo.connections}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Open Files</p>
                    <p className="text-white">{processInfo.open_files}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Executable Path</p>
                  <p className="text-white text-sm break-all bg-gray-900 p-2 rounded">
                    {processInfo.exe}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    Working Directory
                  </p>
                  <p className="text-white text-sm break-all bg-gray-900 p-2 rounded">
                    {processInfo.cwd}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Command Line</p>
                  <p className="text-white text-sm break-all bg-gray-900 p-2 rounded">
                    {processInfo.cmdline}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
