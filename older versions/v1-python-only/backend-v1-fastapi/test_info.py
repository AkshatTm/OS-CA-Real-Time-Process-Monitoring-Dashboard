import psutil
import traceback

# Test with PID 4 (System process)
try:
    proc = psutil.Process(4)
    print(f"Testing PID 4: {proc.name()}")
    
    print("\nTrying exe()...")
    try:
        exe = proc.exe()
        print(f"  exe: {exe}")
    except Exception as e:
        print(f"  exe ERROR: {type(e).__name__}: {e}")
    
    print("\nTrying cwd()...")
    try:
        cwd = proc.cwd()
        print(f"  cwd: {cwd}")
    except Exception as e:
        print(f"  cwd ERROR: {type(e).__name__}: {e}")
    
    print("\nTrying connections()...")
    try:
        conns = proc.connections()
        print(f"  connections: {len(conns)}")
    except Exception as e:
        print(f"  connections ERROR: {type(e).__name__}: {e}")
        traceback.print_exc()
    
    print("\nTrying open_files()...")
    try:
        files = proc.open_files()
        print(f"  open_files: {len(files)}")
    except Exception as e:
        print(f"  open_files ERROR: {type(e).__name__}: {e}")
    
except Exception as e:
    print(f"MAIN ERROR: {type(e).__name__}: {e}")
    traceback.print_exc()
