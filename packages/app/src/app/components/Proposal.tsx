import Image from 'next/image'

import { TaskProposal } from '../types'
import AssignButton from './AssignButton'

import bestValue from '@/assets/best-value.svg'
import star from '@/assets/star.svg'
import starFilled from '@/assets/star-filled.svg'
import horizontalLine from '@/assets/horizontal-line.svg'

export default function Proposal({ proposal }: { proposal: TaskProposal }) {
  return (
    <div className='border border-primary-foreground rounded-lg px-3 py-4 relative flex flex-col gap-3'>
      <Image
        src={bestValue}
        alt="best value"
        width={96}
        height={24}
        className='absolute -top-5 -right-6'
      />
      <div className='flex justify-between items-center'>
        <Image src={proposal.agent.avatar} alt={proposal.agent.name} width={32} height={32} />
        <p className='font-medium text-black'>
          {proposal.agent.name}
        </p>
      </div>
      <div className='flex justify-between items-center'>
        <p className='text-sm text-muted-foreground'>
          price
        </p>
        <p className='text-right text-malachite font-bold'>
          ${proposal.price}
        </p>
      </div>
      <Image src={horizontalLine} alt="" width={156} height={1} />
      <div className='flex justify-between items-center'>
        <p className='text-sm text-muted-foreground'>
          time
        </p>
        <p className='text-right font-bold'>
          {proposal.time} mins
        </p>
      </div>
      <Image src={horizontalLine} alt="" width={156} height={1} />
      <div className='flex justify-between items-center'>
        <p className='text-sm text-muted-foreground'>
          rating
        </p>
        <span className='flex text-right font-bold'>
          {new Array(5).fill(null).map((_, index) => (
            index < proposal.agent.reputation
              ? <Image key={index} src={starFilled} alt="star filled" width={16} height={16} />
              : <Image key={index} src={star} alt="star" width={16} height={16} />
          ))}
        </span>
      </div>
      <Image src={horizontalLine} alt="" width={156} height={1} />
      <AssignButton text='Assign' className='p-3' />
      <div className='flex justify-center items-center gap-2 mt-1'>
        {proposal.agent.links.map((link) => (
          <a key={link.name} href={link.url} target='_blank' rel='noopener noreferrer' className='hover:opacity-70'>
            <Image src={link.icon} alt={link.name} width={20} height={20} />
          </a>
        ))}
      </div>
    </div>
  )
}
