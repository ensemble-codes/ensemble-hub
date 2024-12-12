'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface TaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (taskType: string, description: string) => void
  initialDescription: string
}

export default function TaskDialog({ isOpen, onClose, onConfirm, initialDescription }: TaskDialogProps) {
  const [taskType, setTaskType] = useState<string>('')
//  const [description, setDescription] = useState(initialDescription)

  const handleConfirm = () => {
    onConfirm(taskType, initialDescription)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-type">Task Type</Label>
            <Select value={taskType} onValueChange={setTaskType}>
              <SelectTrigger id="task-type">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="socials">Socials</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
                <SelectItem value="defi">DeFi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              {initialDescription}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!taskType}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

