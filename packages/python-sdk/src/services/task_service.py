
from typing import Dict, Optional
from web3 import Web3
from web3.contract import Contract
from eth_typing import Address

class TaskService:
    def __init__(self, task_registry: Contract, account: Address):
        self.task_registry = task_registry
        self.account = account

    async def create_task(self, params: Dict) -> int:
        tx = await self.task_registry.functions.createTask(
            params["prompt"],
            params["task_type"]
        ).transact({'from': self.account.address})
        receipt = await self.task_registry.web3.eth.wait_for_transaction_receipt(tx)
        
        task_id = self._find_event_in_receipt(receipt, "TaskCreated")
        if not task_id:
            raise Exception("Task creation failed: No task ID in event")
        return task_id

    async def get_task_data(self, task_id: str) -> Dict:
        task = await self.task_registry.functions.tasks(task_id).call()
        return {
            "id": task[0],
            "prompt": task[1],
            "task_type": task[2],
            "owner": task[3],
            "status": task[4],
            "assignee": task[5]
        }

    async def get_tasks_by_owner(self, owner: str) -> list:
        return await self.task_registry.functions.getTasksByOwner(owner).call()

    async def complete_task(self, task_id: int, result: str) -> None:
        try:
            tx = await self.task_registry.functions.completeTask(
                task_id,
                result
            ).transact({'from': self.account.address})
            await self.task_registry.web3.eth.wait_for_transaction_receipt(tx)
        except Exception as e:
            print(f"Completing task failed: {str(e)}")
            raise

    def _find_event_in_receipt(self, receipt: dict, event_name: str) -> Optional[dict]:
        for log in receipt['logs']:
            try:
                event = self.task_registry.events[event_name]().process_log(log)
                if event:
                    return event['args']['taskId']
            except:
                continue
        return None
