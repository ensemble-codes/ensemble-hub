'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import yaml from 'js-yaml'
import { Input } from "@/components/ui/input"

interface CreateToolWidgetProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (tool: { name: string; description: string; workflow: any }) => void
}

export default function CreateToolWidget({ isOpen, onClose, onSubmit }: CreateToolWidgetProps) {
  const [yamlInput, setYamlInput] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Tool name is required.')
      return
    }
    try {
      const parsedYaml = yaml.load(yamlInput)
      onSubmit({ name, description, workflow: parsedYaml })
      setName('')
      setDescription('')
      setYamlInput('')
      setError(null)
      onClose()
    } catch (e) {
      setError('Invalid YAML. Please check your input.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create On-Chain Workflow Tool</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tool-name">Tool Name:</Label>
            <Input
              id="tool-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tool name..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tool-description">Tool Description:</Label>
            <Textarea
              id="tool-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter tool description..."
              className="h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="yaml-input">Enter YAML Workflow:</Label>
            <Textarea
              id="yaml-input"
              value={yamlInput}
              onChange={(e) => setYamlInput(e.target.value)}
              placeholder="Enter your YAML workflow here..."
              className="h-[200px]"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Tool</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

