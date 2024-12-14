
from google.cloud import pubsub_v1
from typing import Any, Callable, Optional
from web3 import Contract
from eth_typing import Address
from ..types import Proposal

class ProposalService:
    def __init__(self, project_id: str, topic_name: str, task_registry: Contract):
        self.pubsub = pubsub_v1.PublisherClient()
        self.topic_name = topic_name
        self.task_registry = task_registry
        self.subscription = None
        self.on_new_proposal: Optional[Callable[[Proposal], None]] = None
        self.project_id = project_id
        
    async def setup_subscription(self, user_id: str):
        subscription_name = f"tasks-{user_id}"
        topic_path = self.pubsub.topic_path(self.project_id, self.topic_name)
        
        # Create topic if it doesn't exist
        try:
            self.pubsub.get_topic(request={"topic": topic_path})
        except Exception:
            self.pubsub.create_topic(request={"name": topic_path})
            
        subscription_path = self.pubsub.subscription_path(
            self.project_id, subscription_name
        )
        
        # Create subscription if it doesn't exist
        try:
            self.pubsub.get_subscription(request={"subscription": subscription_path})
        except Exception:
            self.pubsub.create_subscription(
                request={"name": subscription_path, "topic": topic_path}
            )
            
        def callback(message):
            if self.on_new_proposal:
                proposal = Proposal.from_dict(message.data)
                self.on_new_proposal(proposal)
            message.ack()
            
        subscriber = pubsub_v1.SubscriberClient()
        self.subscription = subscriber.subscribe(subscription_path, callback)
        
    async def send_proposal(self, task_id: str, agent_id: str, price: int) -> None:
        topic_path = self.pubsub.topic_path(self.project_id, self.topic_name)
        data = {
            "taskId": task_id,
            "price": str(price),
            "agent": agent_id
        }
        
        try:
            future = self.pubsub.publish(
                topic_path, 
                str(data).encode("utf-8")
            )
            future.result()
            print(f"Proposal for task {task_id} sent successfully.")
        except Exception as e:
            print(f"Failed to send proposal for task {task_id}:", e)
            raise e
            
    async def get_proposals(self, task_id: str) -> list[str]:
        # Implement PubSub message pulling if needed
        return []
        
    def set_on_new_proposal_listener(self, listener: Callable[[Proposal], None]):
        self.on_new_proposal = listener
        
    async def approve_proposal(self, task_id: int, proposal: Proposal) -> None:
        try:
            tx = await self.task_registry.functions.approveProposal(
                task_id, 
                proposal
            ).transact()
            await tx.wait()
        except Exception as e:
            print("Approving proposal failed:", e)
            raise e
