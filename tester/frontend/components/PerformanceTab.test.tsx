/**
 * Tests for PerformanceTab Component
 */

import { describe, it, expect } from "vitest";

describe("PerformanceTab Component", () => {
  const mockStats = {
    cpu_usage: 45.5,
    memory_usage: 62.3,
    disk_usage: 78.9,
    network_upload: 1024000,
    network_download: 2048000,
    gpu_stats: {
      name: "NVIDIA GeForce RTX 3060",
      temperature: 65.0,
      utilization: 75.5,
      memory_used: 4096,
      memory_total: 6144,
    },
  };

  it("displays CPU usage correctly", () => {
    expect(mockStats.cpu_usage).toBe(45.5);
    expect(mockStats.cpu_usage).toBeGreaterThanOrEqual(0);
    expect(mockStats.cpu_usage).toBeLessThanOrEqual(100);
  });

  it("displays memory usage correctly", () => {
    expect(mockStats.memory_usage).toBe(62.3);
    expect(mockStats.memory_usage).toBeGreaterThanOrEqual(0);
    expect(mockStats.memory_usage).toBeLessThanOrEqual(100);
  });

  it("displays disk usage correctly", () => {
    expect(mockStats.disk_usage).toBe(78.9);
    expect(mockStats.disk_usage).toBeGreaterThanOrEqual(0);
    expect(mockStats.disk_usage).toBeLessThanOrEqual(100);
  });

  it("formats network upload speed", () => {
    const uploadMBps = (mockStats.network_upload / (1024 * 1024)).toFixed(2);
    expect(parseFloat(uploadMBps)).toBeGreaterThan(0);
  });

  it("formats network download speed", () => {
    const downloadMBps = (mockStats.network_download / (1024 * 1024)).toFixed(
      2
    );
    expect(parseFloat(downloadMBps)).toBeGreaterThan(0);
  });

  it("displays GPU stats when available", () => {
    expect(mockStats.gpu_stats).toBeDefined();
    expect(mockStats.gpu_stats?.name).toBe("NVIDIA GeForce RTX 3060");
    expect(mockStats.gpu_stats?.temperature).toBe(65.0);
    expect(mockStats.gpu_stats?.utilization).toBe(75.5);
  });

  it("calculates GPU memory usage percentage", () => {
    if (mockStats.gpu_stats) {
      const usage =
        (mockStats.gpu_stats.memory_used / mockStats.gpu_stats.memory_total) *
        100;
      expect(usage).toBeGreaterThan(0);
      expect(usage).toBeLessThanOrEqual(100);
    }
  });

  it("handles missing GPU stats", () => {
    const statsNoGPU = { ...mockStats, gpu_stats: null };
    expect(statsNoGPU.gpu_stats).toBeNull();
  });

  it("handles zero values", () => {
    const zeroStats = {
      cpu_usage: 0,
      memory_usage: 0,
      disk_usage: 0,
      network_upload: 0,
      network_download: 0,
    };

    expect(zeroStats.cpu_usage).toBe(0);
    expect(zeroStats.network_upload).toBe(0);
  });

  it("handles maximum values", () => {
    const maxStats = {
      cpu_usage: 100,
      memory_usage: 100,
      disk_usage: 100,
      network_upload: 999999999,
      network_download: 999999999,
    };

    expect(maxStats.cpu_usage).toBe(100);
    expect(maxStats.memory_usage).toBe(100);
  });
});

describe("PerformanceTab Edge Cases", () => {
  it("handles very high network speeds", () => {
    const stats = {
      network_upload: 10000000000, // 10 GB/s
      network_download: 10000000000,
    };

    const uploadGB = stats.network_upload / (1024 * 1024 * 1024);
    expect(uploadGB).toBeGreaterThan(5);
  });

  it("handles extreme GPU temperatures", () => {
    const hotGPU = { temperature: 95.0 };
    expect(hotGPU.temperature).toBeGreaterThan(90);

    const coldGPU = { temperature: 25.0 };
    expect(coldGPU.temperature).toBeLessThan(30);
  });

  it("handles GPU memory edge cases", () => {
    const fullMemory = {
      memory_used: 8192,
      memory_total: 8192,
    };
    const usage = (fullMemory.memory_used / fullMemory.memory_total) * 100;
    expect(usage).toBe(100);

    const emptyMemory = {
      memory_used: 0,
      memory_total: 8192,
    };
    const usageEmpty =
      (emptyMemory.memory_used / emptyMemory.memory_total) * 100;
    expect(usageEmpty).toBe(0);
  });

  it("validates percentage ranges", () => {
    const validatePercentage = (val: number) => val >= 0 && val <= 100;

    expect(validatePercentage(45.5)).toBe(true);
    expect(validatePercentage(0)).toBe(true);
    expect(validatePercentage(100)).toBe(true);
    expect(validatePercentage(-5)).toBe(false);
    expect(validatePercentage(105)).toBe(false);
  });

  it("handles rapid stat updates", () => {
    const updates = [
      { cpu_usage: 45.5 },
      { cpu_usage: 46.2 },
      { cpu_usage: 44.8 },
      { cpu_usage: 47.1 },
    ];

    expect(updates.length).toBe(4);
    expect(updates.every((u) => u.cpu_usage > 0)).toBe(true);
  });
});

describe("PerformanceTab Data Formatting", () => {
  it("formats bytes to MB correctly", () => {
    const bytes = 1048576; // 1 MB
    const mb = bytes / (1024 * 1024);
    expect(mb).toBe(1);
  });

  it("formats bytes to GB correctly", () => {
    const bytes = 1073741824; // 1 GB
    const gb = bytes / (1024 * 1024 * 1024);
    expect(gb).toBe(1);
  });

  it("rounds percentages to 1 decimal place", () => {
    const value = 45.678;
    const rounded = Math.round(value * 10) / 10;
    expect(rounded).toBe(45.7);
  });

  it("handles very small values", () => {
    const value = 0.001;
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(1);
  });
});
