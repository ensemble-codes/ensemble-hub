
import os
import pytest
from dotenv import load_dotenv
from web3 import Web3
from ..src.ensemble import Ensemble
from ..src.types import ContractConfig, Network

load_dotenv()

def setup_env(user_type='user'):
    provider = Web3(Web3.HTTPProvider(os.getenv('RPC_URL')))
    pk = os.getenv('AGENT_PRIVATE_KEY') if user_type == 'agent' else os.getenv('PRIVATE_KEY')
    return {'provider': provider, 'private_key': pk}

def setup_sdk(user_type='user'):
    env = setup_env(user_type)
    config = ContractConfig(
        network=Network(
            rpc_url=os.getenv('RPC_URL'),
            chain_id=int(os.getenv('CHAIN_ID')),
            name=os.getenv('NETWORK_NAME')
        ),
        agent_registry_address=os.getenv('AGENT_REGISTRY_ADDRESS'),
        task_registry_address=os.getenv('TASK_REGISTRY_ADDRESS')
    )
    sdk = Ensemble(config)
    sdk.connect(env['private_key'])
    return sdk

class TestEnsembleSDK:
    @pytest.fixture(autouse=True)
    async def setup(self):
        self.sdk = setup_sdk()
        yield
        # Cleanup if needed

    async def test_initialization(self):
        env = setup_env()
        sdk = Ensemble(config)
        await sdk.connect(env['private_key'])
        assert isinstance(sdk, Ensemble)

    async def test_create_task(self):
        task_params = {
            "prompt": "Test task",
            "task_type": 0  # SIMPLE
        }
        task_id = await self.sdk.task_service.create_task(task_params)
        assert isinstance(task_id, int)

    async def test_get_tasks_by_owner(self):
        owner_address = await self.sdk.agent_service.get_address()
        tasks = await self.sdk.task_service.get_tasks_by_owner(owner_address)
        assert isinstance(tasks, list)
        assert len(tasks) >= 0

    async def test_agent_registration(self):
        agent_data = {
            "model": "gpt-4",
            "prompt": "You are a crypto analyzer agent",
            "skills": ["analyzing stables", "analyzing memes"]
        }
        agent_address = await self.sdk.agent_service.register_agent(
            agent_data["model"],
            agent_data["prompt"],
            agent_data["skills"]
        )
        assert Web3.is_address(agent_address)

        agent_info = await self.sdk.agent_service.get_agent_data(agent_address)
        assert agent_info.model == agent_data["model"]
        assert agent_info.prompt == agent_data["prompt"]
        assert len(agent_info.skills) == len(agent_data["skills"])
