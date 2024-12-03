import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="hover:text-gray-300">
            Tasks
          </Link>
        </li>
        <li>
          <Link href="/agents" className="hover:text-gray-300">
            Agents
          </Link>
        </li>
      </ul>
    </nav>
  )
}

