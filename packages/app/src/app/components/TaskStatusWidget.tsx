import { Task } from '../types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TaskStatusWidgetProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export default function TaskStatusWidget({ task, isOpen, onClose }: TaskStatusWidgetProps) {
  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Task Status</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Prompt:</span>
            <span className="col-span-3">{task.prompt}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Type:</span>
            <span className="col-span-3">
              <Badge variant="secondary">{task.taskType}</Badge>
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Status:</span>
            <span className="col-span-3">
              <Badge
                variant={
                  task.status === 'completed' ? 'default' :
                  task.status === 'assigned' ? 'outline' :
                  task.status === 'pending' ? 'secondary' : 'destructive'
                }
              >
                {task.status}
              </Badge>
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Created:</span>
            <span className="col-span-3">{task.createdAt.toLocaleString()}</span>
          </div>
          {task.response && (
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="text-sm font-medium">Response:</span>
              <ScrollArea className="col-span-3 h-[100px] rounded-md border p-2">
                <p className="text-sm">{task.response}</p>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

