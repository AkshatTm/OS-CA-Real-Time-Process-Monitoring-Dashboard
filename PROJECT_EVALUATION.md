# Project Evaluation Report: Task Manager Pro

Date: 2025-11-11

Repository: TRIAL-OS-CA-term-paper-Task-Manager-Pro

Problem Statement: Real-Time Process Monitoring Dashboard — "Create a graphical dashboard that displays real-time information about process states, CPU usage, and memory consumption. The tool should allow administrators to manage processes efficiently and identify potential issues promptly."

Final Score: 79 / 100

---

## 1) Executive Summary

The project successfully delivers a real-time system monitoring dashboard with process management capabilities. It meets the core requirements (process visibility, CPU and memory monitoring, and administrative actions like terminate/suspend/resume) and adds valuable extensions (disk, network, GPU, per-core usage, historical charts, modern UI, and Electron packaging). The codebase is readable and cross-platform-aware.

Areas for improvement include backend sampling efficiency, optional WebSocket streaming to replace polling, selective memoization in the frontend, a deeper set of process controls (force-kill toggle in UI, priority/nice), and baseline test coverage. For a second-year OS course project, this implementation is strong and demonstrates solid understanding and practical engineering.

---

## 2) Problem Fit & Scope Coverage

Requirements covered:
- Real-time process state visibility: Provided via /api/processes with name, PID, status, CPU %, memory, threads, and creation time.
- Real-time CPU usage: Overall, per-core frequency and usage, historical charts.
- Real-time memory consumption: Memory totals, used/available, percent, formatted sizes.
- Administrative actions: Kill, suspend, and resume exposed via API and integrated in UI (with protected-process guard).
- Identify potential issues: Visualizations and protected-process handling help avoid mistakes; could be extended with thresholds/alerts.

Value-add features:
- Disk usage + I/O, Network stats, System info, Uptime.
- GPU metrics (with graceful fallback when unavailable).
- Historical charts and per-core animated bars.
- Electron integration for desktop use.

Score: 18 / 20

---

## 3) Backend Architecture (FastAPI + psutil)

Files reviewed: `backend/main.py`

Strengths:
- Clear REST endpoints: system stats, processes list, process details, and actions (kill/suspend/resume).
- Uses psutil efficiently with `oneshot()` in details endpoint.
- GPU availability handled with try/except and graceful null return.
- Platform-specific attributes conditioned (avoids macOS/Linux/Windows differences causing crashes).
- Human-readable formatting helpers for memory/disk sizes.
- Protected processes guarded to prevent system instability.
- Adequate exception mapping to HTTP codes (404/403/500).

Weaknesses / Opportunities:
- Redundant `psutil.cpu_percent(interval=0.1)` calls in `/api/system/stats` (one overall and one per-core) — combine to a single sampling call to reduce latency.
- CPU normalization in `/api/processes` divides by CPU count; may mislead vs Task Manager expectations. Consider using raw psutil % or clarify label.
- No caching or throttling; many clients polling could incur overhead.
- Process actions lack additional confirmation token or auth (acceptable for local desktop scope).
- `proc.connections()` may face deprecation; consider future-proofing.
- No response models (Pydantic) defined; could help with API documentation and consistency.

Score: 15 / 20

---

## 4) Frontend UX & Architecture (React + Tailwind + Recharts + Framer Motion)

Files reviewed: `frontend/src/App.jsx`, `frontend/src/components/*`, `frontend/index.html`, styling and config files.

Strengths:
- Clean component structure: Sidebar, Header, Dashboard, PerformanceTab, ProcessList.
- Regular polling (2s) for stats and processes with clear state updates.
- Modern, responsive UI with helpful visual cues and smooth transitions.
- Historical charts for CPU/Memory/Disk/GPU; per-core visual bars.
- Process list supports search, sorting, protected badges, actions, and details modal.
- Toast notifications for user feedback on actions.
- Slices to 50 rows to avoid DOM overload in table renders.

Weaknesses / Opportunities:
- No memoization for filtered/sorted list; consider `useMemo`.
- No virtualization for very large process lists; consider react-window.
- Modal triggers: row click selects process but doesn’t auto-open details (intent clarity).
- Many animations may affect very low-end hardware (consider reduce-motion support).
- Constants (poll interval, history length) hardcoded inline instead of centralized.

Score: 17 / 20

---

## 5) Real-Time Handling & Performance

Mechanism: 2-second interval polling for both system stats and processes.

Pros:
- Simple and robust for local apps.
- Small fixed-size histories keep memory steady.

