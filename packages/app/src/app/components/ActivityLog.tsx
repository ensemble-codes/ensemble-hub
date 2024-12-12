import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityLogEntry {
  id: number
  message: string
  timestamp: Date
}

interface ActivityLogProps {
  entries: ActivityLogEntry[]
}

export default function ActivityLog({ entries }: ActivityLogProps) {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.id} className="text-sm">
                <span className="font-medium text-gray-500">
                  {entry.timestamp.toLocaleTimeString()}: 
                </span>{" "}
                {entry.message}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

