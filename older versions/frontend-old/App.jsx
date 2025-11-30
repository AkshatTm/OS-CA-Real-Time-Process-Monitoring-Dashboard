import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ProcessList from "./components/ProcessList";
import PerformanceTab from "./components/PerformanceTab";
import axios from "axios";

// Configure axios
const API_URL = "http://localhost:8000";
axios.defaults.baseURL = API_URL;

function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [systemStats, setSystemStats] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch system stats
  const fetchSystemStats = async () => {
    try {
      const response = await axios.get("/api/system/stats");
      setSystemStats(response.data);
    } catch (error) {
      console.error("Error fetching system stats:", error);
    }
  };

  // Fetch processes
  const fetchProcesses = async () => {
    try {
      const response = await axios.get("/api/processes");
      setProcesses(response.data.processes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching processes:", error);
      setLoading(false);
    }
  };

  // Auto-refresh data
  useEffect(() => {
    fetchSystemStats();
    fetchProcesses();

    const interval = setInterval(() => {
      fetchSystemStats();
      fetchProcesses();
    }, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a24",
            color: "#fff",
            border: "1px solid #2a2a3a",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Sidebar */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header systemStats={systemStats} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentTab === "dashboard" && (
                <Dashboard
                  systemStats={systemStats}
                  processes={processes}
                  loading={loading}
                />
              )}
              {currentTab === "performance" && (
                <PerformanceTab systemStats={systemStats} />
              )}
              {currentTab === "processes" && (
                <ProcessList
                  processes={processes}
                  loading={loading}
                  onRefresh={fetchProcesses}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
