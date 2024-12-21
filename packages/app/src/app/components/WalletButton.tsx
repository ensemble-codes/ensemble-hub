'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function CustomWalletButton() {
  return (
    <div className="absolute top-4 right-4">
      <WalletMultiButton/>
    </div>
  )
}