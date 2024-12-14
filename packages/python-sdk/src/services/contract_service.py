
from web3 import Web3
from eth_typing import Address
from typing import Any

class ContractService:
    def __init__(self, provider: Web3, account: Address):
        self.provider = provider
        self.account = account

    async def validate_network(self, expected_chain_id: int) -> None:
        network = await self.provider.eth.chain_id
        if network != expected_chain_id:
            raise Exception(f"Chain ID mismatch. Expected {expected_chain_id}, got {network}")

    def create_contract(self, address: str, abi: Any) -> Any:
        return self.provider.eth.contract(address=address, abi=abi)
