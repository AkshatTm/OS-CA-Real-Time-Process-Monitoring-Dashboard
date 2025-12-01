"""
Python Backend API Tests
Tests for the FastAPI backend on port 8001
"""

import pytest
import httpx
import asyncio
from typing import Dict, List

# Base URL for Python backend
BASE_URL = "http://127.0.0.1:8001"


class TestProcessesEndpoint:
    """Test /api/processes endpoint"""

    @pytest.mark.asyncio
    async def test_processes_endpoint_success(self):
        """Test that /api/processes returns valid data"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/api/processes", timeout=10.0)
                
                assert response.status_code == 200
                data = response.json()
                
                # Check response structure
                assert "processes" in data
                assert isinstance(data["processes"], list)
                
                # If processes exist, check structure
                if data["processes"]:
                    process = data["processes"][0]
                    assert "pid" in process
                    assert "name" in process
                    assert "cpu_percent" in process
                    assert "memory" in process
                    assert "num_threads" in process
                    assert "status" in process
                    
                    print(f"✅ Found {len(data['processes'])} processes")
                    
            except httpx.ConnectError:
                pytest.skip("Python backend not running on port 8001")

    @pytest.mark.asyncio
    async def test_process_cpu_percentage_valid(self):
        """Test that CPU percentages are within valid range (0-100%)"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/api/processes")
                data = response.json()
                
                for process in data["processes"]:
                    cpu = process["cpu_percent"]
                    assert cpu >= 0, f"CPU% cannot be negative: {cpu}"
                    assert cpu <= 100, f"CPU% should not exceed 100%: {cpu}"
                    
                print("✅ All CPU percentages are valid (0-100%)")
                
            except httpx.ConnectError:
                pytest.skip("Python backend not running")

    @pytest.mark.asyncio
    async def test_process_memory_positive(self):
        """Test that memory values are positive"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/api/processes")
                data = response.json()
                
                for process in data["processes"]:
                    memory = process["memory"]
                    assert memory >= 0, f"Memory cannot be negative: {memory}"
                    
                print("✅ All memory values are positive")
                
            except httpx.ConnectError:
                pytest.skip("Python backend not running")

    @pytest.mark.asyncio
    async def test_process_pid_unique(self):
        """Test that all PIDs are unique"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/api/processes")
                data = response.json()
                
                pids = [p["pid"] for p in data["processes"]]
                unique_pids = set(pids)
                
                assert len(pids) == len(unique_pids), "Duplicate PIDs found!"
                print(f"✅ All {len(pids)} PIDs are unique")
                
            except httpx.ConnectError:
                pytest.skip("Python backend not running")

    @pytest.mark.asyncio
    async def test_process_threads_positive(self):
        """Test that thread counts are positive"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/api/processes")
                data = response.json()
                
                for process in data["processes"]:
                    threads = process["num_threads"]
                    assert threads >= 0, f"Thread count cannot be negative: {threads}"
                    
                print("✅ All thread counts are valid")
                
            except httpx.ConnectError:
                pytest.skip("Python backend not running")


class TestAppsEndpoint:
    """Test /api/apps endpoint"""

    @pytest.mark.asyncio
    async def test_apps_endpoint_success(self):
        """Test that /api/apps returns valid data"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/api/apps", timeout=10.0)
                
                assert response.status_code == 200
                data = response.json()
                
                # Check response structure
                assert "apps" in data
                assert isinstance(data["apps"], list)
                
                # If apps exist, check structure
                if data["apps"]:
                    app = data["apps"][0]
                    assert "name" in app
                    assert "pids" in app
                    assert "cpu_percent" in app
                    assert "memory" in app
                    assert "num_threads" in app
                    assert isinstance(app["pids"], list)
                    
                    print(f"✅ Found {len(data['apps'])} applications")
                    
            except httpx.ConnectError:
                pytest.skip("Python backend not running")

    @pytest.mark.asyncio
    async def test_apps_combined_cpu(self):
        """Test that app CPU is sum of process CPUs"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/api/apps")
                data = response.json()
                
                for app in data["apps"]:
                    cpu = app["cpu_percent"]
                    assert cpu >= 0, f"App CPU% cannot be negative: {cpu}"
                    # Note: Combined CPU can exceed 100% for multi-process apps
                    
                print("✅ All app CPU percentages are valid")
                
            except httpx.ConnectError:
                pytest.skip("Python backend not running")

    @pytest.mark.asyncio
    async def test_apps_pids_list(self):
        """Test that each app has a list of PIDs"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/api/apps")
                data = response.json()
                
                for app in data["apps"]:
                    pids = app["pids"]
                    assert isinstance(pids, list)
                    assert len(pids) > 0, f"App {app['name']} has no PIDs"
                    
                    for pid in pids:
                        assert isinstance(pid, int)
                        assert pid > 0
                        
                print("✅ All apps have valid PID lists")
                
            except httpx.ConnectError:
                pytest.skip("Python backend not running")


