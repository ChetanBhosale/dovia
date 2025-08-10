'use client'

import { useGetMessages } from '@/app/api/service/message'
import React, { useEffect, useRef } from 'react'
import MessageCard from '../message/MessageCard'
import { Fragment } from '@/generated/prisma'
import MessageForm from '../message/MessageForm'

interface Props {
    projectId : string
}

const MessageView = ({projectId} : Props) => {
 const bottomRef = useRef<HTMLDivElement>(null)
 const {data,isLoading} = useGetMessages(projectId)
 useEffect(() => {
    console.log({data})
    if(data && data.length > 0){
        bottomRef.current?.scrollIntoView()
    }
 },[data?.length])

  return (
    <div className='flex flex-col flex-1 h-full'>
        <div className='flex-1 min-h-0 overflow-y-auto'>
            <div className='pt-2 pr-1'>
            {isLoading && <div>Loading...</div>}
            {data && data.map((message,index) => (
                <MessageCard 
                    key={index}
                    content={message.content}
                    role={message.role}
                    fragment={message.fragment }
                    createdAt={message.createdAt}
                    isActiveFragment={message.fragment?.id === message.id}
                    onFragmentClick={(fragment : Fragment) => {}}
                    type={message.type}
                />
            ))}
            <div ref={bottomRef} />
            </div>
        </div>
        <div className='p-3 pt-1 relative'>
                <div className='absolute -top-6 left-0 right-0 h-8 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none' />
                <MessageForm projectId={projectId} />
        </div>
    </div>
  )
}

export default MessageView