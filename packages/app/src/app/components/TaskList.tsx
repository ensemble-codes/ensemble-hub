import { Task } from '../types'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface TaskListProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export default function TaskList({ tasks, onTaskClick }: TaskListProps) {
  return (
    <div className="h-full p-4">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`p-4 rounded-lg shadow cursor-pointer transition-colors duration-200 hover:bg-gray-100 ${
                task.status === 'pending'
                  ? 'bg-gray-200'
                  : task.status === 'executing'
                  ? 'bg-blue-100'
                  : task.status === 'assigned'
                  ? 'bg-purple-100'
                  : task.status === 'completed'
                  ? 'bg-green-100'
                  : task.status === 'done'
                  ? 'bg-green-200'
                  : 'bg-red-100'
              }`}
              onClick={() => onTaskClick(task)}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">{task.prompt}</p>
                <Badge variant="secondary">{task.taskType}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Status: {task.status} | Created: {task.createdAt.toLocaleString()}
              </p>
              {task.status === 'completed' && task.response && (
                <div className="mt-2">
                  <p className="text-sm font-semibold">Response:</p>
                  <ScrollArea className="h-20 mt-1">
                    <p className="text-sm text-gray-700">{task.response}</p>
                  </ScrollArea>
                </div>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}

