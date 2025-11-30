import { motion } from "framer-motion";
import { LayoutDashboard, Activity, List, Settings } from "lucide-react";

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "performance", icon: Activity, label: "Performance" },
  { id: "processes", icon: List, label: "Processes" },
];

export default function Sidebar({ currentTab, setCurrentTab }) {
  return (
    <aside className="w-20 glass-card m-4 mr-0 rounded-r-none flex flex-col items-center py-6 space-y-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        return (
          <motion.button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-br from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/50"
                : "bg-dark-elevated text-gray-400 hover:text-white hover:bg-dark-elevated"
            }`}
            title={item.label}
          >
            <Icon className="w-6 h-6" />
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}

      {/* Settings at bottom */}
      <div className="flex-1" />
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-xl flex items-center justify-center bg-dark-elevated text-gray-400 hover:text-white hover:bg-dark-elevated transition-all duration-300"
        title="Settings"
      >
        <Settings className="w-6 h-6" />
      </motion.button>
    </aside>
  );
}
