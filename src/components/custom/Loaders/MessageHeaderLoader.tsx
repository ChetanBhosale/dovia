import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const MessageHeaderLoader = () => {
  return (
    <div className='w-full flex'>
        <div className='flex gap-2'>
            <Skeleton className='w-10 h-10 rounded-full' />
            <Skeleton className='w-10 h-10 rounded-full' />
        </div>
        <div className='flex gap-2'>
            <Skeleton className='w-10 h-10 rounded-full' />
            <Skeleton className='w-10 h-10 rounded-full' />
        </div>
    </div>
  )
}

export default MessageHeaderLoader