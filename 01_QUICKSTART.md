---cd frontendcd frontend



### Method 3: Run as Electron Desktop Appnpm install



**Terminal 1 - Start Backend:**cd ..This will automatically install all dependencies for both backend and frontend.npm run dev



```bash```````

cd backend

python main.py```````````

````````````

---

**Terminal 2 - Start Electron:**

### Option 2: Manual Installation

```````````bash

cd frontend## 🎯 Running the Application

npm run electron-dev

```Then open http://localhost:5173 in your browser.



This will open Task Manager Pro in a native desktop window.### Option 1: Automated Start (Recommended)



---#### Step 1: Install Backend Dependencies



## 🎓 What You Can Do**Windows:**



Once running, you can:```bash**Option B: Electron Desktop App**



### 📊 Monitor System Performancestart.bat



- View real-time CPU usage (overall and per-core)``````````bash

- Track memory and swap usage

- Monitor disk I/O and storage

- Check network activity

- View GPU statistics (if GPUtil installed)**Mac/Linux:**cd task-manager-pro/backendTerminal 1 (Backend):



### 🔧 Manage Processes```bash



- Browse all running processeschmod +x start.shpip install -r requirements.txt

- Search and filter by name or PID

- Sort by CPU, memory, status./start.sh

- End processes (with force kill option)

- Suspend and resume processes`````````bash

- View detailed process information



### 📈 Visualize Data

This will automatically start both backend and frontend!cd backend

- Real-time performance graphs

- Historical CPU and memory charts

- Per-core CPU visualization

- Network transfer statistics### Option 2: Manual Start#### Step 2: Install Frontend Dependenciespython main.py



---



## 🛠️ Common Commands**Terminal 1 - Start Backend:**```````



### Backend Commands```bash



```bashcd backend```````bash
# 🚀 Quick Start Guide — Task Manager Pro

Get Task Manager Pro running in under 5 minutes.

---

## ⚡ Prerequisites

- Python 3.8+ (check: `python --version`)
- Node.js 18+ and npm (check: `node --version`, `npm --version`)

---

## 📦 Installation

### Option A: Automated (Recommended on Windows)

```powershell
# From project root
setup.bat
```

This installs backend (pip) and frontend (npm) dependencies.

### Option B: Manual

```powershell
# Backend
cd backend
pip install -r requirements.txt

# Frontend (new terminal)
cd frontend
npm install
```

---

## 🎯 Running the Application

### Method 1: Start both (Windows)

```powershell
# From project root
start.bat
```

This launches:
- Backend FastAPI: http://localhost:8000 (docs at /docs)
- Frontend Vite dev server: http://localhost:5173

### Method 2: Run manually

```powershell
# Terminal 1 — Backend
cd backend
python main.py

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### Method 3: Electron desktop app (optional)

```powershell
# After frontend is running, or use electron-dev to run both
cd frontend
npm run electron-dev
```

---

## 🔍 Verify Setup

1) Visit http://localhost:5173 — you should see the dashboard.
2) Visit http://localhost:8000 — API banner appears.
3) Visit http://localhost:8000/docs — interactive API docs load.

---

## 🧪 Testing

```powershell
# Backend tests
cd backend
pytest -q

# Frontend tests
cd ../frontend
npm test
```

---

## 🔐 Permissions (Windows)

- Ending, suspending, resuming, or changing priority of some processes may require Administrator.
- If you see “Access denied” errors:
   - Close terminals, reopen PowerShell as Administrator, and rerun `start.bat`.

---

## 🆘 Troubleshooting

- Port in use: Stop other apps on 8000/5173 or change ports.
- Backend not reachable: Ensure `python main.py` is running without errors.
- Frontend blank: Wait for Vite to compile; check terminal logs.
- GPU stats missing: Install `gputil` and ensure a supported GPU is present.

---

## 🧭 What to Try First

- Dashboard: CPU/Mem/Disk/Network overview with alerts.
- Performance: Real-time charts and per-core usage.
- Processes: Search, sort, end/suspend/resume, and view details.
- Process Tree: Parent/child relations and quick stats.
- Apps: Grouped resource usage by application name.
**Solution:**- Open the application



```bash- See real-time **CPU** and **Memory** usage```- Run as administrator/sudo

cd backend

pip install -r requirements.txt --upgrade- Check **system information** panel

````

- Watch the graphs update automatically

### Frontend Won't Start

**Problem:** `npm ERR! code EACCES` or permission errors

### 2️⃣ View Performance Metrics (1 minute)**Terminal 2 - Start Frontend (Web):\*\***Port already in use?\*\*

**Solution:**

````bash

# Clear cache and reinstall- Click **"Performance"** in the sidebar```bash

