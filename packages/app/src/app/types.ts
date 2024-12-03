export interface Task {
  id: number
  prompt: string
  status: 'pending' | 'executing' | 'done' | 'error'
  createdAt: Date
}

