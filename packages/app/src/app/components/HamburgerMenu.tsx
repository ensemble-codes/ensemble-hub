'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="p-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <a
            href="#settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </a>
          <a
            href="#tools"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Tools
          </a>
          <a
            href="#agents"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Agents
          </a>
        </div>
      )}
    </div>
  )
}

