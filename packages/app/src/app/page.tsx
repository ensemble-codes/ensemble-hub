'use client'

import { useState } from 'react'
import TaskList from './components/TaskList'
import PromptInterface from './components/PromptInterface'
import { Task } from './types'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = (prompt: string) => {
    const newTask: Task = {
      id: Date.now(),
      prompt,
      status: 'pending',
      createdAt: new Date(),
    }
    setTasks([...tasks, newTask])
  }

  return (
    <div className="container mx-auto p-4 flex flex-col h-full">
      <TaskList tasks={tasks} />
      <PromptInterface onSubmit={addTask} />
    </div>
  )
}

