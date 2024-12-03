'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, CheckCircle2, AlertCircle, User } from 'lucide-react'
import { TaskProposal } from '../types'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface TaskProposalDialogProps {
  isOpen: boolean
  onClose: () => void
  proposal: TaskProposal
  onAccept: (proposal: TaskProposal) => void
  onReject: (proposal: TaskProposal) => void
}

export default function TaskProposalDialog({
  isOpen,
  onClose,
  proposal,
  onAccept,
  onReject
}: TaskProposalDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAccept = async () => {
    setIsProcessing(true)
    try {
      await onAccept(proposal)
      onClose()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    setIsProcessing(true)
    try {
      await onReject(proposal)
      onClose()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Task Proposal</DialogTitle>
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
        
        <div className="space-y-6 py-4">
          {/* Agent Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {proposal.agent.avatar ? (
                    <img
                      src={proposal.agent.avatar}
                      alt={proposal.agent.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{proposal.agent.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {proposal.agent.expertise?.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    ${proposal.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Fixed Price
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Details */}
          <div className="space-y-2">
            <h4 className="font-medium">Task Details</h4>
            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">{proposal.task.prompt}</p>
                <Badge>{proposal.task.taskType}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Created: {proposal.task.createdAt.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isProcessing}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isProcessing}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

