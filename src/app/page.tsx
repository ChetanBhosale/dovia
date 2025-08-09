"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useCreateMessage, useGetMessages } from './api/service/message'
import { Message } from '@/generated/prisma'

const page = () => {

  const [prompt,setPrompt] = useState("")
  const message = useCreateMessage()
  const {data : messages, isLoading} = useGetMessages()
  return (
    <div>
      <h1>please enter your prompt</h1>
      <Input onChange={(e) => setPrompt(e.target.value)} type='text' placeholder='Enter your prompt' />
      <Button onClick={() => {
        message.mutate(prompt)
      }}>Send</Button>
      <div>
        {isLoading && <p>Loading...</p>}
        {messages?.map((message : Message) => (
          <div key={message.id}>{message.content}</div>
        ))}
      </div>
    </div>
  )
}

export default page