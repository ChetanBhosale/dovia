import React from 'react'
import { DotPattern } from '@/components/magicui/dot-pattern'
import { cn } from '@/lib/utils'

const Background = () => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none">
      <DotPattern
        glow={true}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
        )}
      />
    </div>  
  )
}

export default Background