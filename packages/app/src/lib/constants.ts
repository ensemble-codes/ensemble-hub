import { Agent } from "@/app/types"

import avatar from '@/assets/avatar.png'
import telegram from '@/assets/telegram.svg'
import twitter from '@/assets/twitter.svg'
import dextools from '@/assets/dextools.svg'

export const defiAgent: Agent = {
  id: 1,
  name: 'DeFi',
  avatar: avatar.src,
  status: 'active',
  expertise: ['DeFi'],
  category: 'DeFi',
  reputation: 4,
  links: [
    { name: 'Telegram', url: 'https://telegram.org', icon: telegram },
    { name: 'Twitter', url: 'https://twitter.com', icon: twitter },
    { name: 'Dextools', url: 'https://www.dextools.io', icon: dextools },
  ],
}
