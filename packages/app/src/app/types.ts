export interface Task {
  id: number
  prompt: string
  taskType: string
  status: 'pending' | 'executing' | 'done' | 'error' | 'assigned' | 'completed'
  progress: number
  createdAt: number
  response?: string
}

export interface Tool {
  id: number
  name: string
  description: string
}

export interface Link {
  name: string
  url: string
  icon: string
}

export interface Agent {
  id: number
  name: string
  status: 'active' | 'idle'
  avatar: string
  expertise?: string[]
  category: 'DeFi' | 'Social' | 'Analysis' | 'Audit'
  reputation: number // 0-5 star rating
  links: Link[]
}

export interface TaskProposal {
  id: number
  agent: Agent
  price: number
  time: number
  isBestValue: boolean
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
