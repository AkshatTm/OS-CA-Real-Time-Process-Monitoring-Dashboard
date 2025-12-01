# Test Suite for Task Manager Pro

Comprehensive testing for the hybrid Rust + Python + TypeScript architecture.

## Test Structure

```
tester/
├── rust-backend/          # Rust backend tests
│   ├── unit_tests.rs      # Unit tests for Rust functions
│   └── integration_tests.rs  # API endpoint tests
├── python-backend/        # Python backend tests
│   ├── test_api.py        # API endpoint tests
│   └── test_processes.py  # Process monitoring tests
├── frontend/              # Frontend tests
│   ├── App.test.tsx       # Main app component tests
│   ├── components/        # Component tests
│   └── integration/       # Integration tests
├── e2e/                   # End-to-end tests
│   └── full_system.test.ts
└── performance/           # Performance benchmarks
    └── benchmark.py
```

## Running Tests

### Rust Backend Tests

```bash
cd backend
cargo test
```

### Python Backend Tests

```bash
cd tester/python-backend
pytest -v
```

### Frontend Tests

```bash
cd frontend
npm test
```

### End-to-End Tests

```bash
cd tester/e2e
npm test
```

### Performance Tests

```bash
cd tester/performance
python benchmark.py
```

## Test Coverage

### Rust Backend (Port 8000)

- ✅ System stats endpoint
- ✅ GPU monitoring
- ✅ Process info endpoint
- ✅ Process killing (admin)
- ✅ Error handling
- ✅ CORS configuration

### Python Backend (Port 8001)

- ✅ Process list endpoint
- ✅ Apps list endpoint
- ✅ CPU percentage accuracy
- ✅ Memory calculations
- ✅ Error handling

### Frontend

- ✅ Component rendering
- ✅ API integration
- ✅ State management
- ✅ Error boundaries
- ✅ User interactions

### Integration

- ✅ Dual backend communication
- ✅ Real-time updates
- ✅ Process management flow
- ✅ Error recovery

## Test Requirements

**Rust:**

- cargo (comes with Rust)

**Python:**

- pytest
- pytest-asyncio
- httpx

**Frontend:**

- @testing-library/react
- @testing-library/jest-dom
- vitest

Install test dependencies:

```bash
# Python
pip install pytest pytest-asyncio httpx

# Frontend (already in package.json)
cd frontend
npm install
```
