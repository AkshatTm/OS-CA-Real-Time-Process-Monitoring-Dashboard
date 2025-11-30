"""
Pytest configuration for Python backend tests
"""

import pytest


@pytest.fixture(scope="session")
def backend_url():
    """Base URL for the Python backend"""
    return "http://127.0.0.1:8001"


@pytest.fixture(scope="session")
def test_timeout():
    """Default timeout for HTTP requests"""
    return 10.0


def pytest_configure(config):
    """Configure pytest markers"""
    config.addinivalue_line(
        "markers", "asyncio: mark test as an async test"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow running"
    )
