import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const MessageLoader = () => {



  return (
    <div className='flex flex-col gap-2 '>
        {Array.from({length : 10}).map((_,index) => (
            <div key={index} className={`flex items-center gap-2 my-3 mx-3 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <Skeleton className={`w-1/2 h-4 ${index % 2 === 0 ? 'h-10' : 'h-16'}`}/>
            </div>
        ))}
    </div>
  )
}

export default MessageLoader