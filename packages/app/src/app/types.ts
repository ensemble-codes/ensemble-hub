export interface Task {
  id: number
  prompt: string
  taskType: string
  status: 'pending' | 'executing' | 'done' | 'error' | 'assigned' | 'completed'
  createdAt: Date
  response?: string
}

export interface Tool {
  id: number
  name: string
  description: string
}

export interface Agent {
  id: number
  name: string
  status: 'active' | 'idle'
  avatar?: string
  expertise?: string[]
  category: 'DeFi' | 'Social' | 'Analysis' | 'Audit'
  reputation: number // 0-5 star rating
}

export interface TaskProposal {
  taskId: number
  agent: Agent
  price: number
  task: Task
}

export interface WorkflowStep {
  id: string
  agent: Agent
}

export interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
}

export enum Tab {
  Chat = 'chat',
  Defi1 = 'defi-1',
  Defi2 = 'defi-2',
  Defi3 = 'defi-3',
}
