
from setuptools import setup, find_packages

setup(
    name="ai-agents-sdk",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "web3>=6.0.0",
        "eth-typing>=3.0.0",
        "python-dotenv>=1.0.0",
        "google-cloud-pubsub>=4.9.0",
    ],
    tests_require=[
        "pytest>=7.0.0",
        "pytest-asyncio>=0.21.0",
    ],
    python_requires=">=3.8",
)
