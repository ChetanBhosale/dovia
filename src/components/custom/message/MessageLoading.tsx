import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const MessageLoading = () => {
  const messages = [
    "Generating code...",
    "Thinking about code...",
    "Analyzing code...",
    "Processing code...",
    "Creating code...",    
  ]

  const [currentMessage,setCurrentMessage] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentMessage((prev:number) => (prev + 1) % messages.length)
    },2000)

    return () => clearInterval(interval)
  },[])

  return (
    <div className='flex flex-col group px-2 pb-4'>
    <div className='flex items-center gap-2 pl-8.5'>
        <span className='text-base text-muted-foreground animate-pulse  '>{messages[currentMessage]}</span>
        <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
    </div>
    </div>
  )
}

export default MessageLoading