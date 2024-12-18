'use client'

import { useState, useEffect } from 'react'
import { TaskProposal, Agent, Task, Tab } from './types'
import { usePersistentTasks } from './hooks/usePersistentTasks'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'

interface ActivityLogEntry {
  id: number
  message: string
  timestamp: Date
}

export default function Home() {
  const { tasks, addTask, updateTaskStatus, updateTaskResponse } = usePersistentTasks()
  const [currentProposal, setCurrentProposal] = useState<TaskProposal | null>(null)
  const [isProposalOpen, setIsProposalOpen] = useState(false)
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([])
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([])
  const [isAgentPoolActive, setIsAgentPoolActive] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskStatusOpen, setIsTaskStatusOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Chat)

  useEffect(() => {
    const storedLog = localStorage.getItem('ensemble-activity-log')
    if (storedLog) {
      const parsedLog = JSON.parse(storedLog)
      setActivityLog(parsedLog.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })))
    }

    const storedAgents = localStorage.getItem('ensemble-selected-agents')
    if (storedAgents) {
      setSelectedAgents(JSON.parse(storedAgents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ensemble-selected-agents', JSON.stringify(selectedAgents))
  }, [selectedAgents])

  const addActivityLogEntry = (message: string) => {
    const newEntry: ActivityLogEntry = {
      id: Date.now(),
      message,
      timestamp: new Date()
    }
    const updatedLog = [newEntry, ...activityLog].slice(0, 100) // Keep only the last 100 entries
    setActivityLog(updatedLog)
    localStorage.setItem('ensemble-activity-log', JSON.stringify(updatedLog))
  }

  const handleAddTask = (prompt: string, taskType: string) => {
    const newTask = addTask(prompt, taskType)
    addActivityLogEntry(`New task created: ${prompt}`)

    // Show proposal dialog after 2 seconds
    setTimeout(() => {
      const proposal: TaskProposal = {
        taskId: newTask.id,
        agent: {
          id: 1,
          name: "AI Analysis Agent",
          status: "active",
          expertise: ["Data Analysis", "Machine Learning", "NLP"]
        },
        price: 0.02,
        task: newTask
      }
      setCurrentProposal(proposal)
      setIsProposalOpen(true)
      addActivityLogEntry(`Proposal received for task: ${prompt}`)
    }, 5000)
  }

  const handleAcceptProposal = async (proposal: TaskProposal) => {
    updateTaskStatus(proposal.taskId, 'assigned')
    addActivityLogEntry(`Proposal accepted for task: ${proposal.task.prompt}`)
    setIsProposalOpen(false)
    setCurrentProposal(null)

    // Wait 3-5 seconds before marking the task as complete
    const delay = Math.floor(Math.random() * (5000 - 3000 + 1) + 3000)
    setTimeout(() => {
      const mockResponse = `Task completed successfully. Here's a summary of the findings:
  1. Data analysis performed on the given dataset.
  2. Key insights extracted using machine learning algorithms.
  3. Natural language processing techniques applied for text analysis.
  4. Recommendations provided based on the analysis results.
  
  For more detailed information, please refer to the full report attached to this response.`
      updateTaskResponse(proposal.taskId, mockResponse)
      updateTaskStatus(proposal.taskId, 'completed')
      addActivityLogEntry(`Task completed: ${proposal.task.prompt}`)
    }, delay)
  }

  const handleRejectProposal = async (proposal: TaskProposal) => {
    addActivityLogEntry(`Proposal rejected for task: ${proposal.task.prompt}`)
    setIsProposalOpen(false)
    setCurrentProposal(null)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskStatusOpen(true)
  }

  return (
    <div className='flex'>
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {selectedTab === Tab.Chat && <Chat />}
    </div>
  )
}

