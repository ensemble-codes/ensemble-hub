'use client'

import { useState } from 'react'
import { Tool } from '../types'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CreateToolWidget from '../components/CreateToolWidget'

const initialTools: { category: string; items: Tool[] }[] = [
  {
    category: "DeFi",
    items: [
      { id: 1, name: "Yield Optimizer", description: "Maximize returns across DeFi protocols" },
      { id: 2, name: "Liquidity Pool Scanner", description: "Analyze and compare liquidity pools" },
      { id: 3, name: "Smart Contract Auditor", description: "Automated security checks for smart contracts" },
      { id: 4, name: "Gas Fee Estimator", description: "Predict and optimize transaction costs" },
    ]
  },
  {
    category: "Data Access",
    items: [
      { id: 5, name: "On-Chain Data Aggregator", description: "Collect and analyze blockchain data" },
      { id: 6, name: "API Integration Hub", description: "Connect to multiple data sources seamlessly" },
      { id: 7, name: "Real-Time Market Data Feed", description: "Stream live cryptocurrency market data" },
      { id: 8, name: "Historical Data Archive", description: "Access and query historical blockchain data" },
    ]
  },
  {
    category: "Social",
    items: [
      { id: 9, name: "Sentiment Analyzer", description: "Gauge community sentiment from social media" },
      { id: 10, name: "Influencer Tracker", description: "Monitor key opinion leaders in the crypto space" },
      { id: 11, name: "Community Engagement Tool", description: "Boost interaction in crypto communities" },
      { id: 12, name: "Trend Predictor", description: "Forecast upcoming trends based on social signals" },
    ]
  },
  {
    category: "Privacy",
    items: [
      { id: 13, name: "Zero-Knowledge Proof Generator", description: "Create privacy-preserving transactions" },
      { id: 14, name: "Mixer Integration", description: "Enhance transaction privacy through mixing services" },
      { id: 15, name: "Encrypted Messaging System", description: "Secure communication for sensitive data" },
      { id: 16, name: "Privacy Score Calculator", description: "Assess the privacy level of wallets and transactions" },
    ]
  },
]

export default function Tools() {
  const [tools, setTools] = useState(initialTools)
  const [isCreateToolOpen, setIsCreateToolOpen] = useState(false)

  const handleCreateTool = (toolData: { name: string; description: string; workflow: any }) => {
    const newTool: Tool = {
      id: Date.now(),
      name: toolData.name,
      description: toolData.description,
    }

    setTools(prevTools => {
      const customCategoryIndex = prevTools.findIndex(category => category.category === "Custom")
      if (customCategoryIndex !== -1) {
        const updatedTools = [...prevTools]
        updatedTools[customCategoryIndex].items.push(newTool)
        return updatedTools
      } else {
        return [...prevTools, { category: "Custom", items: [newTool] }]
      }
    })
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tools</h1>
        <Button onClick={() => setIsCreateToolOpen(true)}>Create Tool</Button>
      </div>
      <div className="space-y-8">
        {tools.map((category) => (
          <div key={category.category}>
            <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((tool) => (
                <Card key={tool.id}>
                  <CardHeader>
                    <CardTitle>{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      <CreateToolWidget
        isOpen={isCreateToolOpen}
        onClose={() => setIsCreateToolOpen(false)}
        onSubmit={handleCreateTool}
      />
    </div>
  )
}

