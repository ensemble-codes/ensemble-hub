import { ButtonHTMLAttributes } from 'react'
import Image from 'next/image'

import bolt from '@/assets/bolt.svg'
import { cn } from '@/lib/utils'

const assignButtonStyles = {
  borderImageSource: 'linear-gradient(91.57deg, rgba(255, 255, 255, 0.4) -4.29%, rgba(255, 255, 255, 0) 110.62%)',
  boxShadow: '5px 5px 10px 0px #FE46003D, -5px -5px 10px 0px #FAFBFFAD',
}

type AssignButtonProps = {
  text?: string
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function AssignButton({ text = 'Assign', className, ...props }: AssignButtonProps) {
  return (
    <button
      style={assignButtonStyles}
      className={cn(
        'bg-primary rounded-full p-4 hover:opacity-70 flex justify-center items-center gap-2',
        className
      )}
      {...props}
    >
      <Image src={bolt} alt="bolt" width={24} height={24} />
      <p className='font-bold text-white'>
        {text}
      </p>
    </button>
  )
}
