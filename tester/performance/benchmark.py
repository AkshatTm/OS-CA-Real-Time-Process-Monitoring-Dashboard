"""
Performance Benchmarking for System Monitor
Tests response times, load handling, and compares Rust vs Python performance
"""

import asyncio
import time
import statistics
from typing import List, Dict
import httpx


class PerformanceBenchmark:
    def __init__(self):
        self.rust_url = "http://127.0.0.1:8000"
        self.python_url = "http://127.0.0.1:8001"
        self.results = {
            "rust": {"response_times": [], "success_count": 0, "error_count": 0},
            "python": {"response_times": [], "success_count": 0, "error_count": 0}
        }

    async def measure_response_time(self, url: str, backend_name: str) -> float:
        """Measure response time for a single request"""
        start = time.perf_counter()
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=10.0)
                elapsed = (time.perf_counter() - start) * 1000  # Convert to ms
                
                if response.status_code == 200:
                    self.results[backend_name]["success_count"] += 1
                    self.results[backend_name]["response_times"].append(elapsed)
                    return elapsed
                else:
                    self.results[backend_name]["error_count"] += 1
                    return -1
        except Exception as e:
            self.results[backend_name]["error_count"] += 1
            return -1

    async def benchmark_single_requests(self, num_requests: int = 100):
        """Benchmark sequential requests"""
        print(f"\n{'='*60}")
        print(f"Sequential Request Benchmark ({num_requests} requests)")
        print(f"{'='*60}")

        # Benchmark Rust backend
        print("\nRust Backend (/api/stats):")
        rust_times = []
        for i in range(num_requests):
            elapsed = await self.measure_response_time(
                f"{self.rust_url}/api/stats", "rust"
            )
            if elapsed > 0:
                rust_times.append(elapsed)
            if (i + 1) % 20 == 0:
                print(f"  Progress: {i+1}/{num_requests}")

        # Benchmark Python backend
        print("\nPython Backend (/api/processes):")
        python_times = []
        for i in range(num_requests):
            elapsed = await self.measure_response_time(
                f"{self.python_url}/api/processes", "python"
            )
            if elapsed > 0:
                python_times.append(elapsed)
            if (i + 1) % 20 == 0:
                print(f"  Progress: {i+1}/{num_requests}")

        self._print_stats("Rust", rust_times)
        self._print_stats("Python", python_times)

    async def benchmark_concurrent_requests(self, num_concurrent: int = 50):
        """Benchmark concurrent requests"""
        print(f"\n{'='*60}")
        print(f"Concurrent Request Benchmark ({num_concurrent} concurrent)")
        print(f"{'='*60}")

        # Rust backend
        print("\nRust Backend (concurrent):")
        start = time.perf_counter()
        
        tasks = [
            self.measure_response_time(f"{self.rust_url}/api/stats", "rust")
            for _ in range(num_concurrent)
        ]
        rust_times = await asyncio.gather(*tasks)
        rust_times = [t for t in rust_times if t > 0]
        
        rust_total = (time.perf_counter() - start) * 1000
        print(f"  Total time: {rust_total:.2f}ms")

        # Python backend
        print("\nPython Backend (concurrent):")
        start = time.perf_counter()
        
        tasks = [
            self.measure_response_time(f"{self.python_url}/api/processes", "python")
            for _ in range(num_concurrent)
        ]
        python_times = await asyncio.gather(*tasks)
        python_times = [t for t in python_times if t > 0]
        
        python_total = (time.perf_counter() - start) * 1000
        print(f"  Total time: {python_total:.2f}ms")

        self._print_stats("Rust", rust_times)
        self._print_stats("Python", python_times)

    async def benchmark_sustained_load(self, duration_seconds: int = 30):
        """Benchmark sustained load over time"""
        print(f"\n{'='*60}")
        print(f"Sustained Load Benchmark ({duration_seconds} seconds)")
        print(f"{'='*60}")

        start_time = time.time()
        request_count = 0
        
        print("\nSending requests continuously...")
        
        while (time.time() - start_time) < duration_seconds:
            # Alternate between backends
            if request_count % 2 == 0:
                await self.measure_response_time(f"{self.rust_url}/api/stats", "rust")
            else:
                await self.measure_response_time(f"{self.python_url}/api/processes", "python")
            
            request_count += 1
            
            if request_count % 50 == 0:
                elapsed = time.time() - start_time
                print(f"  {request_count} requests in {elapsed:.1f}s")

        total_time = time.time() - start_time
        requests_per_second = request_count / total_time
        
        print(f"\nTotal requests: {request_count}")
        print(f"Requests/second: {requests_per_second:.2f}")

    async def benchmark_endpoints(self):
        """Benchmark different endpoints"""
        print(f"\n{'='*60}")
        print("Endpoint Comparison Benchmark")
        print(f"{'='*60}")

        endpoints = [
            ("Rust /api/stats", f"{self.rust_url}/api/stats"),
            ("Python /api/processes", f"{self.python_url}/api/processes"),
            ("Python /api/apps", f"{self.python_url}/api/apps"),
        ]

        for name, url in endpoints:
            print(f"\n{name}:")
            times = []
            backend = "rust" if "8000" in url else "python"
            
            for _ in range(50):
                elapsed = await self.measure_response_time(url, backend)
                if elapsed > 0:
                    times.append(elapsed)

            if times:
                print(f"  Average: {statistics.mean(times):.2f}ms")
                print(f"  Median: {statistics.median(times):.2f}ms")
                print(f"  Min: {min(times):.2f}ms")
                print(f"  Max: {max(times):.2f}ms")

    def _print_stats(self, backend_name: str, times: List[float]):
        """Print statistics for response times"""
        if not times:
            print(f"\n{backend_name} - No successful requests")
            return

        print(f"\n{backend_name} Response Times:")
        print(f"  Count: {len(times)}")
        print(f"  Average: {statistics.mean(times):.2f}ms")
        print(f"  Median: {statistics.median(times):.2f}ms")
        print(f"  Min: {min(times):.2f}ms")
        print(f"  Max: {max(times):.2f}ms")
        print(f"  Std Dev: {statistics.stdev(times):.2f}ms" if len(times) > 1 else "  Std Dev: N/A")

        # Percentiles
        sorted_times = sorted(times)
        p95 = sorted_times[int(len(sorted_times) * 0.95)]
        p99 = sorted_times[int(len(sorted_times) * 0.99)]
        print(f"  95th percentile: {p95:.2f}ms")
        print(f"  99th percentile: {p99:.2f}ms")

    def print_summary(self):
        """Print final summary"""
        print(f"\n{'='*60}")
        print("PERFORMANCE SUMMARY")
        print(f"{'='*60}")

        for backend, data in self.results.items():
            print(f"\n{backend.upper()} Backend:")
            print(f"  Total requests: {data['success_count'] + data['error_count']}")
            print(f"  Successful: {data['success_count']}")
            print(f"  Failed: {data['error_count']}")
            
            if data['response_times']:
                print(f"  Average response time: {statistics.mean(data['response_times']):.2f}ms")


