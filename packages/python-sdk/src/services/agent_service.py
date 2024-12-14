
from decimal import Decimal
from typing import List
from web3 import Web3
from web3.contract import Contract
from eth_typing import Address
from ..types import AgentData

class AgentService:
    def __init__(self, agent_registry: Contract, account: Address):
        self.agent_registry = agent_registry
        self.account = account

    async def get_address(self) -> str:
        return self.account.address

    async def register_agent(self, model: str, prompt: str, skills: List[str]) -> str:
        tx = await self.agent_registry.functions.registerAgent(
            model, prompt, skills
        ).transact({'from': self.account})
        receipt = await self.agent_registry.web3.eth.wait_for_transaction_receipt(tx)
        
        event = self._find_event_in_receipt(receipt, "AgentRegistered")
        if not event or not event['args']:
            raise Exception("Agent registration failed")
        return event['args'][0]

    async def get_agent_data(self, agent_address: str) -> AgentData:
        data = await self.agent_registry.functions.getAgentData(agent_address).call()
        is_registered = await self.agent_registry.functions.isRegistered(agent_address).call()
        
        return AgentData(
            address=agent_address,
            model=data[0],
            prompt=data[1],
            skills=data[2],
            reputation=Decimal(data[3]),
            is_registered=is_registered
        )

    async def is_agent_registered(self, agent_address: str) -> bool:
        return await self.agent_registry.functions.isRegistered(agent_address).call()

    async def add_agent_skill(self, name: str, level: int) -> None:
        tx = await self.agent_registry.functions.addSkill(name, level).transact({'from': self.account})
        await self.agent_registry.web3.eth.wait_for_transaction_receipt(tx)

    async def update_agent_reputation(self, reputation: Decimal) -> None:
        tx = await self.agent_registry.functions.updateReputation(int(reputation)).transact({'from': self.account})
        await self.agent_registry.web3.eth.wait_for_transaction_receipt(tx)

    def _find_event_in_receipt(self, receipt: dict, event_name: str) -> Optional[dict]:
        for log in receipt['logs']:
            try:
                event = self.agent_registry.events[event_name]().process_log(log)
                return event
            except:
                continue
        return None