cd frontend

rm -rf node_modules package-lock.json- View detailed **CPU per-core usage**

npm cache clean --force

npm install- Monitor **memory trends**cd frontend- Backend uses port 8000

````

- Check **disk I/O** statistics

---

npm run dev- Frontend uses port 5173

## 📚 Next Steps

### 3️⃣ Manage Processes (2 minutes)

- Read the [Architecture Documentation](./03_ARCHITECTURE.md) for technical details

- Check out [How It Works](./04_HOW_IT_WORKS.md) for deep dive explanations```- Make sure these ports are free

- See [Troubleshooting Guide](./07_TROUBLESHOOTING.md) for more solutions

- Review [Contributing Guide](./08_CONTRIBUTING.md) to contribute- Click **"Processes"** in the sidebar

---- **Search** for a specific process (e.g., "chrome")

## 🎯 Quick Reference- Click on a process to **view details**

| Action | Command |- Try **suspending** a non-critical process**Terminal 3 - Start Frontend (Electron Desktop App):**## 📚 Project Structure

| ----------------------- | ------------------------ |

| Install all | `setup.bat` (Windows) |- **Resume** the suspended process

| Start all | `start.bat` (Windows) |

| Start backend | `cd backend && python main.py` |- **End** a safe process (e.g., notepad)```bash

| Start frontend (web) | `cd frontend && npm run dev` |

| Start frontend (Electron) | `cd frontend && npm run electron-dev` |

| View API docs | http://localhost:8000/docs |

| Access application | http://localhost:5173 |---cd frontend```

| Run backend tests | `cd backend && pytest` |

| Run frontend tests | `cd frontend && npm test` |

---## 🛑 Stopping the Applicationnpm run electron-devtask-manager-pro/

**🎉 Congratulations! Task Manager Pro is now running. Enjoy monitoring your system!**

### Using Automated Script```├── backend/

- Simply close the terminal windows or press `Ctrl+C`

│ ├── main.py # FastAPI backend

### Manual Stop

- Press `Ctrl + C` in each terminal window---│ └── requirements.txt # Python dependencies

- Or close the terminal windows directly

└── frontend/

---

## 🌐 Access the Application ├── src/

## ⚠️ Common Issues & Quick Fixes

    │   ├── App.jsx         # Main React component

### Issue 1: "Port 8000 already in use"

Once running, you can access: │ ├── components/ # UI components

**Problem:** Another application is using port 8000

    │   └── index.css       # Tailwind CSS

**Solution:**

- **Web Interface:** http://localhost:5173 ├── package.json # Node dependencies

**Windows:**

````powershell- **Backend API:** http://localhost:8000    └── electron.js         # Electron configuration

netstat -ano | findstr :8000

taskkill /PID <PID> /F- **API Documentation:** http://localhost:8000/docs```

````

- **Electron App:** Opens automatically

**Mac/Linux:**

`````bash## 💡 Tips

lsof -ti:8000 | xargs kill -9

```---



---- Use **Ctrl+F** to search processes



### Issue 2: "Permission Denied" when managing processes## 🎮 First Steps- Click column headers to sort



**Problem:** Insufficient permissions to manage system processes- Right side action buttons for quick actions



**Solution:**1. **Explore the Dashboard** 📊- Graphs update every 2 seconds automatically



**Windows:**   - View real-time CPU and memory usage

```powershell

# Right-click Command Prompt/PowerShell   - Check system informationEnjoy! 🎉

# Select "Run as Administrator"

cd backend   - Monitor network activity

python main.py

```2. **Navigate to Performance Tab** 📈

   - See detailed performance graphs

**Mac/Linux:**   - Monitor per-core CPU usage

```bash   - Track historical data

sudo python3 main.py

```3. **Manage Processes** 🔧

   - Click on "Processes" in the sidebar

---   - Search for specific processes

   - View details, suspend, or end processes

### Issue 3: "Module Not Found" Error

---

**Problem:** Python dependencies not installed

