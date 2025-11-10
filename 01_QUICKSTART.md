# 🚀 Quick Start Guide# 🚀 Quick Start Guide# Quick Start Guide - Task Manager Pro

Get **Task Manager Pro** up and running in under 5 minutes!Get Task Manager Pro up and running in under 5 minutes!## 🚀 Get Started in 3 Steps!

---## ⚡ Prerequisites### Step 1: Install Backend Dependencies

## ⚡ PrerequisitesBefore you begin, ensure you have the following installed:```bash

Before you begin, ensure you have the following installed:cd backend

- **Python 3.8 or higher** → [Download Python](https://www.python.org/downloads/)- **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)pip install -r requirements.txt

- **Node.js 18 or higher** → [Download Node.js](https://nodejs.org/)

- **npm** (comes with Node.js)- **Node.js 18 or higher** - [Download Node.js](https://nodejs.org/)```

### 💡 Verify Installations- **npm** (comes with Node.js) or **yarn**

````bash### Step 2: Install Frontend Dependencies

python --version  # Should be 3.8+

node --version    # Should be 18+> **💡 Tip:** Check your versions with:

npm --version     # Any recent version

```> `bash`bash



---> python --versioncd frontend



## 📦 Installation> node --versionnpm install



### Option 1: Automated Setup (Recommended)> npm --version```



**Windows:**> ```

```bash>

# Navigate to project directory> ```

cd task-manager-pro

### Step 3: Run the Application

# Run setup script

setup.bat---

````

**Option A: Web Browser (Recommended for Development)**

**Mac/Linux:**

````````bash## 📦 Installation

# Navigate to project directory

cd task-manager-proTerminal 1 (Backend):



# Make script executable### Option 1: Using Setup Script (Windows)

chmod +x setup.sh

```````bash

# Run setup script

./setup.sh```bashcd backend

````````

# 1. Navigate to project directorypython main.py

### Option 2: Manual Setup

cd task-manager-pro```

**Step 1: Install Backend Dependencies**

```````bash

cd backend

pip install -r requirements.txt# 2. Run the setup scriptTerminal 2 (Frontend):

cd ..

```setup.bat



**Step 2: Install Frontend Dependencies**``````bash

```bash

cd frontendcd frontend

npm install

cd ..This will automatically install all dependencies for both backend and frontend.npm run dev

```````

```````````

---

### Option 2: Manual Installation

## 🎯 Running the Application

Then open http://localhost:5173 in your browser.

### Option 1: Automated Start (Recommended)

#### Step 1: Install Backend Dependencies

**Windows:**

```bash**Option B: Electron Desktop App**

start.bat

``````````bash



**Mac/Linux:**cd task-manager-pro/backendTerminal 1 (Backend):

```bash

chmod +x start.shpip install -r requirements.txt

./start.sh

`````````bash



This will automatically start both backend and frontend!cd backend



### Option 2: Manual Start#### Step 2: Install Frontend Dependenciespython main.py



**Terminal 1 - Start Backend:**```````

```bash

cd backend```````bash

python main.py

```cd ../frontendTerminal 2 (Electron):



You should see:npm install

```

🚀 Starting Task Manager Pro Backend...``````bash

📡 API will be available at: http://localhost:8000

📚 API docs at: http://localhost:8000/docscd frontend

INFO:     Uvicorn running on http://0.0.0.0:8000

```---npm run electron-dev



**Terminal 2 - Start Frontend (Web Browser):**```````

```bash

cd frontend## 🎯 Running the Application

npm run dev

```## 🎯 Features You Can Try



You should see:### Method 1: Using Start Script (Windows)

```

VITE v6.0.3  ready in XXX ms1. **Dashboard** - View system overview



➜  Local:   http://localhost:5173/````bash2. **Performance** - See real-time graphs

➜  Network: use --host to expose

```# In project root directory3. **Processes** - Manage running processes



**Terminal 3 - Start Electron Desktop App (Optional):**start.bat   - Click on any process to see details

```bash

cd frontend```   - Use action buttons to suspend/kill processes

npm run electron-dev

```   - Search for specific processes



---This will open two terminal windows:



## 🌐 Access the Application- **Terminal 1:** Backend server (FastAPI)## 🐛 Common Issues



Once running, you can access:- **Terminal 2:** Frontend application (Electron)



| Interface | URL | Description |**"Module not found" error?**

|-----------|-----|-------------|

| **Web App** | http://localhost:5173 | React app in browser |### Method 2: Manual Start

| **Desktop App** | Auto-opens | Electron desktop application |

| **Backend API** | http://localhost:8000 | REST API server |- Run `pip install -r requirements.txt` in backend folder

| **API Docs** | http://localhost:8000/docs | Interactive API documentation |

**Terminal 1 - Start Backend:**- Run `npm install` in frontend folder

---

```bash

## 🎮 First Steps Tutorial

cd backend**Can't kill process?**

### 1️⃣ Explore the Dashboard (30 seconds)

python main.py

- Open the application

- See real-time **CPU** and **Memory** usage```- Run as administrator/sudo

- Check **system information** panel

- Watch the graphs update automatically



### 2️⃣ View Performance Metrics (1 minute)**Terminal 2 - Start Frontend (Web):****Port already in use?**



- Click **"Performance"** in the sidebar```bash

- View detailed **CPU per-core usage**

- Monitor **memory trends**cd frontend- Backend uses port 8000

- Check **disk I/O** statistics

npm run dev- Frontend uses port 5173

### 3️⃣ Manage Processes (2 minutes)

```- Make sure these ports are free

- Click **"Processes"** in the sidebar

- **Search** for a specific process (e.g., "chrome")

- Click on a process to **view details**

- Try **suspending** a non-critical process**Terminal 3 - Start Frontend (Electron Desktop App):**## 📚 Project Structure

- **Resume** the suspended process

- **End** a safe process (e.g., notepad)```bash



---cd frontend```



## 🛑 Stopping the Applicationnpm run electron-devtask-manager-pro/



### Using Automated Script```├── backend/

- Simply close the terminal windows or press `Ctrl+C`

│   ├── main.py              # FastAPI backend

### Manual Stop

- Press `Ctrl + C` in each terminal window---│   └── requirements.txt     # Python dependencies

- Or close the terminal windows directly

└── frontend/

---

## 🌐 Access the Application    ├── src/

## ⚠️ Common Issues & Quick Fixes

    │   ├── App.jsx         # Main React component

### Issue 1: "Port 8000 already in use"

Once running, you can access:    │   ├── components/     # UI components

**Problem:** Another application is using port 8000

    │   └── index.css       # Tailwind CSS

**Solution:**

- **Web Interface:** http://localhost:5173    ├── package.json        # Node dependencies

**Windows:**

```powershell- **Backend API:** http://localhost:8000    └── electron.js         # Electron configuration

netstat -ano | findstr :8000

taskkill /PID <PID> /F- **API Documentation:** http://localhost:8000/docs```

```

- **Electron App:** Opens automatically

**Mac/Linux:**

```bash## 💡 Tips

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

```

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
```````````
