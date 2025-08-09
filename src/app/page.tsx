'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useCreateProject } from './api/service/project'
import { useRouter } from 'next/navigation'

const page = () => {

  const router = useRouter()
  const [prompt,setPrompt] = useState("")
  const createProject = useCreateProject()
  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div className='w-full max-w-md flex flex-col gap-4'>
        <h1 className='text-2xl font-bold'>Build your project with AI</h1>
        <Input placeholder='Enter your prompt' value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <Button onClick={() => {
          createProject.mutate(prompt, {
            onSuccess : (data) => {
              router.push(`/project/${data.id}`)
            }
          })
        }} disabled={createProject.isPending}>{createProject.isPending ? "Creating..." : "Create"}</Button>
      </div>
    </div>
  )
}

export default page