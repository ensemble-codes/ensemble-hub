'use client'

import { useState, useEffect } from 'react'
import { Agent } from '../types'
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import AgentRegistrationDialog from '../components/AgentRegistrationDialog'
import AgentCard from '../components/AgentCard'

const initialAgents: Agent[] = [
  { id: 1, name: 'DeFi Analyst', status: 'active', category: 'DeFi', expertise: ['Yield Farming', 'Liquidity Pools'], reputation: 4.5 },
  { id: 2, name: 'Social Media Manager', status: 'idle', category: 'Social', expertise: ['Content Creation', 'Community Management'], reputation: 4.2 },
  { id: 3, name: 'Data Scientist', status: 'active', category: 'Analysis', expertise: ['Machine Learning', 'Data Visualization'], reputation: 4.8 },
  { id: 4, name: 'Smart Contract Auditor', status: 'active', category: 'Audit', expertise: ['Solidity', 'Security Analysis'], reputation: 4.9 },
  { id: 5, name: 'Tokenomics Expert', status: 'idle', category: 'DeFi', expertise: ['Token Design', 'Economic Modeling'], reputation: 4.3 },
  { id: 6, name: 'Sentiment Analyzer', status: 'active', category: 'Social', expertise: ['NLP', 'Trend Analysis'], reputation: 4.1 },
  { id: 7, name: 'Market Researcher', status: 'active', category: 'Analysis', expertise: ['Competitor Analysis', 'Market Trends'], reputation: 4.6 },
  { id: 8, name: 'Penetration Tester', status: 'idle', category: 'Audit', expertise: ['Vulnerability Assessment', 'Ethical Hacking'], reputation: 4.7 },
]

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([])

  useEffect(() => {
    const storedAgents = localStorage.getItem('ensemble-selected-agents')
    if (storedAgents) {
      setSelectedAgents(JSON.parse(storedAgents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ensemble-selected-agents', JSON.stringify(selectedAgents))
  }, [selectedAgents])

  const handleRegisterAgent = (newAgent: Omit<Agent, 'id'>) => {
    const agentWithId: Agent = {
      ...newAgent,
      id: Date.now()
    }
    setAgents([...agents, agentWithId])
  }

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgents(prev => {
      const isAlreadySelected = prev.some(a => a.id === agent.id)
      if (isAlreadySelected) {
        return prev.filter(a => a.id !== agent.id)
      } else {
        return [...prev, agent]
      }
    })
  }

  const categories: Agent['category'][] = ['DeFi', 'Social', 'Analysis', 'Audit']

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Marketplace</h1>
        <Button onClick={() => setIsRegistrationOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Register Agent
        </Button>
      </div>
      
      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category} Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents
              .filter((agent) => agent.category === category)
              .map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onSelect={handleSelectAgent}
                  isSelected={selectedAgents.some(a => a.id === agent.id)}
                />
              ))}
          </div>
        </div>
      ))}

      <AgentRegistrationDialog
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onRegister={handleRegisterAgent}
      />
    </div>
  )
}

