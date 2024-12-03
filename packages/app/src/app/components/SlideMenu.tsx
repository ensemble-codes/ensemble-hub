'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function SlideMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      <button
        onClick={toggleMenu}
        className="p-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <button
            onClick={toggleMenu}
            className="p-2 text-white focus:outline-none focus:ring-2 focus:ring-white mb-4"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          <nav>
            <ul className="space-y-4">
              <li>
                <a href="#tools" className="block py-2 hover:text-gray-300">
                  Tools
                </a>
              </li>
              <li>
                <a href="#agents" className="block py-2 hover:text-gray-300">
                  Agents
                </a>
              </li>
              <li>
                <a href="#control-center" className="block py-2 hover:text-gray-300">
                  Control Center
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  )
}

