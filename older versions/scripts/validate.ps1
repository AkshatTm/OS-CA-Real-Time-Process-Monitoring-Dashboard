# Quick Validation Test for Task Manager Pro
Write-Host "🧪 Task Manager Pro - Quick Validation" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check Python
Write-Host "[1/6] Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found" -ForegroundColor Red
    exit 1
}

# Test 2: Check Node
Write-Host "[2/6] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    exit 1
}

# Test 3: Check Backend Dependencies
Write-Host "[3/6] Checking Backend Dependencies..." -ForegroundColor Yellow
cd backend
$packages = pip list 2>&1 | Select-String -Pattern "fastapi|uvicorn|psutil"
if ($packages) {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
    $packages | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "⚠️  Some backend dependencies missing" -ForegroundColor Yellow
}
cd ..

# Test 4: Check Frontend Dependencies
Write-Host "[4/6] Checking Frontend Dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend/node_modules") {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Run: cd frontend; npm install" -ForegroundColor Gray
}

# Test 5: Check Platform Detection in Code
Write-Host "[5/6] Checking Platform Detection..." -ForegroundColor Yellow
$mainPy = Get-Content "backend/main.py" -Raw
if ($mainPy -match "platform\.system\(\)") {
    Write-Host "✅ Platform detection implemented" -ForegroundColor Green
}
if ($mainPy -match 'if platform\.system\(\) != "Windows"') {
    Write-Host "✅ Cross-platform attribute handling found" -ForegroundColor Green
}

# Test 6: Check Script Files
Write-Host "[6/6] Checking Script Files..." -ForegroundColor Yellow
$scripts = @("setup.bat", "start.bat", "setup.sh", "start.sh")
$foundScripts = @()
foreach ($script in $scripts) {
    if (Test-Path $script) {
        $foundScripts += $script
    }
}
Write-Host "✅ Found $($foundScripts.Count)/4 scripts: $($foundScripts -join ', ')" -ForegroundColor Green

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ Validation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To run full tests:" -ForegroundColor Cyan
Write-Host "  1. Start backend: cd backend; python main.py" -ForegroundColor Gray
Write-Host "  2. In another terminal: .\test.ps1" -ForegroundColor Gray
Write-Host ""
