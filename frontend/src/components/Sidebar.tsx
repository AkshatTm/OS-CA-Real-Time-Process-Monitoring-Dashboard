import { useState } from "react";
import {
  LayoutDashboard,
  Activity,
  List,
  AppWindow,
  Settings,
  LucideIcon,
} from "lucide-react";
import type { TabType } from "../types";

interface MenuItem {
  id: TabType;
  icon: LucideIcon;
  label: string;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "performance", icon: Activity, label: "Performance" },
  { id: "apps", icon: AppWindow, label: "Apps" },
  { id: "processes", icon: List, label: "Processes" },
];

interface SidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
}

export default function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
  const [settingsRotate, setSettingsRotate] = useState(0);

  return (
    <aside className="w-20 glass-card m-4 mr-0 rounded-r-none flex flex-col items-center py-6 space-y-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
              isActive
                ? "bg-gradient-to-br from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/50"
                : "bg-dark-elevated text-gray-400 hover:text-white hover:bg-dark-elevated"
            }`}
            title={item.label}
          >
            <Icon className="w-6 h-6" />
          </button>
        );
      })}

      {/* Settings at bottom */}
      <div className="flex-1" />
      <button
        onClick={() => setSettingsRotate(settingsRotate + 90)}
        style={{ transform: `rotate(${settingsRotate}deg)` }}
        className="w-14 h-14 rounded-xl flex items-center justify-center bg-dark-elevated text-gray-400 hover:text-white hover:bg-dark-elevated transition-all duration-300 hover:scale-110 active:scale-95"
        title="Settings"
      >
        <Settings className="w-6 h-6" />
      </button>
    </aside>
  );
}
