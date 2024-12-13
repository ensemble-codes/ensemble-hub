
from web3 import Web3
from eth_typing import Address
from .services.agent_service import AgentService
from .services.task_service import TaskService
from .types import ContractConfig

class Ensemble:
    def __init__(self, config: ContractConfig):
        self.web3 = Web3(Web3.HTTPProvider(config.network.rpc_url))
        self.config = config
        
        # Load contract ABIs
        with open('abi/AgentsRegistry.abi.json') as f:
            agents_registry_abi = f.read()
        with open('abi/TaskRegistry.abi.json') as f:
            task_registry_abi = f.read()
            
        self.agent_registry = self.web3.eth.contract(
            address=config.agent_registry_address,
            abi=agents_registry_abi
        )
        self.task_registry = self.web3.eth.contract(
            address=config.task_registry_address,
            abi=task_registry_abi
        )
        
    async def connect(self, private_key: str):
        account = self.web3.eth.account.from_key(private_key)
        self.agent_service = AgentService(self.agent_registry, account)
        self.task_service = TaskService(self.task_registry, account)
        
        await self._validate_network()
        return self
        
    async def _validate_network(self):
        network = await self.web3.eth.chain_id
        if network != self.config.network.chain_id:
            raise Exception(f"Chain ID mismatch. Expected {self.config.network.chain_id}, got {network}")
