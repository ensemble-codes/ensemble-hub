'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface WorkflowPromptInterfaceProps {
  onSubmit: (name: string, description: string) => void
}

export default function WorkflowPromptInterface({ onSubmit }: WorkflowPromptInterfaceProps) {
  const [prompt, setPrompt] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      setWorkflowName(prompt)
      setWorkflowDescription('')
      setIsDialogOpen(true)
    }
  }

  const handleConfirm = () => {
    onSubmit(workflowName, workflowDescription)
    setPrompt('')
    setWorkflowName('')
    setWorkflowDescription('')
    setIsDialogOpen(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white border-t p-4 h-20">
        <div className="flex items-center h-full">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your workflow name..."
            className="flex-grow mr-2"
          />
          <Button type="submit">
            Create Workflow
          </Button>
        </div>
      </form>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input
                id="workflow-name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workflow-description">Description</Label>
              <Input
                id="workflow-description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirm}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

