import { Fragment, MessageRole, MessageType } from '@/generated/prisma'
import React from 'react'
import UserMessage from './UserMessage'
import AssistantMessage from './AssistantMessage'

const MessageCard = ({
    content,
    role,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type
} : {
    content: string
    role: string
    fragment: Fragment | null
    createdAt: Date
    isActiveFragment: boolean
    onFragmentClick: (fragment : Fragment) => void
    type: string
}) => {
  
    if(role === MessageRole.ASSISTANT){
        return (
            <AssistantMessage 
                content={content} 
                fragment={fragment}
                createdAt={createdAt}
                isActiveFragment={isActiveFragment}
                onFragmentClick={onFragmentClick}
                type={type}
            />
        )
    }

    if(role === MessageRole.USER){
        return (
            <UserMessage content={content} />
        )
    }
}

export default MessageCard