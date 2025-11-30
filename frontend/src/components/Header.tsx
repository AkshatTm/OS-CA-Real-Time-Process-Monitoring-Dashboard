import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Cpu, Activity, Clock } from "lucide-react";
import type { SystemStats } from "../types";

interface HeaderProps {
  systemStats: SystemStats | null;
}

export default function Header({ systemStats }: HeaderProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (logoRef.current && !animationRef.current) {
      animationRef.current = gsap.to(logoRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  const formatUptime = (seconds: number | undefined): string => {
    if (!seconds) return "0h 0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <header className="glass-card m-4 mb-0 p-4 border-b border-dark-border/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            ref={logoRef}
            className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center"
          >
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Task Manager Pro
            </h1>
            <p className="text-sm text-gray-400">Real-time System Monitor</p>
          </div>
        </div>

        {systemStats && (
          <div className="flex items-center space-x-6">
            {/* Quick Stats */}
            <div className="flex items-center space-x-2 px-4 py-2 glass-card">
              <Cpu className="w-4 h-4 text-accent-primary" />
              <div className="text-sm">
                <span className="text-gray-400">CPU:</span>{" "}
                <span className="font-semibold text-white">
                  {systemStats.cpu.percent.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-4 py-2 glass-card">
              <Activity className="w-4 h-4 text-accent-secondary" />
              <div className="text-sm">
                <span className="text-gray-400">RAM:</span>{" "}
                <span className="font-semibold text-white">
                  {systemStats.memory.percent.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-4 py-2 glass-card">
              <Clock className="w-4 h-4 text-accent-success" />
              <div className="text-sm">
                <span className="text-gray-400">Uptime:</span>{" "}
                <span className="font-semibold text-white">
                  {formatUptime(systemStats.system.uptime_seconds)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
