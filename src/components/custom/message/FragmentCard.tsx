import { Fragment } from '@/generated/prisma'
import { cn } from '@/lib/utils'
import { CodeIcon } from 'lucide-react'
import React from 'react'

interface FragmentCardProps {
    fragment : Fragment | null
    isActiveFragment : boolean
    onFragmentClick : (fragment : Fragment) => void
}

const FragmentCard = ({fragment,isActiveFragment,onFragmentClick} : FragmentCardProps) => {
  return (
    <button 
      onClick={() => fragment && onFragmentClick(fragment)}
      className={cn(
        "group relative bg-background w-fit flex items-center gap-3 p-3 rounded-xl border border-border hover:border-border/80 transition-all duration-200 hover:shadow-md hover:shadow-muted/20",
        isActiveFragment && "bg-primary/10 border-primary shadow-md shadow-primary/20"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg bg-muted transition-colors duration-200",
        isActiveFragment && "bg-primary/20"
      )}>
        <CodeIcon className='w-4 h-4 text-muted-foreground' />
      </div>
      <div className='flex flex-col items-start'>
        <span className={cn(
          'text-sm font-medium text-foreground transition-colors duration-200',
          isActiveFragment && 'text-primary'
        )}>
          Code
        </span>
        <span className={cn(
          'text-xs text-muted-foreground transition-colors duration-200',
          isActiveFragment && 'text-primary/80'
        )}>
          Preview
        </span>
      </div>
    </button>
  )
}

export default FragmentCard