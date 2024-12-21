'use client'

import { useState, useEffect } from 'react'
import { Task, TaskProposal } from '../types'

export function usePersistentTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [proposals, setProposals] = useState<TaskProposal[]>([])

  // Load tasks from localStorage on initial mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('ensemble-tasks')
    const storedProposals = localStorage.getItem('ensemble-proposals')
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks)
      setTasks(parsedTasks)
    }
    if (storedProposals) {
      const parsedProposals = JSON.parse(storedProposals)
      setProposals(parsedProposals)
    }
  }, [])

  // Save tasks to localStorage whenever they change
  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks)
    localStorage.setItem('ensemble-tasks', JSON.stringify(newTasks))
  }

  const updateProposals = (newProposals: TaskProposal[]) => {
    setProposals(newProposals)
    localStorage.setItem('ensemble-proposals', JSON.stringify(newProposals))
  }

  const addTask = (prompt: string, taskType: string) => {
    const newTask: Task = {
      id: Date.now(),
      prompt,
      taskType,
      status: 'pending',
      progress: 0,
      createdAt: Date.now(),
    }
    updateTasks([...tasks, newTask])
    return newTask
  }

  const addProposal = (proposal: TaskProposal) => {
    updateProposals([...proposals, proposal])
    return proposal
  }

  const updateTaskStatus = (taskId: number, status: Task['status']) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    )
    updateTasks(updatedTasks)
  }

  const updateTaskResponse = (taskId: number, response: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, response } : task
    )
    updateTasks(updatedTasks)
  }

  return {
    tasks,
    proposals,
    addTask,
    updateTaskStatus,
    updateTaskResponse,
    addProposal
  }
}

