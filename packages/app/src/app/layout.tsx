import '../../global.css'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'
import PrivyWrapper from './components/PrivyWrapper'
import LoginButton from './components/LoginButton'

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
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col h-full`}>
          <PrivyWrapper>
          <header className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-2 flex flex-col items-center">
              <h1 className="text-2xl font-bold mb-2">Ensemble</h1>
              <Navigation />
              <LoginButton /> 
            </div>
          </header>
          <main className="flex-grow bg-gray-100 overflow-hidden">
            {children}
          </main>
        </PrivyWrapper>
      </body>
    </html>
  )
}

