# 🤝 Contributing Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Project Structure](#project-structure)
4. [Coding Standards](#coding-standards)
5. [Making Changes](#making-changes)
6. [Testing](#testing)
7. [Submitting Changes](#submitting-changes)

---

## 🚀 Getting Started

Thank you for considering contributing to Task Manager Pro! This guide will help you get started.

### Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- Git
- Code editor (VS Code recommended)

---

## 🛠️ Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/task-manager-pro.git
cd task-manager-pro
```

### 2. Install Dependencies

```bash
# Backend dependencies
cd backend
pip install -r requirements.txt

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Run Development Environment

**Terminal 1 - Backend:**

```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

---

## 📁 Project Structure

```
task-manager-pro/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── components/     # React components
│   │   └── styles/         # CSS files
│   ├── package.json        # Node dependencies
│   └── electron.js         # Electron configuration
│
└── docs/                   # Documentation files
```

---

## 📝 Coding Standards

### Python (Backend)

**Style Guide:** PEP 8

```python
# Good
def get_system_stats():
    """Get overall system statistics"""
    cpu_percent = psutil.cpu_percent(interval=0.1)
    return {"cpu": cpu_percent}

# Bad
def GetSystemStats():
    cpu=psutil.cpu_percent(interval=0.1)
    return {'cpu':cpu}
```

**Key Points:**

- Use snake_case for functions and variables
- Add docstrings to all functions
- Keep functions focused and small
- Handle exceptions appropriately

### JavaScript/React (Frontend)

**Style Guide:** Airbnb JavaScript Style Guide

```javascript
// Good
const SystemStats = ({ stats }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  return <div>{stats.cpu}</div>;
};

// Bad
const SystemStats = ({ stats }) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);
  return <div>{stats.cpu}</div>;
};
```

**Key Points:**

- Use camelCase for variables and functions
- Use PascalCase for React components
- Add PropTypes or TypeScript types
- Use functional components with hooks
- Keep components small and focused

---

## 🔄 Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch Naming:**

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 2. Make Your Changes

**Before you start:**

- Check existing issues to avoid duplication
- Discuss major changes in an issue first
- Follow coding standards
- Write clear commit messages

### 3. Test Your Changes

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests (if implemented)
cd frontend
npm test

# Manual testing
# Run the application and verify your changes work
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add CPU temperature monitoring"
```

**Commit Message Format:**

```
<type>: <subject>

<body>

<footer>
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

**Examples:**

```bash
feat: add GPU monitoring support
fix: resolve process termination error on Windows
docs: update installation instructions
refactor: simplify data fetching logic
```

---

## 🧪 Testing

### Backend Testing

```python
# test_main.py
import pytest
from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_system_stats():
    response = client.get("/api/system/stats")
    assert response.status_code == 200
    assert "cpu" in response.json()
```

### Frontend Testing

```javascript
// App.test.jsx
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders dashboard", () => {
  render(<App />);
  const element = screen.getByText(/Task Manager Pro/i);
  expect(element).toBeInTheDocument();
});
```

---

## 📤 Submitting Changes

### 1. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 2. Create Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template

**PR Title Format:**

```
[Type] Brief description
```

**Examples:**

```
[Feature] Add GPU monitoring
[Fix] Resolve process list refresh issue
[Docs] Update architecture documentation
```

### 3. PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing

How has this been tested?

## Screenshots (if applicable)

Add screenshots here

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added to complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

---

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
## Bug Description

Clear description of the bug

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Environment

- OS: Windows 10
- Python: 3.10
- Node: 18.0
- Browser: Chrome 120

## Screenshots

If applicable

## Additional Context

Any other relevant information
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description

Clear description of the feature

## Problem It Solves

What problem does this solve?

## Proposed Solution

How should this work?

## Alternatives Considered

Other solutions you've considered

## Additional Context

Any other relevant information
```

---

## 📋 Code Review Process

### What We Look For

1. **Functionality:** Does it work as intended?
2. **Code Quality:** Is it clean and maintainable?
3. **Performance:** Does it perform well?
4. **Security:** Are there any security concerns?
5. **Documentation:** Is it well-documented?
6. **Tests:** Are there adequate tests?

### Review Timeline

- Initial review: Within 48 hours
- Follow-up reviews: Within 24 hours
- Merging: After approval from maintainers

---

## 🎯 Good First Issues

Looking for where to start? Check issues labeled:

- `good first issue`
- `beginner-friendly`
- `documentation`
- `help wanted`

---

## 📚 Additional Resources

- [Python PEP 8 Style Guide](https://pep8.org/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [React Documentation](https://react.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🙏 Thank You!

Your contributions make Task Manager Pro better for everyone!

**Happy coding! 🚀**
