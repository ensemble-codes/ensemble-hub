import '../../global.css'
import localFont from 'next/font/local'
import Image from 'next/image'

import ensemble from '@/assets/ensemble.svg'

const satoshi = localFont({
  src: './Satoshi-Variable.woff2',
  display: 'swap',
  variable: '--font-satoshi',
})

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
      <body className={`${satoshi.className} flex flex-col gap-6 h-full max-w-screen-xl mx-auto px-4 py-8 bg-[url('/background.svg')] bg-center bg-no-repeat`}>
        <header>
          <Image
            src={ensemble}
            alt="Ensemble Logo"
            width={56}
            height={56}
          />
        </header>
        <main className="flex-grow overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  )
}

