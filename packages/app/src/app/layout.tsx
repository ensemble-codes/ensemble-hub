import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ensemble - Agentic Framework',
  description: 'On-chain AI agent coordination platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-gray-800 text-white p-4">
            <h1 className="text-2xl font-bold">Ensemble</h1>
          </header>
          <main className="flex-grow bg-gray-100">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

