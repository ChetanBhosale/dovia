'use client'

import { useGetMessages } from '@/app/api/service/message'
import React, { useEffect, useRef } from 'react'
import MessageCard from '../message/MessageCard'
import { Fragment, MessageRole } from '@/generated/prisma'
import MessageForm from '../message/MessageForm'
import MessageLoading from '../message/MessageLoading'
import ProjectHeaderView from './ProjectHeaderView'
import MessageLoader from '../Loaders/MessageLoader'

interface Props {
    projectId : string
    setActiveFragment : (fragment : Fragment) => void
    activeFragment : Fragment | null
}

const MessageView = ({projectId,setActiveFragment,activeFragment} : Props) => {
 const bottomRef = useRef<HTMLDivElement>(null)
 const {data,isLoading,isError,error} = useGetMessages(projectId)
 useEffect(() => {
    if(data && data.length > 0){
        bottomRef.current?.scrollIntoView()
    }
 },[data?.length])

 const lastAssistantMessageRef = useRef<string | null>(null)

//  useEffect(() => {
//     if(Array.isArray(data) && data.length > 0){
//         let findLastMessageWithFragment = data.findLast((message) => message.fragment && message.role == MessageRole.ASSISTANT)
//         if(findLastMessageWithFragment && findLastMessageWithFragment.fragment){
//             setActiveFragment(findLastMessageWithFragment.fragment)
//         }
//     }
//  },[data])

useEffect(() => {
    const lastAssistantMessage = data?.findLast((message) => message.role == MessageRole.ASSISTANT && message.fragment)
    console.log({lastAssistantMessage})
    if(
        lastAssistantMessage?.fragment &&
        lastAssistantMessage?.id !== lastAssistantMessageRef.current
    ){
        setActiveFragment(lastAssistantMessage.fragment)
        lastAssistantMessageRef.current = lastAssistantMessage.id
    }
},[data])

 const lastMessage = data?.[data.length - 1]
 const isLastMessageUser = lastMessage?.role == MessageRole.USER


  return (
    <div className='flex flex-col flex-1 h-full'>
        <div className='flex-1 z-0'>
            <ProjectHeaderView projectId={projectId} />
            <div className='h-[calc(100vh-200px)] flex flex-col pt-3 overflow-y-auto'>
            {isLoading && <MessageLoader />}
            {data && data.map((message,index) => (
                <MessageCard 
                    key={index}
                    content={message.content}
                    role={message.role}
                    fragment={message.fragment }
                    createdAt={message.createdAt}
                    isActiveFragment={message.fragment?.id === activeFragment?.id}
                    onFragmentClick={(fragment : Fragment) => {
                        setActiveFragment(fragment)
                    }}
                    type={message.type}
                />
            ))}
            {isError && <div className='flex flex-col items-center justify-center h-full'>
              <p className='text-sm text-muted-foreground'>{error?.message || "Something went wrong please try again later!"}</p>
            </div>}
            {!isError && isLastMessageUser && <MessageLoading />}
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