import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

import Task from './Task'
import { usePersistentTasks } from '../hooks/usePersistentTasks'

import ensembleSmall from '@/assets/ensemble-small.svg'
import horizontalLine from '@/assets/horizontal-line.svg'
import hexagon from '@/assets/hexagon.svg'
import loading from '@/assets/loading.svg'
import checkRed from '@/assets/check-red.svg'
import microphone from '@/assets/microphone.svg'
import send from '@/assets/send.svg'

type ChatProps = {
  setSelectedTab: (tab: number) => void
}

export default function Chat({ setSelectedTab }: ChatProps) {
  const [isTaskCreated, setIsTaskCreated] = useState(false)
  const { tasks, addTask } = usePersistentTasks()

  useEffect(() => {
      addTask('Swap SOL to USDC worth $500', 'DeFi')
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setIsTaskCreated(true)
    }, 1000)
  }, [])

  return (
    <>
      <div className="flex flex-col gap-4 h-[500px] overflow-y-auto">
        <div className="flex items-center gap-3">
          <Image src={ensembleSmall} alt="Ensemble" width={32} height={32} />
          <p className="text-lg">
            gm, how can I hep you today?
          </p>
        </div>
        <Image src={horizontalLine} alt="" width={243} height={1} />
        <div className="flex items-center gap-3">
          <Image src={hexagon} alt="Ensemble" width={32} height={32} />
          <p className="text-lg">
            I want you to swap some SOL to USDC
          </p>
        </div>
        {!isTaskCreated && (
          <div className="flex items-center gap-2">
            <Image src={loading} alt="Ensemble" width={24} height={24} className='animate-spin' style={{ animationDuration: '2000ms' }} />
            <p className="text-sm text-primary-foreground">
              Creating task
            </p>
          </div>
        )}
        {isTaskCreated && (
          <div className="flex items-center gap-2">
            <Image src={checkRed} alt="Ensemble" width={16} height={16} />
            <p className="text-sm text-primary-foreground">
              Task created
            </p>
          </div>
        )}
        {tasks.map((task) => (
          <Task key={task.id} isButton task={task} onClick={() => setSelectedTab(task.id)} />
        ))}
      </div>
      <form className='flex justify-between items-center gap-3'>
        <div className='w-full flex justify-between items-center gap-4 border border-primary-foreground rounded-lg py-3 pl-6 pr-3'>
          <input
            type="text"
            placeholder='ask anything...'
            className='grow outline-none'
          />
          <button type='button' className='hover:opacity-70'>
            <Image src={microphone} alt="microphone" width={24} height={24} />
          </button>
        </div>
        <button type='submit' className='bg-primary rounded-lg p-3 hover:opacity-70'>
          <Image src={send} alt="send" width={24} height={24} />
        </button>
      </form>
    </>
  )
}
