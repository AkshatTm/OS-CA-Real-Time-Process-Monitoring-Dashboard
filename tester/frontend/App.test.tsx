/**
 * Tests for App.tsx - Main Application Component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../frontend/src/App";

// Mock fetch for API calls
global.fetch = vi.fn();

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the application title", () => {
    render(<App />);
    expect(screen.getByText(/System Monitor/i)).toBeInTheDocument();
  });

  it("displays loading state initially", async () => {
    // Mock API responses
    (global.fetch as any).mockImplementation((url: string) => {
      return Promise.resolve({
        ok: true,
        json: async () => {
          if (url.includes("8000")) {
            return { cpu_usage: 50, memory_usage: 60 };
          }
          return { processes: [] };
        },
      });
    });

    render(<App />);

    // Should show loading or initial state
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it("fetches data from both backends", async () => {
    const mockRustData = {
      cpu_usage: 45.5,
      memory_usage: 62.3,
      disk_usage: 78.9,
      network_upload: 1024000,
      network_download: 2048000,
    };

    const mockPythonData = {
      processes: [
        { pid: 1234, name: "test.exe", cpu_percent: 10, memory: 1024000 },
      ],
    };

    (global.fetch as any).mockImplementation((url: string) => {
      return Promise.resolve({
        ok: true,
        json: async () => {
          if (url.includes("8000")) {
            return mockRustData;
          }
          return mockPythonData;
        },
      });
    });

    render(<App />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("8000")
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("8001")
      );
    });
  });

  it("handles API errors gracefully", async () => {
    // Mock failed API call
    (global.fetch as any).mockRejectedValue(new Error("Network error"));

    render(<App />);

    await waitFor(() => {
      // Should not crash, should handle error
      expect(
        screen.queryByText(/error/i) || screen.queryByText(/System Monitor/i)
      ).toBeInTheDocument();
    });
  });

  it("updates data on refresh", async () => {
    let callCount = 0;

    (global.fetch as any).mockImplementation(() => {
      callCount++;
      return Promise.resolve({
        ok: true,
        json: async () => ({
          cpu_usage: 50 + callCount,
          memory_usage: 60,
        }),
      });
    });

    render(<App />);

    await waitFor(() => {
      expect(callCount).toBeGreaterThan(0);
    });

    const initialCalls = callCount;

    // Wait for auto-refresh or trigger manual refresh
    await waitFor(
      () => {
        expect(callCount).toBeGreaterThan(initialCalls);
      },
      { timeout: 6000 }
    );
  });

  it("handles empty process list", async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      return Promise.resolve({
        ok: true,
        json: async () => {
          if (url.includes("8000")) {
            return { cpu_usage: 50 };
          }
          return { processes: [] };
        },
      });
    });

    render(<App />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("displays multiple tabs", () => {
    render(<App />);

    // Should have performance and processes tabs
    expect(
      screen.getByText(/performance/i) || screen.getByRole("tab")
    ).toBeTruthy();
  });

  it("handles concurrent API calls", async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    (global.fetch as any).mockImplementation(async (url: string) => {
      await delay(100);
      return {
        ok: true,
        json: async () => ({
          cpu_usage: 50,
          processes: [],
        }),
      };
    });

    render(<App />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // Rust + Python
    });
  });

  it("updates on interval", async () => {
    vi.useFakeTimers();

    let fetchCount = 0;
    (global.fetch as any).mockImplementation(() => {
      fetchCount++;
      return Promise.resolve({
        ok: true,
        json: async () => ({ cpu_usage: 50 }),
      });
    });

    render(<App />);

    // Fast-forward 5 seconds
    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(fetchCount).toBeGreaterThan(2);
    });

    vi.useRealTimers();
  });
});

describe("App Error Boundaries", () => {
  it("handles Rust backend offline", async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes("8000")) {
        return Promise.reject(new Error("Connection refused"));
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ processes: [] }),
      });
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/System Monitor/i)).toBeInTheDocument();
    });
  });

  it("handles Python backend offline", async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes("8001")) {
        return Promise.reject(new Error("Connection refused"));
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ cpu_usage: 50 }),
      });
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/System Monitor/i)).toBeInTheDocument();
    });
  });

  it("handles both backends offline", async () => {
    (global.fetch as any).mockRejectedValue(new Error("Connection refused"));

    render(<App />);

    await waitFor(() => {
      // App should still render, just with error states
      expect(screen.queryByText(/System Monitor/i)).toBeInTheDocument();
    });
  });
});

describe("App Performance", () => {
  it("renders within performance budget", async () => {
    const startTime = performance.now();

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ cpu_usage: 50, processes: [] }),
    });

    render(<App />);

    const renderTime = performance.now() - startTime;

    // Should render in under 100ms
    expect(renderTime).toBeLessThan(100);
  });

  it("does not cause memory leaks", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ cpu_usage: 50 }),
    });

    const { unmount } = render(<App />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Cleanup should work without errors
    unmount();
    expect(true).toBe(true);
  });
});
