'use client'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import UserController from './user-controller'

const Navbar = () => {

    const router = useRouter()
  return (
    <div className='sticky top-0 z-10 bg-background flex items-center justify-between p-4 border-b'>
      <h1 onClick={() => router.push('/')} className='cursor-pointer'>
        Dovia
      </h1>
     <div className='flex items-center gap-2'>
      <SignedOut>
        <SignInButton>
            <Button variant='outline'>
                Sign in
            </Button>
        </SignInButton>
        <SignUpButton>
            <Button>
                Sign up
            </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserController showName={true} />
      </SignedIn>
      </div>
    </div>
  )
}

export default Navbar