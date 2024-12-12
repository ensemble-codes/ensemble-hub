'use client'

import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import ActivityLog from './components/ActivityLog'
import PromptInterface from './components/PromptInterface'
import TaskProposalDialog from './components/TaskProposalDialog'
import TaskStatusWidget from './components/TaskStatusWidget'
import { TaskProposal, Agent, Task } from './types'
import { usePersistentTasks } from './hooks/usePersistentTasks'
import { Switch } from "@/components/ui/switch"
import AgentPoolWidget from './components/AgentPoolWidget'

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
    <div className="flex h-full">
      <div className="flex-grow overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-hidden">
            <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
          </div>
          <div className="flex-shrink-0">
            <PromptInterface onSubmit={handleAddTask} />
          </div>
        </div>
      </div>
      <div className="w-1/3 ml-4 overflow-hidden flex flex-col">
        <div className="flex-grow overflow-hidden mb-4">
          <ActivityLog entries={activityLog} />
        </div>
        <div className="h-2/5">
          <div className="flex items-center justify-between mb-2">
            <span>Agents Pool</span>
            <Switch
              checked={isAgentPoolActive}
              onCheckedChange={setIsAgentPoolActive}
            />
          </div>
          <AgentPoolWidget selectedAgents={selectedAgents} isActive={isAgentPoolActive} />
        </div>
      </div>
      {currentProposal && (
        <TaskProposalDialog
          isOpen={isProposalOpen}
          onClose={() => {
            setIsProposalOpen(false)
            setCurrentProposal(null)
          }}
          proposal={currentProposal}
          onAccept={handleAcceptProposal}
          onReject={handleRejectProposal}
        />
      )}
      <TaskStatusWidget
        task={selectedTask}
        isOpen={isTaskStatusOpen}
        onClose={() => setIsTaskStatusOpen(false)}
      />
    </div>
  )
}

