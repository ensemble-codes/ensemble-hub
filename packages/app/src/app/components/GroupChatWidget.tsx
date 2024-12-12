import { Agent } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface GroupChatWidgetProps {
  selectedAgents: Agent[]
  isActive: boolean
}

export default function GroupChatWidget({ selectedAgents, isActive }: GroupChatWidgetProps) {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Selected Agents</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-full">
          {selectedAgents.length === 0 ? (
            <p className="text-muted-foreground">No agents selected</p>
          ) : (
            <ul className="space-y-2">
              {selectedAgents.map((agent) => (
                <li key={agent.id} className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback>{agent.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">{agent.expertise?.join(', ')}</p>
                  </div>
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Active" : "Inactive"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

