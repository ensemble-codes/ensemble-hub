import { useEffect, useState } from 'react'
import Image from 'next/image'

import ensembleSmall from '@/assets/ensemble-small.svg'
import horizontalLine from '@/assets/horizontal-line.svg'
import hexagon from '@/assets/hexagon.svg'
import loading from '@/assets/loading.svg'
import checkRed from '@/assets/check-red.svg'
import microphone from '@/assets/microphone.svg'

const styles = {
  borderImageSource: 'linear-gradient(91.95deg, rgba(255, 255, 255, 0.4) -4.26%, rgba(255, 255, 255, 0) 107.52%)',
  boxShadow: '5px 5px 10px 0px #D9D9D9 inset, -5px -5px 10px 0px #E7EBF0 inset',
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
      </div>
      <div className='flex justify-between items-center gap-4 border border-primary-foreground rounded-lg py-3 pl-6 pr-3'>
        <input
          type="text"
          placeholder='ask anything...'
          className='grow outline-none'
        />
        <button className='hover:opacity-70'>
          <Image src={microphone} alt="microphone" width={24} height={24} />
        </button>
      </div>
    </div>
  )
}