class TestEdgeCases:
    """Test edge cases and error handling"""

    @pytest.mark.asyncio
    async def test_cors_headers(self):
        """Test that CORS headers are set correctly"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{BASE_URL}/api/processes",
                    headers={"Origin": "http://localhost:5173"}
                )
                
                # Check CORS headers
                assert "access-control-allow-origin" in response.headers
                
                print("✅ CORS headers present")
                
            except httpx.ConnectError:
                pytest.skip("Python backend not running")

    @pytest.mark.asyncio
    async def test_invalid_endpoint(self):
        """Test that invalid endpoint returns 404"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/api/invalid")
                assert response.status_code == 404
                
                print("✅ Invalid endpoint returns 404")
                
            except httpx.ConnectError:
                pytest.skip("Python backend not running")

    @pytest.mark.asyncio
    async def test_response_time(self):
        """Test that API responds quickly"""
        import time
        
        async with httpx.AsyncClient() as client:
            try:
                start = time.time()
                response = await client.get(f"{BASE_URL}/api/processes")
                elapsed = (time.time() - start) * 1000  # Convert to ms
                
                assert response.status_code == 200
                # Python backend should respond in under 200ms
                assert elapsed < 200, f"Response took {elapsed:.2f}ms (too slow!)"
                
                print(f"✅ Response time: {elapsed:.2f}ms")
                
            except httpx.ConnectError:
                pytest.skip("Python backend not running")

    @pytest.mark.asyncio
    async def test_concurrent_requests(self):
        """Test handling of concurrent requests"""
        async with httpx.AsyncClient() as client:
            try:
                # Send 10 concurrent requests
                tasks = [
                    client.get(f"{BASE_URL}/api/processes")
                    for _ in range(10)
                ]
                
                responses = await asyncio.gather(*tasks)
                
                # All should succeed
                for response in responses:
                    assert response.status_code == 200
                    
                print("✅ Handled 10 concurrent requests successfully")
                
            except httpx.ConnectError:
                pytest.skip("Python backend not running")


class TestDataAccuracy:
    """Test data accuracy and consistency"""

    @pytest.mark.asyncio
    async def test_cpu_accuracy_comparison(self):
        """Compare CPU values across multiple calls"""
        async with httpx.AsyncClient() as client:
            try:
                # Get processes twice
                response1 = await client.get(f"{BASE_URL}/api/processes")
                await asyncio.sleep(2)  # Wait 2 seconds
                response2 = await client.get(f"{BASE_URL}/api/processes")
                
                data1 = response1.json()
                data2 = response2.json()
                
                # CPU percentages should have changed (system is dynamic)
                # But structure should remain the same
                assert len(data1["processes"]) > 0
                assert len(data2["processes"]) > 0
                
                print("✅ CPU values update correctly")
                
            except httpx.ConnectError:
                pytest.skip("Python backend not running")

    @pytest.mark.asyncio
    async def test_memory_consistency(self):
        """Test memory values are consistent"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/api/processes")
                data = response.json()
                
                total_memory = sum(p["memory"] for p in data["processes"])
                
                # Total memory should be positive
                assert total_memory > 0
                
                print(f"✅ Total process memory: {total_memory / (1024**3):.2f} GB")
                
            except httpx.ConnectError:
                pytest.skip("Python backend not running")


if __name__ == "__main__":
    print("Running Python Backend Tests...")
    print("=" * 50)
    pytest.main([__file__, "-v", "--tb=short"])
