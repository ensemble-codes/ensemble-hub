'use client'

import { useState, useEffect } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { TaskProposal, Agent, Task } from './types'
import { usePersistentTasks } from './hooks/usePersistentTasks'
import Sidebar from './components/Sidebar'
import Window from './components/Window'
import Chat from './components/Chat'
import ChooseAgent from './components/ChooseAgent'
import { AiProvider } from '@/context/aiContext'

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
  const [selectedTab, setSelectedTab] = useState(-1)

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
  }

  const handleAcceptProposal = async (proposal: TaskProposal) => {
    updateTaskStatus(proposal.task.id, 'assigned')
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
      updateTaskResponse(proposal.task.id, mockResponse)
      updateTaskStatus(proposal.task.id, 'completed')
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
      <PrivyProvider
        appId='cm4zzth43053ru0vnwr8oxegh'
      >
        <AiProvider>
          <div className='flex'>
              <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
              <Window>
                {selectedTab === -1 && <Chat setSelectedTab={setSelectedTab} />}
                {tasks.map((task) => (
                  selectedTab === task.id && <ChooseAgent key={task.id} task={task} />
                ))}
              </Window>
          </div>
        </AiProvider>
      </PrivyProvider>
  )
}

