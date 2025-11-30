# TypeScript Migration Guide

## Status: In Progress ⚠️

### ✅ Completed

1. **TypeScript Configuration**

   - ✅ `tsconfig.json` created
   - ✅ `tsconfig.node.json` created
   - ✅ TypeScript and @types/node installed
   - ✅ @types/electron installed

2. **Type Definitions**

   - ✅ `src/types.ts` created with all interfaces

3. **Converted Files**

   - ✅ `src/main.tsx` (from main.jsx)
   - ✅ `src/App.tsx` (from App.jsx)
   - ✅ `src/components/AlertBanner.tsx`
   - ✅ `src/components/Header.tsx`
   - ✅ `src/components/Sidebar.tsx`
   - ✅ `src/components/Dashboard.tsx`
   - ✅ `src/updates/formatters.ts` (from formatters.js)
   - ✅ `vite.config.ts`

4. **Package.json Updates**
   - ✅ Added `type-check` script
   - ✅ Updated `build` script to include TypeScript compilation

### ⏳ Remaining Work

1. **Component Files to Convert**

   - ⏳ `src/components/PerformanceTab.tsx` (from PerformanceTab.jsx)
   - ⏳ `src/components/ProcessList.tsx` (from ProcessList.jsx)

2. **Configuration Files**

   - ⏳ `electron.ts` (from electron.js)
   - ⏳ `tailwind.config.ts` (from tailwind.config.js)
   - ⏳ `postcss.config.ts` (from postcss.config.js)

3. **Cleanup**
   - ⏳ Delete old `.js` and `.jsx` files after verification
   - ⏳ Update `index.html` to reference `main.tsx` instead of `main.jsx`

## Manual Steps Required

### Step 1: Update index.html

Edit `frontend/index.html`:

```html
<!-- Change this line -->
<script type="module" src="/src/main.jsx"></script>

<!-- To this -->
<script type="module" src="/src/main.tsx"></script>
```

### Step 2: Complete Remaining Conversions

The following components need manual conversion to TypeScript. Use the pattern from the completed files:

1. **PerformanceTab.tsx** - Add proper type annotations
2. **ProcessList.tsx** - Add proper type annotations
3. **electron.ts** - Convert to TypeScript

### Step 3: Test the Application

```bash
cd frontend
npm run type-check  # Check for TypeScript errors
npm run dev         # Test the application
```

### Step 4: Remove Old Files

After verifying everything works:

```bash
# In frontend directory
rm src/main.jsx
rm src/App.jsx
rm src/components/AlertBanner.jsx
rm src/components/Header.jsx
rm src/components/Sidebar.jsx
rm src/components/Dashboard.jsx
rm src/components/PerformanceTab.jsx
rm src/components/ProcessList.jsx
rm src/updates/formatters.js
rm vite.config.js
rm electron.js
```

## Key TypeScript Patterns Used

### 1. Component Props Interface

```typescript
interface ComponentProps {
  prop1: Type;
  prop2?: OptionalType;
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // ...
}
```

### 2. State with Types

```typescript
const [state, setState] = useState<Type>(initialValue);
const [array, setArray] = useState<Type[]>([]);
```

### 3. Event Handlers

```typescript
const handleClick = (event: React.MouseEvent): void => {
  // ...
};
```

### 4. Async Functions

```typescript
const fetchData = async (): Promise<void> => {
  // ...
};
```

## Benefits of TypeScript Migration

1. ✅ **Type Safety** - Catch errors at compile time
2. ✅ **Better IDE Support** - Enhanced autocomplete and IntelliSense
3. ✅ **Refactoring** - Safer code refactoring
4. ✅ **Documentation** - Types serve as inline documentation
5. ✅ **Maintainability** - Easier to maintain and understand code

## Next Steps

1. Complete remaining file conversions
2. Run `npm run type-check` to verify
3. Test all functionality
4. Remove old `.js` and `.jsx` files
5. Commit changes to Git
