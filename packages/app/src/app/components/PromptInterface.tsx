'use client'

import { useState } from 'react'
import TaskDialog from './TaskDialog'

interface PromptInterfaceProps {
  onSubmit: (prompt: string, taskType: string) => void
}

export default function PromptInterface({ onSubmit, initialDescription }: PromptInterfaceProps) {
  const [prompt, setPrompt] = useState(initialDescription)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      setIsDialogOpen(true)
    }
  }

  const handleConfirm = (taskType: string) => {
    onSubmit(prompt, taskType)
    setPrompt('')
    setIsDialogOpen(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white border-t p-4 h-20">
        <div className="flex items-center h-full">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your task prompt..."
            className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-full"
          >
            Submit
          </button>
        </div>
      </form>
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirm}
        initialDescription={prompt}
      />
    </>
  )
}