Cons / Optimizations:
- Duplicate CPU sampling in backend (see above) adds ~200ms per poll.
- No adaptive backoff on error; no window visibility check to reduce polling when unfocused.
- Could adopt WebSockets/SSE for push-based updates.
- Sorting and filtering recalculated each render without memoization.

Score: 13 / 15

---

## 6) Process Management Features

Delivered:
- List with CPU %, memory MB, status, threads, username, created at.
- Protected processes indicated and actions disabled.
- Kill, suspend, resume with clear messaging.
- Details modal shows exe path, cmdline, memory formatted, threads, ppid, etc.

Missing / Improvements:
- UI does not surface `force` kill option (API supports it).
- No nice/priority adjustments.
- No process tree view or user/status filters.
- No open files/ports display in UI (though counts are gathered cautiously).

Score: 12 / 15

---

## 7) Security, Safety & Robustness (for local desktop use)

Strengths:
- Protected process safeguard prevents critical termination.
- CORS limited to local dev origins.
- Exception handling reduces app crashes.
- Cross-platform attribute gating prevents runtime errors.

Risks / Notes:
- No authentication (acceptable locally; would matter if network exposed).
- Potential exposure of environment data (requested in `as_dict(attrs=...)` via `environ`) — currently not rendered but consider removing from fetch for safety.
- No rate limiting.

Score: 7 / 10

---

## 8) Maintainability & Code Quality

Strengths:
- Readable and consistent naming conventions.
- Logical componentization and utility functions.
- Tailwind tokens centralize theme.

Weaknesses:
- No ESLint/Prettier config; no typed frontend (TypeScript) or backend schemas.
- No tests (unit or integration) for either side.
- Magic numbers for intervals/history sizes.

Score: 7 / 10

---

## 9) Edge Cases & Failure Handling

Considered:
- GPU absence handled gracefully.
- AccessDenied/NoSuchProcess mapped to 403/404.
- Kill timeout returns partial success messaging.
- Protected processes block actions with clear UI.

Missing / To Consider:
- High churn of short-lived processes causing stale PIDs.
- Offline/Backend-down banner and retry strategy.
- Pagination for very large process lists beyond the first 50.
- Multi-GPU charting beyond first GPU in PerformanceTab.

Score: 6 / 10

---

## 10) Innovation & Value Add

- GPU metrics and details with graceful fallback.
- Disk, network, swap, uptime, system info.
- Electron packaging path for desktop usage.
- Animated per-core visualizations and modern styling.

Score: 8 / 10

---

## 11) Total Score

Breakdown:
- Problem Fit & Scope: 18/20
- Backend Architecture: 15/20
- Frontend UX & Architecture: 17/20
- Real-Time Efficiency: 13/15
- Process Management: 12/15
- Security & Robustness: 7/10
- Maintainability & Code Quality: 7/10
- Edge Cases & Failure Handling: 6/10
- Innovation & Value Add: 8/10

Raw Total: 103 / 130 → Scaled to 100 → 79 / 100

---

## 12) High-Impact Recommendations

Quick Wins:
1. Combine CPU sampling calls in `/api/system/stats` to a single `psutil.cpu_percent` invocation with `percpu=True`; derive overall from that.
2. Memoize filtered/sorted process list in `ProcessList` using `useMemo`.
3. Centralize constants: polling interval (e.g., 2000 ms), history lengths (20/60).
4. Remove `environ` from `as_dict` in `get_process_details` to avoid risk of sensitive exposure.
5. Add a UI flag for force kill (calls `/api/process/{pid}/kill?force=true`).
6. Clarify CPU% meaning (normalized vs raw) or show raw psutil CPU% to match user expectations.

Medium-Term:
7. Consider WebSocket/SSE push for stats to lower overhead and improve responsiveness.
8. Add virtualization/pagination to `ProcessList` for very large lists.
9. Threshold indicators (e.g., CPU>85% red, memory>80% warning) to "identify issues promptly".
10. Define FastAPI response models (Pydantic) for stable API docs.
11. Add basic tests: smoke test for `/api/system/stats` and a mockable process action.

Longer-Term:
12. Process tree visualization (parent-child relationships).
13. Anomaly detection (spike detection based on rolling averages).
14. If ever remote: add authentication and rate limiting.
15. Export snapshot/report of current stats and process list.

---

## 13) Conclusion

This project meets the academic brief well and goes beyond the baseline with a polished UI and additional system insights. With a few targeted improvements in efficiency, safety, and testing, it would reach an even higher standard suitable for production-like local tools. The current state earns a solid 79/100.
