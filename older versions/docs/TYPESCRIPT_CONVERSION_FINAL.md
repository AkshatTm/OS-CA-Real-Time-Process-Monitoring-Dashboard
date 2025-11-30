# TypeScript Conversion - Final Steps

## ✅ What's Been Completed

### Files Successfully Converted to TypeScript:

1. ✅ `frontend/src/types.ts` - All type definitions
2. ✅ `frontend/src/main.tsx`
3. ✅ `frontend/src/App.tsx`
4. ✅ `frontend/src/components/AlertBanner.tsx`
5. ✅ `frontend/src/components/Header.tsx`
6. ✅ `frontend/src/components/Sidebar.tsx`
7. ✅ `frontend/src/components/Dashboard.tsx`
8. ✅ `frontend/src/updates/formatters.ts`
9. ✅ `frontend/vite.config.ts`
10. ✅ `frontend/tsconfig.json`
11. ✅ `frontend/tsconfig.node.json`
12. ✅ `frontend/index.html` - Updated to reference main.tsx
13. ✅ `frontend/package.json` - Updated with TypeScript scripts

### Packages Installed:

- ✅ typescript
- ✅ @types/node
- ✅ @types/electron

## ⏳ Remaining Tasks

### 1. Convert PerformanceTab.jsx to PerformanceTab.tsx

**Manual Steps:**

1. Open `frontend/src/components/PerformanceTab.jsx`
2. Add these imports at the top:

```typescript
import type { SystemStats, ChartDataPoint } from "../types";
import { LucideIcon } from "lucide-react";
```

3. Add interface for props:

```typescript
interface PerformanceTabProps {
  systemStats: SystemStats | null;
}
```

4. Add interface for PerformanceCard props:

```typescript
interface PerformanceCardProps {
  title: string;
  icon: LucideIcon;
  data: ChartDataPoint[];
  value: string;
  subtitle: string;
  color: string;
}
```

5. Update function signature:

```typescript
export default function PerformanceTab({ systemStats }: PerformanceTabProps) {
```

6. Update state declarations:

```typescript
const [cpuHistory, setCpuHistory] = useState<ChartDataPoint[]>(
  Array(60)
    .fill(0)
    .map((_, i) => ({ time: i, value: 0 }))
);
// Repeat for memHistory, diskHistory, gpuHistory
```

7. Save as `PerformanceTab.tsx`

### 2. Convert ProcessList.jsx to ProcessList.tsx

**Manual Steps:**

1. Open `frontend/src/components/ProcessList.jsx`
2. Add these imports at the top:

```typescript
import type { Process } from "../types";
```

3. Add interface for props:

```typescript
interface ProcessListProps {
  processes: Process[];
  loading: boolean;
  onRefresh: () => void;
}
```

4. Update function signature:

```typescript
export default function ProcessList({ processes, loading, onRefresh }: ProcessListProps) {
```

5. Update state declarations:

```typescript
const [searchTerm, setSearchTerm] = useState<string>("");
const [sortBy, setSortBy] = useState<keyof Process>("cpu_percent");
const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
const [showModal, setShowModal] = useState<boolean>(false);
const [processDetails, setProcessDetails] = useState<Process | null>(null);
```

6. Add type to function parameters:

```typescript
const handleSort = (column: keyof Process): void => {
  // ...
};

const handleKillProcess = async (
  pid: number,
  processName: string,
  isProtected: boolean
): Promise<void> => {
  // ...
};

const handleSuspendProcess = async (
  pid: number,
  processName: string,
  isProtected: boolean
): Promise<void> => {
  // ...
};

const handleResumeProcess = async (pid: number): Promise<void> => {
  // ...
};

const showProcessDetails = async (pid: number): Promise<void> => {
  // ...
};

const getStatusColor = (status: string): string => {
  // ...
};
```

7. Save as `ProcessList.tsx`

### 3. Convert electron.js to electron.ts

**Manual Steps:**

1. Create `frontend/electron.ts`:

```typescript
import { app, BrowserWindow } from "electron";
import path from "path";

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    frame: true,
    backgroundColor: "#0a0a0f",
    title: "Task Manager Pro",
    icon: path.join(__dirname, "public/icon.png"),
  });

  // Load the app
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
```

### 4. Verify Everything Works

```bash
cd frontend

# Run type check
npm run type-check

# If no errors, test the app
npm run dev

# In another terminal, test with electron
npm run electron-dev
```

### 5. Clean Up Old Files

Once everything works, delete the old JavaScript files:

```bash
cd frontend

# Remove old component files
rm src/components/PerformanceTab.jsx
rm src/components/ProcessList.jsx

# Remove old config files
rm electron.js
rm vite.config.js

# Remove old utility file
rm src/updates/formatters.js

# Already replaced files (verify they exist as .tsx first)
rm src/main.jsx
rm src/App.jsx
rm src/components/AlertBanner.jsx
rm src/components/Header.jsx
rm src/components/Sidebar.jsx
rm src/components/Dashboard.jsx
```

## 6. Commit Everything

```bash
git add .
git commit -m "feat: complete TypeScript migration for frontend

- Convert all JSX/JS files to TSX/TS
- Add comprehensive type definitions in types.ts
- Update configuration files (vite, tsconfig, package.json)
- Add type safety to all components and utilities
- Update index.html to reference TypeScript entry point"

git push origin feature/updates
```

## Quick Reference: Common TypeScript Patterns

### Component Props

```typescript
interface Props {
  required: Type;
  optional?: Type;
  callback: () => void;
  callbackWithParam: (param: Type) => void;
}
```

### State

```typescript
const [value, setValue] = useState<Type>(initial);
const [array, setArray] = useState<Type[]>([]);
const [nullable, setNullable] = useState<Type | null>(null);
```

### Async Functions

```typescript
const asyncFunc = async (): Promise<void> => {
  const response = await axios.get<ResponseType>("/api/endpoint");
  setData(response.data);
};
```

### Event Handlers

```typescript
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  // ...
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  // ...
};
```

## Troubleshooting

### Type Errors

- Check that all imports reference `.tsx` files, not `.jsx`
- Ensure all type definitions match the API responses
- Verify optional properties use `?`

### Build Errors

- Run `npm run type-check` to see all TypeScript errors
- Fix errors one file at a time
- Check that all dependencies have type definitions

### Runtime Errors

- Check browser console for errors
- Verify API endpoints still work
- Test all user interactions

## Summary

You've successfully converted 70% of the codebase to TypeScript! The remaining files need manual conversion following the patterns above. Once complete, you'll have:

- ✅ Full type safety
- ✅ Better IDE support
- ✅ Reduced bugs
- ✅ Improved maintainability
- ✅ Better documentation through types

Good luck with the final conversions!
