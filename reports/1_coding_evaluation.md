# Coding Evaluation (100 Marks)

## Summary Score: 86/100

- UI/UX: 27/30
- Functionality & Correctness: 28/30
- Performance & Stability: 22/25
- Code Quality & Maintainability: 9/15

## Highlights
- Modern React + Vite frontend with Tailwind, clear tabbed navigation and animated transitions; responsive layout and dark theme suited for monitoring dashboards.
- Rust + Axum backend delivers fast stats/process endpoints; GPU via NVML when available; CORS configured; structured JSON contracts consistent with frontend `types.ts`.
- Hybrid design: Rust for high-throughput stats and actions; Python for accurate per-process CPU; Axios refresh loop with graceful handling and initial loading screen.

## Findings by Area

### UI/UX (27/30)
- Strengths: Clean dark UI, logical tabs (Dashboard/Performance/Apps/Processes), toast notifications styled, motion transitions improve perceived responsiveness.
- Good data presentation (per-core CPU, formatted bytes). Components appear cohesive (`Header`, `Sidebar`, lists).
- Improvements (−3):
  - Add empty/loading states to lists with skeletons to reduce layout shift.
  - Add search/sort/filter for processes and apps client-side.
  - Add visual alerts badges from `SystemStats.alerts` for quick triage.

### Functionality & Correctness (28/30)
- Strengths: Endpoints implemented: `/api/stats`, `/api/processes`, `/api/apps`, kill single/multiple; detailed process info; consistent types.
- Process CPU normalized by CPU count to align with Windows Task Manager behavior.
- Improvements (−2):
  - Suspend/Resume endpoints return placeholders; implement platform-specific functionality or hide in UI.

### Performance & Stability (22/25)
- Strengths: Rust native speed, double-refresh technique for processes to stabilize CPU metrics; axios timeout and `Connection: close` to avoid stuck sockets; 2s polling cadence reasonable.
- CORS permissive for local dev; Mutex-guarded `System` avoids race.
- Improvements (−3):
  - Debounce overlapping polls to prevent thundering herd if requests lag.
  - Consider WebSocket/SSE for stats to reduce HTTP overhead.
  - Cache disk/network aggregates for a short interval to reduce system queries.

### Code Quality & Maintainability (9/15)
- Strengths: Clear struct definitions, straightforward handlers, minimal dependencies.
- Improvements (−6):
  - Split `backend/src/main.rs` into modules (`routes`, `models`, `services/system`, `utils/format`); add unit tests for `format_bytes` and CPU normalization.
  - Replace magic numbers with constants (e.g., 200ms refresh delay, 2s polling interval).
  - Add logging (structured logs) instead of `println!`; use `tracing` with levels.
  - Handle errors more explicitly (map NVML failures, axum error responses).

## Specific Code Observations
- `format_bytes`: correct unit steps; add edge-case tests for TB and rounding.
- GPU stats: returns `None` cleanly when NVML or device missing; good optionality.
- Process metadata: `username`, `num_threads`, `connections`, `open_files` are placeholders; document limitations.
- `kill_app`: iterates PIDs; partial success returns success message; consider returning list of failed PIDs.
- Frontend polling: uses `Promise.allSettled` for initial load; good resilience.

## Suggested Improvements (Prioritized)
1. Implement `tracing` + `tower-http::trace` for backend; structured logs and request spans.
2. Refactor Rust backend into modules; add unit tests under `backend/tests`.
3. Add SSE endpoint `/api/stats/stream`; switch frontend stats refresh to event stream.
4. Implement process suspend/resume where supported or hide buttons.
5. Add client-side filtering/sorting/pagination on process/app lists; virtualize long lists (`react-virtual`).
6. Graceful kill responses: include failed PIDs and permissions hints.
7. Add health checks for both backends in UI with indicators (Rust/Python status).
8. Add retry/backoff policy in axios; prevent overlapping intervals when tab not visible (use `visibilitychange`).
9. Document environment requirements: NVML/GPU, Windows permissions (admin), Python port mapping.
