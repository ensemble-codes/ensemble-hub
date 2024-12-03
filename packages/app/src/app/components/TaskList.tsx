import { Task } from '../types'

interface TaskListProps {
  tasks: Task[]
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="flex-grow overflow-auto mb-4">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`p-4 rounded-lg shadow ${
              task.status === 'pending'
                ? 'bg-gray-200'
                : task.status === 'executing'
                ? 'bg-blue-100'
                : task.status === 'done'
                ? 'bg-green-100'
                : 'bg-red-100'
            }`}
          >
            <p className="font-medium">{task.prompt}</p>
            <p className="text-sm text-gray-600">
              Status: {task.status} | Created: {task.createdAt.toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

