import { useEffect, useState } from 'react'
import Image from 'next/image'

import ensembleSmall from '@/assets/ensemble-small.svg'
import horizontalLine from '@/assets/horizontal-line.svg'
import hexagon from '@/assets/hexagon.svg'
import loading from '@/assets/loading.svg'
import checkRed from '@/assets/check-red.svg'
import microphone from '@/assets/microphone.svg'
import send from '@/assets/send.svg'
import bolt from '@/assets/bolt.svg'

const styles = {
  borderImageSource: 'linear-gradient(91.95deg, rgba(255, 255, 255, 0.4) -4.26%, rgba(255, 255, 255, 0) 107.52%)',
  boxShadow: '5px 5px 10px 0px #D9D9D9 inset, -5px -5px 10px 0px #E7EBF0 inset',
}

const assignButtonStyles = {
  borderImageSource: 'linear-gradient(91.57deg, rgba(255, 255, 255, 0.4) -4.29%, rgba(255, 255, 255, 0) 110.62%)',
  boxShadow: '5px 5px 10px 0px #FE46003D, -5px -5px 10px 0px #FAFBFFAD',
}

export default function Chat() {
  const [isTaskCreated, setIsTaskCreated] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsTaskCreated(true)
    }, 1000)
  }, [])

  return (
    <div
      style={styles}
      className="grow bg-background rounded-2.5xl pt-10 px-4 pb-4 flex flex-col justify-between"
    >
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
        <div className='flex flex-col gap-4 border border-primary-foreground rounded-lg p-4 max-w-80'>
          <div className='flex justify-between items-center'>
            <p className='text-primary font-bold'>
              DeFi
            </p>
            <span className='bg-electric-purple/25 rounded-full px-5 py-2 text-sm leading-none text-electric-purple font-bold'>
              SOL
            </span>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 border border-primary-foreground rounded-full'></div>
              <p className='text-sm text-primary-foreground'>
                Swap SOL to USDC worth $500
              </p>
            </div>
          </div>
          <Image src={horizontalLine} alt="" width={243} height={1} />
          <button style={assignButtonStyles} className='bg-primary rounded-full p-4 hover:opacity-70 flex justify-center items-center gap-2'>
            <Image src={bolt} alt="bolt" width={24} height={24} />
            <p className='font-bold text-white'>
              Assign Agent
            </p>
          </button>
        </div>
      </div>
      <div className='flex justify-between items-center gap-3'>
        <div className='w-full flex justify-between items-center gap-4 border border-primary-foreground rounded-lg py-3 pl-6 pr-3'>
          <input
            type="text"
            placeholder='ask anything...'
            className='grow outline-none'
          />
          <button className='hover:opacity-70'>
            <Image src={microphone} alt="microphone" width={24} height={24} />
          </button>
        </div>
        <button className='bg-primary rounded-lg p-3 hover:opacity-70'>
          <Image src={send} alt="send" width={24} height={24} />
        </button>
      </div>
    </div>
  )
}
