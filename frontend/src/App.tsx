import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AppsList from "./components/AppsList";
import ProcessList from "./components/ProcessList";
import PerformanceTab from "./components/PerformanceTab";
import LoadingScreen from "./components/LoadingScreen";
import axios from "axios";
import type {
  SystemStats,
  Process,
  AppGroup,
  TabType,
  ProcessListResponse,
  AppsListResponse,
} from "./types";

// Configure axios
const RUST_API_URL = "http://localhost:8000"; // Rust backend (fast)
const PYTHON_API_URL = "http://localhost:8001"; // Python backend (accurate CPU)

// Set axios defaults for better stability
axios.defaults.timeout = 5000; // 5 second timeout
axios.defaults.headers.common["Connection"] = "close"; // Prevent keep-alive issues

function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("performance");
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [apps, setApps] = useState<AppGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  // Fetch system stats from Rust backend
  const fetchSystemStats = async (): Promise<void> => {
    try {
      console.log("Fetching stats from Rust backend...");
      const response = await axios.get<SystemStats>(
        `${RUST_API_URL}/api/stats`
      );
      console.log("Stats received:", response.data);
      setSystemStats(response.data);
    } catch (error) {
      console.error("Error fetching system stats:", error);
    }
  };

  // Fetch processes from Python backend (accurate CPU)
  const fetchProcesses = async (): Promise<void> => {
    try {
      console.log("Fetching processes from Python backend...");
      const response = await axios.get<ProcessListResponse>(
        `${PYTHON_API_URL}/api/processes`
      );
      console.log(
        "Processes received:",
        response.data.total_count,
        "processes"
      );
      setProcesses(response.data.processes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching processes:", error);
      setLoading(false);
    }
  };

  // Fetch apps from Python backend (accurate CPU)
  const fetchApps = async (): Promise<void> => {
    try {
      console.log("Fetching apps from Python backend...");
      const response = await axios.get<AppsListResponse>(
        `${PYTHON_API_URL}/api/apps`
      );
      console.log("Apps received:", response.data.total_count, "apps");
      setApps(response.data.apps);
    } catch (error) {
      console.error("Error fetching apps:", error);
    }
  };

  // Kill an app (all its processes) - use Rust backend for speed
  const killApp = async (pids: number[]): Promise<void> => {
    try {
      await axios.post(`${RUST_API_URL}/api/app/close`, pids);
      // Refresh both apps and processes
      await Promise.all([fetchApps(), fetchProcesses()]);
    } catch (error) {
      console.error("Error killing app:", error);
      throw error;
    }
  };

  // Auto-refresh data
  useEffect(() => {
    const loadInitialData = async () => {
      console.log("🚀 Starting initial data load...");
      try {
        const results = await Promise.allSettled([
          fetchSystemStats(),
          fetchProcesses(),
          fetchApps(),
        ]);

        console.log("Results:", results);

        // Check if any succeeded
        const anySuccess = results.some((r) => r.status === "fulfilled");
        if (anySuccess) {
          console.log("✅ At least one data source loaded successfully!");
        } else {
          console.warn("⚠️ All data sources failed, but showing app anyway");
        }

        setInitialLoad(false);
      } catch (error) {
        console.error("❌ Error loading initial data:", error);
        // Still show the app even if there's an error
        setInitialLoad(false);
      }
    };

    loadInitialData();

    const interval = setInterval(() => {
      fetchSystemStats();
      fetchProcesses();
      fetchApps();
    }, 2000); // Refresh every 2 seconds (balanced for stability)

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {initialLoad ? (
        <LoadingScreen />
      ) : (
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
                {currentTab === "dashboard" && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard
                      systemStats={systemStats}
                      processes={processes}
                      loading={loading}
                    />
                  </motion.div>
                )}
                {currentTab === "performance" && (
                  <motion.div
                    key="performance"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PerformanceTab systemStats={systemStats} />
                  </motion.div>
                )}
                {currentTab === "apps" && (
                  <motion.div
                    key="apps"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AppsList apps={apps} onKillApp={killApp} />
                  </motion.div>
                )}
                {currentTab === "processes" && (
                  <motion.div
                    key="processes"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProcessList
                      processes={processes}
                      loading={loading}
                      onRefresh={fetchProcesses}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
