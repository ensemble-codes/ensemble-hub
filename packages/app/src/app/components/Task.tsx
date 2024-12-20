import Image from 'next/image'

import AssignButton from './AssignButton'
import { Task as TaskType } from '../types'

import horizontalLine from '@/assets/horizontal-line.svg'

interface TaskProps {
  task: TaskType
  isButton?: boolean
  onClick?: () => void
}

export default function Task({ task, isButton = false, onClick }: TaskProps) {
  return (
    <div className='flex flex-col gap-4 border border-primary-foreground rounded-lg p-4 max-w-80'>
      <div className='flex justify-between items-center'>
        <p className='text-primary font-bold'>
          {task.taskType}
        </p>
        <span className='bg-electric-purple/25 rounded-full px-5 py-2 text-sm leading-none text-electric-purple font-bold'>
          SOL
        </span>
      </div>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 border border-primary-foreground rounded-full'></div>
          <p className='text-sm text-primary-foreground'>
            {task.prompt}
          </p>
        </div>
      </div>
      {isButton && (
        <>
          <Image src={horizontalLine} alt="" width={243} height={1} />
          <AssignButton text='Assign Agent' onClick={onClick} />
        </>
      )}
    </div>
  )
}
