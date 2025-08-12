import { Card } from '@/components/ui/card'
import React from 'react'

const UserMessage = ({content} : {content : string}) => {
  return (
<div className='flex justify-end pb-4 pr-2 pl-10'>
<Card className='bg-muted max-w-[80%] p-2 px-3 rounded-lg shadow-md border-none'>
        {content}
    </Card>
</div>
    
  )
}

export default UserMessage