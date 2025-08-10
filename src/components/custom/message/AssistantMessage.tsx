import { Fragment, MessageType } from '@/generated/prisma'
import { cn } from '@/lib/utils'
import { AirVent, Badge } from 'lucide-react'
import { format } from 'date-fns'
import React from 'react'
import FragmentCard from './FragmentCard'

interface AssistantMessageProps {
    content: string
    fragment: Fragment | null
    createdAt: Date
    isActiveFragment: boolean
    onFragmentClick: (fragment : Fragment) => void
    type: string
}

const AssistantMessage = ({
    content,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type
} : AssistantMessageProps) => {
  return (
    <div className={cn(("flex flex-col gap-2 group px-2 pb-4"),type === MessageType.ERROR && "text-red-700 hover:text-red-700")}>
        <div className='flex items-center gap-2 pl-2 mb-2'>
            <Badge className='text-red-300' />
            <span className='text-sm font-medium'>Dovia</span>
            <span className='text-xs text-muted-foreground'>{format(createdAt, 'MMM d, yyyy')}</span>
        </div>
        <div className='pl-8.5 flex flex-col gap-2'>
            <span>{content}</span>
            <FragmentCard fragment={fragment} isActiveFragment={isActiveFragment} onFragmentClick={onFragmentClick} />
        </div>
    </div>
  )
}

export default AssistantMessage