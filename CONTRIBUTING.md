# Contributing to Task Manager Pro

Thank you for your interest in contributing to Task Manager Pro! This document provides guidelines and instructions for contributing to our hybrid Rust + Python + TypeScript system monitoring dashboard.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Community Guidelines](#community-guidelines)

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Rust 1.70+** - [Install](https://rustup.rs)
- **Python 3.8+** - [Download](https://python.org/downloads)
- **Node.js 18+** - [Download](https://nodejs.org)
- **Git** - [Download](https://git-scm.com)
- **Windows** with Administrator access (for full testing)

### Understanding the Architecture

Our project uses a hybrid architecture:

- **Rust Backend (Port 8000)**: Fast system stats, GPU monitoring, process control
- **Python Backend (Port 8001)**: Accurate CPU percentages using psutil
- **TypeScript Frontend**: React UI that intelligently routes to both backends

**Read [ARCHITECTURE.md](./ARCHITECTURE.md) before making changes!**

## 💻 Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/your-username/OS-CA-Real-Time-Process-Monitoring-Dashboard.git
cd OS-CA-Real-Time-Process-Monitoring-Dashboard

# Add upstream remote
git remote add upstream https://github.com/AkshatTm/OS-CA-Real-Time-Process-Monitoring-Dashboard.git
```

### 2. Install Dependencies

```bash
# Python backend dependencies
cd "older versions/v1-python-only/backend-v1-fastapi"
pip install -r requirements_basic.txt

# Rust backend dependencies
cd ../../backend
cargo build

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Start Development Environment

```bash
# Option 1: Use the startup script
START_ALL.bat

# Option 2: Manual startup (3 separate terminals)
# Terminal 1: Python backend
cd "older versions/v1-python-only/backend-v1-fastapi"
python main.py

# Terminal 2: Rust backend (as admin for process killing)
cd backend
cargo run --release

# Terminal 3: Frontend
cd frontend
npm run dev
```

### 4. Verify Setup

Open http://localhost:5173 and check:
- ✅ Performance tab loads (Rust backend working)
- ✅ Processes tab shows accurate CPU% (Python backend working)
- ✅ No console errors
- ✅ Can kill a test process (admin rights working)

## 🤝 How to Contribute

### Types of Contributions Welcome

1. **🐛 Bug Fixes**
   - Performance issues
   - UI/UX problems
   - Cross-platform compatibility
   - Memory leaks

2. **✨ New Features**
   - Additional system monitoring (temperatures, etc.)
   - New visualization charts
   - Export functionality
   - Historical data storage

3. **📚 Documentation**
   - API documentation improvements
   - Code comments
   - Usage examples
   - Troubleshooting guides

4. **🔧 Performance Improvements**
   - Rust optimization
   - React rendering optimizations
   - API response time improvements

5. **🧪 Testing**
   - Unit tests
   - Integration tests
   - Cross-platform testing

### Finding Issues to Work On

- Check [Issues](https://github.com/AkshatTm/OS-CA-Real-Time-Process-Monitoring-Dashboard/issues) labeled `good first issue`
- Look for `help wanted` labels
- Issues labeled `bug` are usually good for quick contributions

## 📝 Coding Standards

### Rust Backend

```rust
// Use consistent formatting
cargo fmt

// Follow Rust conventions
- Use snake_case for functions and variables
- Use PascalCase for structs and enums
- Add documentation for public functions
- Handle errors properly (Result<T, E>)

/// Get system statistics including CPU, memory, disk, and GPU
async fn get_stats() -> Result<Json<SystemStats>, AppError> {
    let mut sys = System::new_all();
    sys.refresh_all();
    // ... implementation
}
```

### Python Backend

```python
# Follow PEP 8 style guide
# Use black for formatting: black main.py

# Use type hints
from typing import List, Dict, Optional

async def get_processes() -> Dict[str, List[ProcessInfo]]:
    """Get all running processes with accurate CPU percentages."""
    processes = []
    # ... implementation
    return {"processes": processes}
```

### TypeScript Frontend

```typescript
// Use Prettier for formatting
// Follow React best practices

interface SystemStats {
  cpu_usage: number;
  memory_percent: number;
  // ... all fields typed
}

// Use proper component structure
const PerformanceTab: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  
  useEffect(() => {
    // Cleanup logic
    return () => {
      // cleanup
    };
  }, []);

  return (
    <div className="performance-tab">
      {/* JSX */}
    </div>
  );
};
```

### General Guidelines

- **Comments**: Explain WHY, not WHAT
- **Naming**: Use descriptive names, avoid abbreviations
- **Functions**: Keep functions small and focused
- **Error Handling**: Always handle errors gracefully
- **Performance**: Consider the impact of your changes

## 🧪 Testing Guidelines

### Before Submitting

1. **Test All Tabs**
   ```bash
   # Check each tab works:
   - Performance tab (Rust API)
   - Processes tab (Python API)
   - Apps tab (Python API)
   ```

2. **Test Process Management**
   ```bash
   # Start a test process (e.g., notepad.exe)
   # Try to kill it through the UI
   # Verify it actually terminates
   ```

3. **Check Different Scenarios**
   ```bash
   # Test with different process counts (few vs many)
   # Test with high CPU usage
   # Test with network activity
   ```

4. **Cross-Platform Testing** (if possible)
   - Test on Windows (primary platform)
   - Test on macOS (limited functionality expected)
   - Test on Linux (partial functionality expected)

### Running Tests

```bash
# Rust tests
cd backend
cargo test

# Python tests (if available)
cd "older versions/v1-python-only/backend-v1-fastapi"
pytest

# Frontend tests
cd frontend
npm test
```

### Performance Testing

```bash
# Benchmark API response times
# Rust should be <10ms for /api/stats
# Python should be <100ms for /api/processes

# Check memory usage
# Rust: ~15-20 MB
# Python: ~40-60 MB
# Frontend: <200 MB
```

## 📤 Submitting Changes

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Follow coding standards
- Add tests if applicable
- Update documentation
- Test thoroughly

### 3. Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add GPU temperature monitoring"
git commit -m "fix: resolve process killing permission issue"
git commit -m "docs: update API reference for new endpoints"
git commit -m "perf: optimize Rust stats collection by 15%"
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:

**Title**: Clear, descriptive title
**Description**:
```markdown
## Changes Made
- Added GPU temperature monitoring
- Updated frontend to display temperature in Performance tab
- Added error handling for GPUs without temperature sensors

## Testing
- ✅ Tested with NVIDIA RTX 3080
- ✅ Tested without GPU (graceful fallback)
- ✅ Verified temperature updates every 2 seconds

## Screenshots
[Include before/after screenshots if UI changes]

## Breaking Changes
None

## Related Issues
Closes #123
```

### 5. Code Review Process

1. **Automated Checks**: Wait for CI/CD to pass
2. **Maintainer Review**: Address feedback promptly
3. **Testing**: Ensure all tests pass
4. **Documentation**: Update docs if needed
5. **Merge**: Maintainer will merge when ready

## 📋 Pull Request Checklist

Before submitting, ensure:

- [ ] Code follows project coding standards
- [ ] All tests pass
- [ ] Documentation updated (if needed)
- [ ] No console errors in browser
- [ ] Performance impact assessed
- [ ] Breaking changes documented
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main

## 🔄 Keeping Your Fork Updated

```bash
# Sync with upstream regularly
git checkout main
git fetch upstream
git merge upstream/main
git push origin main

# Rebase your feature branch
git checkout feature/your-feature
git rebase main
```

## 🎯 Contribution Areas by Skill Level

### Beginner
- Documentation improvements
- UI text corrections
- Adding simple CSS styling
- Fixing typos in code comments

### Intermediate
- Bug fixes in React components
- Adding new UI components
- Python API endpoint improvements
- Cross-platform compatibility fixes

### Advanced
- Rust backend optimization
- Complex system monitoring features
- Performance profiling and improvements
- Architecture changes

## 💡 Feature Request Process

1. **Search existing issues** to avoid duplicates
2. **Open a new issue** with the `enhancement` label
3. **Describe the feature** with use cases and benefits
4. **Wait for maintainer feedback** before implementing
5. **Discuss implementation approach** in the issue
6. **Submit a PR** when ready

## 🐛 Bug Report Process

1. **Check existing issues** first
2. **Use the bug report template**
3. **Include steps to reproduce**
4. **Provide system information** (OS, versions, etc.)
5. **Include error messages and logs**
6. **Add screenshots** if applicable

## 🤔 Questions and Support

- **General Questions**: Open a GitHub Discussion
- **Bug Reports**: Use GitHub Issues
- **Feature Requests**: Use GitHub Issues with `enhancement` label
- **Documentation Issues**: Open an issue or PR directly

## 🙏 Recognition

Contributors will be:
- Listed in the project README
- Credited in release notes
- Given appropriate GitHub repository permissions (for regular contributors)

## 📜 License Agreement

By contributing, you agree that your contributions will be licensed under the same license as the project (Educational License).

---

Thank you for contributing to Task Manager Pro! Your efforts help make system monitoring better for everyone. 🚀