async def run_benchmarks():
    """Run all benchmarks"""
    benchmark = PerformanceBenchmark()

    print("=" * 60)
    print("SYSTEM MONITOR PERFORMANCE BENCHMARK")
    print("=" * 60)
    print("\nThis will test:")
    print("  1. Sequential request performance")
    print("  2. Concurrent request handling")
    print("  3. Sustained load over time")
    print("  4. Different endpoint performance")
    print("\nMake sure both backends are running:")
    print("  - Rust backend on port 8000")
    print("  - Python backend on port 8001")
    print("=" * 60)

    try:
        # Test if backends are running
        async with httpx.AsyncClient() as client:
            try:
                await client.get(f"{benchmark.rust_url}/api/stats", timeout=5.0)
                print("\n✅ Rust backend is running")
            except:
                print("\n⚠️  Rust backend not detected on port 8000")

            try:
                await client.get(f"{benchmark.python_url}/api/processes", timeout=5.0)
                print("✅ Python backend is running")
            except:
                print("⚠️  Python backend not detected on port 8001")

        # Run benchmarks
        await benchmark.benchmark_single_requests(100)
        await benchmark.benchmark_concurrent_requests(50)
        await benchmark.benchmark_endpoints()
        await benchmark.benchmark_sustained_load(30)

        # Print summary
        benchmark.print_summary()

        # Performance targets
        print(f"\n{'='*60}")
        print("PERFORMANCE TARGETS")
        print(f"{'='*60}")
        print("\nTarget Response Times:")
        print("  Rust backend: < 20ms average")
        print("  Python backend: < 100ms average")
        print("\nTarget Throughput:")
        print("  > 100 requests/second sustained")

    except KeyboardInterrupt:
        print("\n\nBenchmark interrupted by user")
        benchmark.print_summary()


if __name__ == "__main__":
    print("\nStarting performance benchmarks...")
    asyncio.run(run_benchmarks())
    print("\n✅ Benchmark complete!")
