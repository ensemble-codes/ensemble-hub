'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Agent, WorkflowStep, Workflow } from '../types'
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import WorkflowPromptInterface from '../components/WorkflowPromptInterface'

export default function Workflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null)
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([
    { id: 1, name: 'DeFi Analyst', status: 'active', category: 'DeFi', expertise: ['Yield Farming', 'Liquidity Pools'], reputation: 4.5 },
    { id: 2, name: 'Social Media Manager', status: 'active', category: 'Social', expertise: ['Content Creation', 'Community Management'], reputation: 4.2 },
    { id: 3, name: 'Data Scientist', status: 'active', category: 'Analysis', expertise: ['Machine Learning', 'Data Visualization'], reputation: 4.8 },
    { id: 4, name: 'Smart Contract Auditor', status: 'active', category: 'Audit', expertise: ['Solidity', 'Security Analysis'], reputation: 4.9 },
  ])
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([])

  const handleCreateWorkflow = (name: string, description: string) => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name,
      description,
      steps: []
    }
    setWorkflows([...workflows, newWorkflow])
    setCurrentWorkflow(newWorkflow)
  }

  const handleAgentSelection = (agent: Agent) => {
    setSelectedAgents(prev => 
      prev.some(a => a.id === agent.id)
        ? prev.filter(a => a.id !== agent.id)
        : [...prev, agent]
    )
  }

  const addAgentsToWorkflow = () => {
    if (currentWorkflow) {
      const newSteps = selectedAgents.map(agent => ({
        id: `step-${currentWorkflow.steps.length + selectedAgents.indexOf(agent) + 1}`,
        agent: agent
      }))
      const updatedWorkflow = {
        ...currentWorkflow,
        steps: [...currentWorkflow.steps, ...newSteps]
      }
      setCurrentWorkflow(updatedWorkflow)
      setWorkflows(workflows.map(w => w.id === currentWorkflow.id ? updatedWorkflow : w))
      setSelectedAgents([])
    }
  }

  const removeStepFromWorkflow = (stepId: string) => {
    if (currentWorkflow) {
      const updatedSteps = currentWorkflow.steps.filter(step => step.id !== stepId)
      const updatedWorkflow = { ...currentWorkflow, steps: updatedSteps }
      setCurrentWorkflow(updatedWorkflow)
      setWorkflows(workflows.map(w => w.id === currentWorkflow.id ? updatedWorkflow : w))
    }
  }

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-64px)]">
      <h1 className="text-3xl font-bold mb-6">Workflow Builder</h1>
      <div className="flex gap-4 flex-grow overflow-hidden">
        <Card className="w-1/3">
          <CardHeader>
            <CardTitle>Available Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <ul className="space-y-2">
                {availableAgents.map((agent) => (
                  <li key={agent.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`agent-${agent.id}`}
                      checked={selectedAgents.some(a => a.id === agent.id)}
                      onCheckedChange={() => handleAgentSelection(agent)}
                    />
                    <label htmlFor={`agent-${agent.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {agent.name}
                    </label>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <Button 
              onClick={addAgentsToWorkflow} 
              className="mt-4 w-full"
              disabled={selectedAgents.length === 0 || !currentWorkflow}
            >
              Add Selected Agents to Workflow
            </Button>
          </CardContent>
        </Card>
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle>{currentWorkflow ? currentWorkflow.name : 'No Workflow Selected'}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentWorkflow ? (
              <ScrollArea className="h-[calc(100vh-250px)]">
                <ul className="space-y-2">
                  {currentWorkflow.steps.map((step) => (
                    <li key={step.id} className="flex justify-between items-center p-2 bg-blue-100 rounded">
                      <span>{step.agent.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeStepFromWorkflow(step.id)}>Remove</Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <p>Create a new workflow to get started.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <WorkflowPromptInterface onSubmit={handleCreateWorkflow} />
      </div>
    </div>
  )
}

