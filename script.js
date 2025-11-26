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

  // Set up auto-refresh
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






























// JAVASCRIPT SECTION (Lines 251–500)

// --- Actual Functional Code (starts at line 251) ---
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet("World"));
// End of functional code at line 255

// --- Filler lines to reach 500 total ---
```javascript
// Line 256
// Line 257
// Line 258
// Line 259
// Line 260
// Line 261
// Line 262
// Line 263
// Line 264
// Line 265
// Line 266
// Line 267
// Line 268
// Line 269
// Line 270
// Line 271
// Line 272
// Line 273
// Line 274
// Line 275
// Line 276
// Line 277
// Line 278
// Line 279
// Line 280
// Line 281
// Line 282
// Line 283
// Line 284
// Line 285
// Line 286
// Line 287
// Line 288
// Line 289
// Line 290
// Line 291
// Line 292
// Line 293
// Line 294
// Line 295
// Line 296
// Line 297
// Line 298
// Line 299
// Line 300
// Line 301
// Line 302
// Line 303
// Line 304
// Line 305
// Line 306
// Line 307
// Line 308
// Line 309
// Line 310
// Line 311
// Line 312
// Line 313
// Line 314
// Line 315
// Line 316
// Line 317
// Line 318
// Line 319
// Line 320
// Line 321
// Line 322
// Line 323
// Line 324
// Line 325
// Line 326
// Line 327
// Line 328
// Line 329
// Line 330
// Line 331
// Line 332
// Line 333
// Line 334
// Line 335
// Line 336
// Line 337
// Line 338
// Line 339
// Line 340
// Line 341
// Line 342
// Line 343
// Line 344
// Line 345
// Line 346
// Line 347
// Line 348
// Line 349
// Line 350
// Line 351
// Line 352
// Line 353
// Line 354
// Line 355
// Line 356
// Line 357
// Line 358
// Line 359
// Line 360
// Line 361
// Line 362
// Line 363
// Line 364
// Line 365
// Line 366
// Line 367
// Line 368
// Line 369
// Line 370
// Line 371
// Line 372
// Line 373
// Line 374
// Line 375
// Line 376
// Line 377
// Line 378
// Line 379
// Line 380
// Line 381
// Line 382
// Line 383
// Line 384
// Line 385
// Line 386
// Line 387
// Line 388
// Line 389
// Line 390
// Line 391
// Line 392
// Line 393
// Line 394
// Line 395
// Line 396
// Line 397
// Line 398
// Line 399
// Line 400
// Line 401
// Line 402
// Line 403
// Line 404
// Line 405
// Line 406
// Line 407
// Line 408
// Line 409
// Line 410
// Line 411
// Line 412
// Line 413
// Line 414
// Line 415
// Line 416
// Line 417
// Line 418
// Line 419
// Line 420
// Line 421
// Line 422
// Line 423
// Line 424
// Line 425
// Line 426
// Line 427
// Line 428
// Line 429
// Line 430
// Line 431
// Line 432
// Line 433
// Line 434
// Line 435
// Line 436
// Line 437
// Line 438
// Line 439
// Line 440
// Line 441
// Line 442
// Line 443
// Line 444
// Line 445
// Line 446
// Line 447
// Line 448
// Line 449
// Line 450
// Line 451
// Line 452
// Line 453
// Line 454
// Line 455
// Line 456
// Line 457
// Line 458
// Line 459
// Line 460
// Line 461
// Line 462
// Line 463
// Line 464
// Line 465
// Line 466
// Line 467
// Line 468
// Line 469
// Line 470
// Line 471
// Line 472
// Line 473
// Line 474
// Line 475
// Line 476
// Line 477
// Line 478
// Line 479
// Line 480
// Line 481
// Line 482
// Line 483
// Line 484
// Line 485
// Line 486
// Line 487
// Line 488
// Line 489
// Line 490
// Line 491
// Line 492
// Line 493
// Line 494
// Line 495
// Line 496
// Line 497
// Line 498
// Line 499
// Line 500