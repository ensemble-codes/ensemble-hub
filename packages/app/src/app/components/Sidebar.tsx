import { useState } from 'react'
import Image from 'next/image'

import { Tab } from '../types'
import { Online, ProgressCircle } from './Icons'
import { Menu, X } from 'lucide-react'

import agent from '@/assets/agent.png'
import pendingAgent from '@/assets/pending-agent.svg'
import clock from '@/assets/clock.svg'
import check from '@/assets/check.svg'
import { cn } from '@/lib/utils'

type SidebarProps = {
  selectedTab: Tab
  setSelectedTab: (tab: Tab) => void
}

type TabItem = {
  id: Tab
  name: string
  icon: (color: string) => JSX.Element
}

const selected = {
  nav: {
    borderImageSource: 'linear-gradient(91.57deg, rgba(255, 255, 255, 0.4) -4.29%, rgba(255, 255, 255, 0) 110.62%)',
    boxShadow: '5px 5px 10px 0px #FE460066 inset, -5px -5px 10px 0px #FAFBFFAD inset',
    iconColor: 'hsl(var(--malachite))',
    color: 'hsl(var(--primary))'
  },
  pending: {
    boxShadow: '5px 5px 10px 0px #FFC12166 inset, -5px -5px 10px 0px #FAFBFFAD inset'
  },
  active: {
    boxShadow: '5px 5px 10px 0px #FE460066 inset, -5px -5px 10px 0px #FAFBFFAD inset'
  }
}

const unselected = {
  nav: {
    borderImageSource: 'linear-gradient(91.57deg, rgba(255, 255, 255, 0.4) -4.29%, rgba(255, 255, 255, 0) 110.62%)',
    boxShadow: '5px 5px 10px 0px #D9D9D9, -5px -5px 10px 0px #FAFBFFAD',
    iconColor: 'hsl(var(--primary-foreground))',
    color: 'hsl(var(--primary-foreground))'
  }
}

const tabs: TabItem[] = [
  {
    id: Tab.Chat,
    name: 'Chat',
    icon: (color: string) => <Online color={color} />,
  },
]

const activeTasks = [
  {
    id: Tab.Defi1,
    name: 'DeFi',
    progress: 25,
    image: agent,
  }
]

const pendingTasks = [
  {
    id: Tab.Defi2,
    name: 'DeFi',
    image: pendingAgent,
  }
]

const completedTasks = [
  {
    id: Tab.Defi3,
    name: 'DeFi',
    image: agent,
  }
]

export default function Sidebar({ selectedTab, setSelectedTab }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <aside className='relative flex'>
      <div className={cn(
        "transition-all ease-in-out duration-300 absolute bg-background rounded-2.5xl pt-8 px-4 pb-4 shadow-lg w-52 flex flex-col gap-8 md:relative md:bg-transparent md:rounded-none md:p-0 md:shadow-none md:left-0",
        isSidebarOpen ? 'left-0' : '-left-52'
      )}>
        <section className="flex flex-col gap-4 max-h-56 pb-4 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className="min-h-14 rounded-full flex justify-start items-center gap-2 px-7 py-1 max-w-48 transition-all ease-in-out duration-300 hover:opacity-70"
              style={{
                borderImageSource: selectedTab === tab.id ? selected.nav.borderImageSource : unselected.nav.borderImageSource,
                boxShadow: selectedTab === tab.id ? selected.nav.boxShadow : unselected.nav.boxShadow,
                color: selectedTab === tab.id ? selected.nav.color : unselected.nav.color
              }}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.icon(selectedTab === tab.id ? selected.nav.iconColor : unselected.nav.iconColor)}
              {tab.name}
            </button>
          ))}
        </section>
        <section className='flex flex-col gap-3'>
          <p className='text-sm font-medium text-primary-foreground'>
            PENDING TASKS
          </p>
          <div className='flex flex-col gap-3 max-h-28 overflow-y-auto'>
            {pendingTasks.map((task) => (
              <button
                key={task.id}
                className='flex justify-between items-center gap-2 bg-background border border-primary-foreground p-1 max-w-48 rounded-full transition-all ease-in-out duration-300 hover:opacity-70'
                style={{
                  boxShadow: selectedTab === task.id ? selected.pending.boxShadow : 'none'
                }}
                onClick={() => setSelectedTab(task.id)}
              >
                <div className='flex items-center gap-2'>
                  <Image
                    src={task.image}
                    alt=""
                    width={40}
                    height={40}
                  />
                  <div className='flex flex-col items-start gap-0.5'>
                    <p className='text-primary-foreground font-medium'>
                      {task.name}
                    </p>
                    <p className='text-xs text-primary'>
                      assign agent
                    </p>
                  </div>
                </div>
                <Image
                  src={clock}
                  alt=""
                  width={24}
                  height={24}
                />
              </button>
            ))}
          </div>
        </section>
        <section className='flex flex-col gap-3'>
          <p className='text-sm font-medium text-primary-foreground'>
            ACTIVE TASKS
          </p>
          <div className='flex flex-col gap-3 max-h-28 overflow-y-auto'>
            {activeTasks.map((task) => (
              <button
                key={task.id}
                className='flex justify-between items-center gap-2 bg-background border border-primary-foreground p-1 max-w-48 rounded-full transition-all ease-in-out duration-300 hover:opacity-70'
                style={{
                  boxShadow: selectedTab === task.id ? selected.active.boxShadow : 'none'
                }}
                onClick={() => setSelectedTab(task.id)}
              >
                <div className='flex items-center gap-2'>
                  <Image
                    src={task.image}
                    alt=""
                    width={40}
                    height={40}
                  />
                  <p className='text-primary-foreground font-medium'>
                    {task.name}
                  </p>
                </div>
                <ProgressCircle progress={task.progress} />
              </button>
            ))}
          </div>
        </section>
        <section className='flex flex-col gap-3'>
          <p className='text-sm font-medium text-primary-foreground'>
            COMPLETED
          </p>
          <div className='flex flex-col gap-3 max-h-28 overflow-y-auto'>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className='flex justify-between items-center gap-2 bg-background border border-primary-foreground p-1 max-w-48 rounded-full opacity-40'
              >
                <div className='flex items-center gap-2'>
                  <Image
                    src={task.image}
                    alt=""
                    width={40}
                    height={40}
                  />
                  <p className='text-primary-foreground font-medium'>
                    {task.name}
                  </p>
                </div>
                <Image
                  src={check}
                  alt=""
                  width={32}
                  height={32}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
      <button
        className='absolute top-2 left-2 block md:hidden'
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>
    </aside>
  )
}
