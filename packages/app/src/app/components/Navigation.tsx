import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-center space-x-6">
        <li>
          <Link href="/" className="hover:text-gray-300">
            Tasks
          </Link>
        </li>
        <li>
          <Link href="/tools" className="hover:text-gray-300">
            Tools
          </Link>
        </li>
        <li>
          <Link href="/agents" className="hover:text-gray-300">
            Agents
          </Link>
        </li>
        <li>
          <Link href="/workflows" className="hover:text-gray-300">
            Workflows
          </Link>
        </li>
        <li>
          <Link href="/docs" className="hover:text-gray-300">
            Docs
          </Link>
        </li>
        <li>
          <Link href="/litepaper" className="hover:text-gray-300">
            Litepaper
          </Link>
        </li>
      </ul>
    </nav>
  )
}

