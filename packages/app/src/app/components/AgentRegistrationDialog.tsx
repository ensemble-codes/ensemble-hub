'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Agent } from '../types'
import { X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface AgentRegistrationDialogProps {
  isOpen: boolean
  onClose: () => void
  onRegister: (agent: Omit<Agent, 'id'>) => void
}

export default function AgentRegistrationDialog({
  isOpen,
  onClose,
  onRegister
}: AgentRegistrationDialogProps) {
  const [name, setName] = useState('')
  const [expertise, setExpertise] = useState('')
  const [expertiseList, setExpertiseList] = useState<string[]>([])
  const [avatar, setAvatar] = useState('')
  const [category, setCategory] = useState<Agent['category']>('DeFi')
  const [reputation, setReputation] = useState(3)

  const handleAddExpertise = () => {
    if (expertise.trim() && !expertiseList.includes(expertise.trim())) {
      setExpertiseList([...expertiseList, expertise.trim()])
      setExpertise('')
    }
  }

  const handleRemoveExpertise = (skill: string) => {
    setExpertiseList(expertiseList.filter(e => e !== skill))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onRegister({
        name: name.trim(),
        status: 'idle',
        expertise: expertiseList,
        avatar,
        category,
        reputation
      })
      setName('')
      setExpertise('')
      setExpertiseList([])
      setAvatar('')
      setCategory('DeFi')
      setReputation(3)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Register New Agent</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter agent name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: Agent['category']) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DeFi">DeFi</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Analysis">Analysis</SelectItem>
                <SelectItem value="Audit">Audit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL (optional)</Label>
            <Input
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Enter avatar URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertise">Expertise</Label>
            <div className="flex gap-2">
              <Input
                id="expertise"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="Add expertise"
              />
              <Button type="button" onClick={handleAddExpertise}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {expertiseList.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveExpertise(skill)}
                >
                  {skill} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reputation">Initial Reputation</Label>
            <div className="flex items-center space-x-4">
              <Slider
                id="reputation"
                min={0}
                max={5}
                step={0.1}
                value={[reputation]}
                onValueChange={(value) => setReputation(value[0])}
                className="flex-1"
              />
              <span className="font-medium">{reputation.toFixed(1)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Register Agent</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

