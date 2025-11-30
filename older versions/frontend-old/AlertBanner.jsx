import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const AlertBanner = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  const getAlertColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 border-red-500 text-red-200";
      case "warning":
        return "bg-yellow-500/20 border-yellow-500 text-yellow-200";
      default:
        return "bg-blue-500/20 border-blue-500 text-blue-200";
    }
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case "critical":
        return "🔴";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="space-y-2 mb-4">
      <AnimatePresence>
        {alerts.map((alert, index) => (
          <motion.div
            key={`${alert.type}-${index}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg border-l-4 backdrop-blur-sm ${getAlertColor(
              alert.severity
            )}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getAlertIcon(alert.severity)}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm uppercase tracking-wide">
                  {alert.severity} Alert
                </p>
                <p className="text-base mt-1">{alert.message}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{alert.value}%</p>
                <p className="text-xs opacity-75">Current Usage</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AlertBanner;
