import { Tool } from '../types'

const tools: Tool[] = [
  { id: 1, name: 'Data Analysis', description: 'Analyze complex datasets' },
  { id: 2, name: 'Text Generation', description: 'Generate human-like text' },
  { id: 3, name: 'Image Recognition', description: 'Identify objects in images' },
]

export default function Tools() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div key={tool.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
            <p className="text-gray-600">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

