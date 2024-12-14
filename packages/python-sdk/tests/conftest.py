
import pytest
import asyncio

pytest_plugins = ('pytest_asyncio',)

def pytest_configure(config):
    config.option.asyncio_default_fixture_loop_scope = "function"

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()
