import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  AlertCircle,
  XCircle,
  Pause,
  Play,
  Info,
  RefreshCw,
  Shield,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProcessList({ processes, loading, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("cpu_percent");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processDetails, setProcessDetails] = useState(null);

  // Filter and sort processes
  const filteredProcesses = processes
    .filter(
      (proc) =>
        proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.pid.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleKillProcess = async (pid, processName, isProtected) => {
    if (isProtected) {
      toast.error(
        `Cannot terminate "${processName}". This is a protected system process.`,
        {
          duration: 4000,
          icon: "🛡️",
        }
      );
      return;
    }

    if (!confirm(`Are you sure you want to end "${processName}"?`)) return;

    const loadingToast = toast.loading("Ending process...");

    try {
      await axios.post(`/api/process/${pid}/kill`);
      toast.success(`Process ${processName} ended successfully`, {
        id: loadingToast,
      });
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to end process", {
        id: loadingToast,
      });
    }
  };

  const handleSuspendProcess = async (pid, processName, isProtected) => {
    if (isProtected) {
      toast.error(
        `Cannot suspend "${processName}". This is a protected system process.`,
        {
          duration: 4000,
          icon: "🛡️",
        }
      );
      return;
    }

    const loadingToast = toast.loading("Suspending process...");

    try {
      await axios.post(`/api/process/${pid}/suspend`);
      toast.success("Process suspended", { id: loadingToast });
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to suspend process", {
        id: loadingToast,
      });
    }
  };

  const handleResumeProcess = async (pid) => {
    const loadingToast = toast.loading("Resuming process...");

    try {
      await axios.post(`/api/process/${pid}/resume`);
      toast.success("Process resumed", { id: loadingToast });
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to resume process", {
        id: loadingToast,
      });
    }
  };

  const showProcessDetails = async (pid) => {
    const loadingToast = toast.loading("Loading process details...");

    try {
      const response = await axios.get(`/api/process/${pid}`);
      setProcessDetails(response.data);
      setShowModal(true);
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to load process details",
        { id: loadingToast }
      );
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      running: "text-accent-success",
      sleeping: "text-blue-400",
      stopped: "text-accent-warning",
      zombie: "text-accent-danger",
    };
    return colors[status] || "text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Process Manager</h2>
          <p className="text-gray-400">
            Manage and monitor all running processes
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Search and Stats */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search processes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-dark-elevated border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-white placeholder-gray-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-400">
              Total:{" "}
              <span className="text-white font-semibold">
                {processes.length}
              </span>
            </span>
            <span className="text-gray-400">
              Filtered:{" "}
              <span className="text-white font-semibold">
                {filteredProcesses.length}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Process Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-elevated/50">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                >
                  Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("pid")}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                >
                  PID {sortBy === "pid" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("cpu_percent")}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                >
                  CPU %{" "}
                  {sortBy === "cpu_percent" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("memory_mb")}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                >
                  Memory{" "}
                  {sortBy === "memory_mb" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                >
                  Status{" "}
                  {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredProcesses.slice(0, 50).map((proc, index) => (
                <motion.tr
                  key={proc.pid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.01 }}
                  className="hover:bg-dark-elevated/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedProcess(proc)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white flex items-center">
                      {proc.protected && (
                        <Shield
                          className="w-4 h-4 mr-2 text-yellow-500"
                          title="Protected System Process"
                        />
                      )}
                      {proc.name}
                    </div>
                    <div className="text-xs text-gray-500">{proc.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {proc.pid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-dark-border rounded-full h-2 mr-2">
                        <div
                          className="bg-gradient-to-r from-accent-primary to-accent-secondary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(proc.cpu_percent, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-white">
                        {proc.cpu_percent}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {proc.memory_mb} MB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${getStatusColor(
                        proc.status
                      )}`}
                    >
                      {proc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        showProcessDetails(proc.pid);
                      }}
                      className="inline-flex items-center p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      title="Details"
                    >
                      <Info className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: proc.protected ? 1 : 1.1 }}
                      whileTap={{ scale: proc.protected ? 1 : 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSuspendProcess(
                          proc.pid,
                          proc.name,
                          proc.protected
                        );
                      }}
                      className={`inline-flex items-center p-2 rounded-lg transition-colors ${
                        proc.protected
                          ? "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                          : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                      }`}
                      title={
                        proc.protected ? "Protected System Process" : "Suspend"
                      }
                      disabled={proc.protected}
                    >
                      <Pause className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: proc.protected ? 1 : 1.1 }}
                      whileTap={{ scale: proc.protected ? 1 : 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKillProcess(proc.pid, proc.name, proc.protected);
                      }}
                      className={`inline-flex items-center p-2 rounded-lg transition-colors ${
                        proc.protected
                          ? "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      }`}
                      title={
                        proc.protected
                          ? "Protected System Process"
                          : "End Process"
                      }
                      disabled={proc.protected}
                    >
                      <XCircle className="w-4 h-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Details Modal */}
      <AnimatePresence>
        {showModal && processDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card-elevated max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Process Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Process Name</p>
                    <p className="text-white font-medium">
                      {processDetails.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">PID</p>
                    <p className="text-white font-medium">
                      {processDetails.pid}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <p
                      className={`font-medium ${getStatusColor(
                        processDetails.status
                      )}`}
                    >
                      {processDetails.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">User</p>
                    <p className="text-white font-medium">
                      {processDetails.username || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">CPU Usage</p>
                    <p className="text-white font-medium">
                      {processDetails.cpu_percent}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Memory Usage</p>
                    <p className="text-white font-medium">
                      {processDetails.memory_formatted}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Threads</p>
                    <p className="text-white font-medium">
                      {processDetails.num_threads}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Parent PID</p>
                    <p className="text-white font-medium">
                      {processDetails.ppid || "N/A"}
                    </p>
                  </div>
                </div>

                {processDetails.exe && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Executable Path
                    </p>
                    <p className="text-white font-medium text-sm break-all bg-dark-elevated p-3 rounded-lg">
                      {processDetails.exe}
                    </p>
                  </div>
                )}

                {processDetails.cmdline &&
                  processDetails.cmdline.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Command Line</p>
                      <p className="text-white font-medium text-sm break-all bg-dark-elevated p-3 rounded-lg">
                        {processDetails.cmdline.join(" ")}
                      </p>
                    </div>
                  )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      handleKillProcess(
                        processDetails.pid,
                        processDetails.name,
                        processDetails.protected
                      );
                      if (!processDetails.protected) {
                        setShowModal(false);
                      }
                    }}
                    className={`flex items-center space-x-2 ${
                      processDetails.protected
                        ? "bg-gray-500/20 text-gray-500 cursor-not-allowed px-6 py-3 rounded-lg"
                        : "btn-danger"
                    }`}
                    disabled={processDetails.protected}
                    title={
                      processDetails.protected
                        ? "Protected System Process"
                        : "End Process"
                    }
                  >
                    {processDetails.protected && <Shield className="w-4 h-4" />}
                    <XCircle className="w-4 h-4" />
                    <span>
                      {processDetails.protected
                        ? "Protected Process"
                        : "End Process"}
                    </span>
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn-ghost"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
