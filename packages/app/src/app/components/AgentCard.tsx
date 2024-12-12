import { Agent } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Star, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface AgentCardProps {
  agent: Agent
  onSelect: (agent: Agent) => void
  isSelected: boolean
}

export default function AgentCard({ agent, onSelect, isSelected }: AgentCardProps) {
  return (
    <Card className="w-full relative">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
          {agent.avatar ? (
            <img
              src={agent.avatar}
              alt={agent.name}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <User className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{agent.name}</CardTitle>
          <p className={`text-sm ${agent.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
            {agent.status}
          </p>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 mr-1" />
          <span className="text-sm font-medium">{agent.reputation.toFixed(1)}</span>
        </div>
      </CardHeader>
      <CardContent>
        {agent.expertise && agent.expertise.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {agent.expertise.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-2 right-2 ${isSelected ? 'text-blue-500' : 'text-gray-500'}`}
        onClick={() => onSelect(agent)}
      >
        <Plus className="h-5 w-5" />
      </Button>
    </Card>
  )
}

