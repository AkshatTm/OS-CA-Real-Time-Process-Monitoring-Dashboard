// Configuration
const UPDATE_INTERVAL = 2000; // 2 seconds
const MAX_HISTORY_POINTS = 30; // Last 30 data points

// Data storage for charts
let cpuHistory = new Array(MAX_HISTORY_POINTS).fill(0);
let memoryHistory = new Array(MAX_HISTORY_POINTS).fill(0);
let diskHistory = new Array(MAX_HISTORY_POINTS).fill(0);

// Chart references
let cpuChart, memChart, diskChart;

// Sample processes data
const sampleProcesses = [
  { pid: 1234, name: "chrome.exe", cpu: 12.5, memory: 8.3, status: "running" },
  { pid: 5678, name: "code.exe", cpu: 8.2, memory: 5.7, status: "running" },
  { pid: 9012, name: "python.exe", cpu: 5.1, memory: 3.2, status: "running" },
  { pid: 3456, name: "explorer.exe", cpu: 2.8, memory: 4.5, status: "running" },
  { pid: 7890, name: "firefox.exe", cpu: 2.3, memory: 6.1, status: "running" },
  { pid: 2345, name: "node.exe", cpu: 1.9, memory: 2.8, status: "running" },
  { pid: 6789, name: "system", cpu: 0.5, memory: 0.2, status: "sleeping" },
  { pid: 1111, name: "svchost.exe", cpu: 0.3, memory: 1.5, status: "running" },
  { pid: 2222, name: "discord.exe", cpu: 0.2, memory: 3.4, status: "sleeping" },
  { pid: 3333, name: "spotify.exe", cpu: 0.1, memory: 2.1, status: "running" },
];

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  initializeCharts();
  updateTime();
  updateStats();

  // Set up auto refresh
  setInterval(updateStats, UPDATE_INTERVAL);
  setInterval(updateTime, 1000);
});

// Update current time
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  document.getElementById("currentTime").textContent = timeString;
}

// Generate random system stats (simulated)
function generateStats() {
  return {
    cpu: {
      percent: Math.random() * 80 + 10, // 10-90%
      cores: { physical: 4, logical: 8 },
    },
    memory: {
      percent: Math.random() * 60 + 20, // 20-80%
      used: (Math.random() * 8 + 4).toFixed(1), // 4-12 GB
      total: 16,
    },
    disk: {
      percent: Math.random() * 20 + 40, // 40-60%
      used: (Math.random() * 200 + 300).toFixed(1), // 300-500 GB
      total: 1000,
    },
    network: {
      sent: (Math.random() * 500 + 100).toFixed(1), // 100-600 MB
      received: (Math.random() * 2000 + 500).toFixed(1), // 500-2500 MB
    },
  };
}

// Update all stats
function updateStats() {
  const stats = generateStats();

  // Update CPU
  const cpuPercent = stats.cpu.percent.toFixed(1);
  document.getElementById("cpuValue").textContent = `${cpuPercent}%`;
  document.getElementById("cpuProgress").style.width = `${cpuPercent}%`;
  document.getElementById(
    "cpuDetail"
  ).textContent = `Cores: ${stats.cpu.cores.physical} Physical, ${stats.cpu.cores.logical} Logical`;

  // Update Memory
  const memPercent = stats.memory.percent.toFixed(1);
  document.getElementById("memValue").textContent = `${memPercent}%`;
  document.getElementById("memProgress").style.width = `${memPercent}%`;
  document.getElementById(
    "memDetail"
  ).textContent = `Used: ${stats.memory.used} GB / Total: ${stats.memory.total} GB`;

  // Update Disk
  const diskPercent = stats.disk.percent.toFixed(1);
  document.getElementById("diskValue").textContent = `${diskPercent}%`;
  document.getElementById("diskProgress").style.width = `${diskPercent}%`;
  document.getElementById(
    "diskDetail"
  ).textContent = `Used: ${stats.disk.used} GB / Total: ${stats.disk.total} GB`;

  // Update Network
  document.getElementById("netSent").textContent = `${stats.network.sent} MB`;
  document.getElementById(
    "netReceived"
  ).textContent = `${stats.network.received} MB`;

  // Update history
  cpuHistory.shift();
  cpuHistory.push(parseFloat(cpuPercent));

  memoryHistory.shift();
  memoryHistory.push(parseFloat(memPercent));

  diskHistory.shift();
  diskHistory.push(parseFloat(diskPercent));

  // Update charts
  updateCharts();

  // Update processes
  updateProcessTable();
}

// Initialize charts
function initializeCharts() {
  const chartConfig = {
    type: "line",
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: "#b0b0b0" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        x: {
          display: false,
        },
      },
      plugins: {
        legend: { display: false },
      },
      animation: {
        duration: 500,
      },
    },
  };

  // CPU Chart
  const cpuCtx = document.getElementById("cpuChart").getContext("2d");
  cpuChart = new Chart(cpuCtx, {
    ...chartConfig,
    data: {
      labels: Array(MAX_HISTORY_POINTS).fill(""),
      datasets: [
        {
          data: cpuHistory,
          borderColor: "#00d4aa",
          backgroundColor: "rgba(0, 212, 170, 0.2)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    },
  });

  // Memory Chart
  const memCtx = document.getElementById("memChart").getContext("2d");
  memChart = new Chart(memCtx, {
    ...chartConfig,
    data: {
      labels: Array(MAX_HISTORY_POINTS).fill(""),
      datasets: [
        {
          data: memoryHistory,
          borderColor: "#0078d4",
          backgroundColor: "rgba(0, 120, 212, 0.2)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    },
  });

  // Disk Chart
  const diskCtx = document.getElementById("diskChart").getContext("2d");
  diskChart = new Chart(diskCtx, {
    ...chartConfig,
    data: {
      labels: Array(MAX_HISTORY_POINTS).fill(""),
      datasets: [
        {
          data: diskHistory,
          borderColor: "#f7630c",
          backgroundColor: "rgba(247, 99, 12, 0.2)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    },
  });
}

// Update charts
function updateCharts() {
  if (cpuChart) {
    cpuChart.data.datasets[0].data = cpuHistory;
    cpuChart.update("none");
  }

  if (memChart) {
    memChart.data.datasets[0].data = memoryHistory;
    memChart.update("none");
  }

  if (diskChart) {
    diskChart.data.datasets[0].data = diskHistory;
    diskChart.update("none");
  }
}

// Update process table
function updateProcessTable() {
  const tbody = document.getElementById("processTableBody");
  tbody.innerHTML = "";

  // Randomize process CPU values for simulation
  const processes = sampleProcesses.map((proc) => ({
    ...proc,
    cpu: (Math.random() * 15).toFixed(1),
    memory: (Math.random() * 10).toFixed(1),
  }));

  // Sort by CPU and take top 10
  processes.sort((a, b) => parseFloat(b.cpu) - parseFloat(a.cpu));
  const topProcesses = processes.slice(0, 10);

  topProcesses.forEach((proc) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${proc.pid}</td>
            <td>${proc.name}</td>
            <td>${proc.cpu}%</td>
            <td>${proc.memory}%</td>
            <td><span class="status-badge status-${proc.status}">${proc.status}</span></td>
        `;
    tbody.appendChild(row);
  });
}

// Refresh data manually
function refreshData() {
  updateStats();

  // Visual feedback
  const btn = document.querySelector(".refresh-btn");
  btn.style.transform = "rotate(360deg)";
  setTimeout(() => {
    btn.style.transform = "rotate(0deg)";
  }, 500);
}
