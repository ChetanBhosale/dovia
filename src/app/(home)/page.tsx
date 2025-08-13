'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useCreateProject } from '@/app/api/service/project'
import { useRouter } from 'next/navigation'
import { DotPattern } from '@/components/magicui/dot-pattern'
import { cn } from '@/lib/utils'
import Background from '@/components/custom/landing/background'
import { LineShadowText } from '@/components/magicui/line-shadow-text'
import { useTheme } from 'next-themes'
import MessageForm from '@/components/custom/message/MessageForm'
import MessageBox from '@/components/custom/landing/MessageBox'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import ProjectsSection from '@/components/custom/landing/ProjectsSection'

const page = () => {

  const { theme } = useTheme()
  
  return (
    <div className='w-full flex flex-col'>
      <Background />
      
      <div className='flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20'>
        <div className='flex flex-col items-center text-center  max-w-4xl mx-auto'>
          <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-none tracking-tighter sm:mb-6">
            Build
            <LineShadowText className="italic ml-2" shadowColor={theme === "white" ? "black" : "white"}>
              Fast
            </LineShadowText>
          </h1>
        </div>

        <div className='w-full max-w-2xl sm:max-w-3xl mx-auto mb-16 sm:mb-20 px-4'>
          <MessageBox />
        </div>
      </div>

      <SignedIn>
        <div className='w-full border-t border-border bg-muted/30'>
          <ProjectsSection />
        </div>
      </SignedIn>
    </div>
  )
}

export default page