## 🛑 Stopping the Application

**Solution:**

```bash- Press `Ctrl + C` in each terminal window

cd backend- Or close the terminal windows

pip install -r requirements.txt --upgrade

```---



---## ⚠️ Common Issues & Quick Fixes



### Issue 4: Frontend Shows Blank Page### Port Already in Use



**Problem:** Backend not running or connection failed**Problem:** "Address already in use: Port 8000"



**Solution:****Solution:**

1. Ensure backend is running (Terminal 1)```bash

2. Check backend shows: `Uvicorn running on http://0.0.0.0:8000`# Windows

3. Test API: Open http://localhost:8000 in browsernetstat -ano | findstr :8000

4. Clear browser cache: `Ctrl+Shift+Delete`taskkill /PID <PID> /F



---# Mac/Linux

lsof -ti:8000 | xargs kill -9

### Issue 5: npm Install Fails````



**Problem:** Node modules installation error### Permission Denied (Process Management)



**Solution:****Problem:** Cannot kill or suspend processes

```bash

cd frontend**Solution:** Run the backend with administrator/root privileges

rm -rf node_modules package-lock.json

npm cache clean --force```bash

npm install# Windows (Run terminal as Administrator)

```python main.py



---# Mac/Linux

sudo python main.py

## 💡 Pro Tips```



### Tip 1: Administrator Privileges### Module Not Found

**Always run the backend as Administrator/sudo** for full process management capabilities.

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`

### Tip 2: Keep Both Terminals Open

The application requires **both backend and frontend** to run simultaneously.**Solution:**



### Tip 3: Use Electron for Best Performance```bash

The **Electron desktop app** performs better than the web browser version.pip install -r requirements.txt --upgrade

`````

### Tip 4: Check Backend Logs

If something doesn't work, **check the backend terminal** for error messages.### Frontend Build Errors

### Tip 5: Auto-Refresh**Problem:** npm install fails

Data refreshes automatically every **2 seconds**. No need to manually refresh!

**Solution:**

---

```bash

## 🚀 Next Stepsrm -rf node_modules package-lock.json

npm cache clean --force

Now that you're up and running:npm install

```

1. **📖 Read the [Problem Statement](./02_PROBLEM_STATEMENT.md)** - Understand the project requirements

2. **🏗️ Check [Architecture Documentation](./03_ARCHITECTURE.md)** - Learn how it's built---

3. **🎓 Study [How It Works](./04_HOW_IT_WORKS.md)** - Deep dive into the implementation

4. **🔧 Explore [API Documentation](http://localhost:8000/docs)** - Interactive API testing## 📚 Next Steps

---- Read the [Problem Statement](./02_PROBLEM_STATEMENT.md) to understand the project requirements

- Check out the [Architecture Documentation](./03_ARCHITECTURE.md) to learn how it works

## 🆘 Need More Help?- Explore the [API Documentation](http://localhost:8000/docs) for backend endpoints

- **Troubleshooting:** See [Troubleshooting Guide](./07_TROUBLESHOOTING.md)---

- **Full Documentation:** Check [README.md](./README.md)

- **Contributing:** Read [Contributing Guide](./08_CONTRIBUTING.md)## 💡 Pro Tips

---1. **Keep both terminals open** - The application needs both backend and frontend running

2. **Run as Administrator** - For full process management capabilities

## ✅ Verification Checklist3. **Use Electron app** - Better performance than web browser

4. **Check logs** - If something doesn't work, check terminal output

Before reporting issues, verify:

---

- [ ] Python 3.8+ installed (`python --version`)

- [ ] Node.js 18+ installed (`node --version`)## 🆘 Need Help?

- [ ] Backend dependencies installed (`pip list`)

- [ ] Frontend dependencies installed (`npm list`)- Check the [Troubleshooting Guide](./07_TROUBLESHOOTING.md)

- [ ] Backend running on port 8000- Review the [Full Documentation](./README.md)

- [ ] Frontend running on port 5173- Open an issue on GitHub

- [ ] No firewall blocking connections

- [ ] Running with appropriate permissions---

---**You're all set! Enjoy using Task Manager Pro! 🎉**

**🎉 Congratulations! You're ready to use Task Manager Pro!**

**Enjoy real-time system monitoring with a beautiful interface! 🚀**

```

```
```````````
