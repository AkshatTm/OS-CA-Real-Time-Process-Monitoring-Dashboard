import React, { useState } from "react";
import { X } from "lucide-react";
import { formatBytes, formatPercentage } from "../updates/formatters";
import type { AppGroup } from "../types";

interface AppsListProps {
  apps: AppGroup[];
  onKillApp: (pids: number[]) => Promise<void>;
}

const AppsList: React.FC<AppsListProps> = ({ apps, onKillApp }) => {
  const [sortBy, setSortBy] = useState<"name" | "cpu" | "memory">("memory");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppGroup | null>(null);

  // Sort apps
  const sortedApps = [...apps].sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case "name":
        compareValue = a.name.localeCompare(b.name);
        break;
      case "cpu":
        compareValue = a.cpu_percent - b.cpu_percent;
        break;
      case "memory":
        compareValue = a.memory_mb - b.memory_mb;
        break;
    }

    return sortOrder === "asc" ? compareValue : -compareValue;
  });

  // Filter apps
  const filteredApps = sortedApps.filter((app) =>
    app.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSort = (column: "name" | "cpu" | "memory") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleEndTask = (app: AppGroup) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const confirmEndTask = async () => {
    if (!selectedApp) return;
    try {
      await onKillApp(selectedApp.pids);
      setShowModal(false);
      setSelectedApp(null);
    } catch (error) {
      console.error("Failed to kill app:", error);
      alert("Failed to end app. Try running as administrator.");
    }
  };

  const SortIcon = ({ column }: { column: "name" | "cpu" | "memory" }) => {
    if (sortBy !== column) return null;
    return (
      <span className="ml-1 text-blue-400">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-white">Apps</h2>
          <div className="text-sm text-gray-400">
            {filteredApps.length} {filteredApps.length === 1 ? "app" : "apps"}
          </div>
        </div>

        <input
          type="text"
          placeholder="Search apps..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr className="border-b border-gray-700">
              <th
                className="text-left px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center text-gray-300 font-semibold">
                  Name
                  <SortIcon column="name" />
                </div>
              </th>
              <th className="text-right px-4 py-3 text-gray-300 font-semibold">
                Status
              </th>
              <th className="text-right px-4 py-3 text-gray-300 font-semibold">
                Processes
              </th>
              <th
                className="text-right px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort("cpu")}
              >
                <div className="flex items-center justify-end text-gray-300 font-semibold">
                  CPU
                  <SortIcon column="cpu" />
                </div>
              </th>
              <th
                className="text-right px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSort("memory")}
              >
                <div className="flex items-center justify-end text-gray-300 font-semibold">
                  Memory
                  <SortIcon column="memory" />
                </div>
              </th>
              <th className="text-right px-4 py-3 text-gray-300 font-semibold w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  {filter
                    ? "No apps found matching your search"
                    : "No user applications running"}
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => (
                <tr
                  key={app.name}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white font-bold mr-3">
                        {app.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-medium">{app.name}</div>
                        {app.exe && (
                          <div
                            className="text-xs text-gray-500 truncate max-w-xs"
                            title={app.exe}
                          >
                            {app.exe}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        app.status === "running"
                          ? "bg-green-900 text-green-300"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="text-right px-4 py-3 text-gray-300">
                    {app.process_count}
                  </td>
                  <td className="text-right px-4 py-3">
                    <div className="flex flex-col items-end">
                      <span
                        className={`font-mono ${
                          app.cpu_percent > 50
                            ? "text-red-400"
                            : app.cpu_percent > 20
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        {formatPercentage(app.cpu_percent)}
                      </span>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3">
                    <div className="flex flex-col items-end">
                      <span className="text-white font-mono">
                        {formatBytes(app.memory_mb * 1048576)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatPercentage(app.memory_percent)}
                      </span>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3">
                    <button
                      onClick={() => handleEndTask(app)}
                      className="p-2 hover:bg-red-600/20 rounded-lg transition-colors group"
                      title="End Task"
                    >
                      <X className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats footer */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex justify-between text-xs text-gray-400">
        <div>
          Total processes:{" "}
          {apps.reduce((sum, app) => sum + app.process_count, 0)}
        </div>
        <div>
          Total CPU:{" "}
          {formatPercentage(
            apps.reduce((sum, app) => sum + app.cpu_percent, 0)
          )}
        </div>
        <div>
          Total Memory:{" "}
          {formatBytes(
            apps.reduce((sum, app) => sum + app.memory_mb, 0) * 1048576
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">End Task</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to end{" "}
              <span className="font-semibold text-white">
                {selectedApp.name}
              </span>
              ? This will close all {selectedApp.process_count} process(es).
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedApp(null);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmEndTask}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                End Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppsList;
