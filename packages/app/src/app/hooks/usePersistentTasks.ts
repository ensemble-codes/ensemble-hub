'use client'

import { useState, useEffect } from 'react'
import { Task } from '../types'

export function usePersistentTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  // Load tasks from localStorage on initial mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('ensemble-tasks')
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks)
      // Convert stored date strings back to Date objects
      const tasksWithDates = parsedTasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }))
      setTasks(tasksWithDates)
    }
  }, [])

  // Save tasks to localStorage whenever they change
  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks)
    localStorage.setItem('ensemble-tasks', JSON.stringify(newTasks))
  }

  const addTask = (prompt: string, taskType: string) => {
    const newTask: Task = {
      id: Date.now(),
      prompt,
      taskType,
      status: 'pending',
      createdAt: new Date(),
    }
    updateTasks([...tasks, newTask])
    return newTask
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
    addTask,
    updateTaskStatus,
    updateTaskResponse
  }
}

