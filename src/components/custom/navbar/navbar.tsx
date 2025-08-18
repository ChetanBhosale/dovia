'use client'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import UserController from './user-controller'
import { Logo } from './logo'
import Link from 'next/link'

const Navbar = () => {
    const router = useRouter()
    const links = [
      {
        label: 'Github',
        href: 'https://github.com/ChetanBhosale'
      },
      {
        label: 'Hire Me',
        href: 'https://chetan-bhosale.vercel.app'
      }
    ]
  return (
    <div className='flex w-full py-4 items-center justify-between z-50 bg-background/80 backdrop-blur-sm md:px-40 px-4'>
      <h1 onClick={() => router.push('/')} className='cursor-pointer flex items-center gap-12 hover:opacity-80 transition-opacity'>
        <Logo push={true} />
        <div className='flex items-center gap-1'>
          {
            links.map((link) => (
              <Link href={link.href} target='_blank' key={link.label}>
                <Button variant='ghost' className='px-4 py-2'>
                  {link.label}
                </Button>
              </Link>
            ))
          }
        </div>
      </h1>
     <div className='flex items-center gap-3'>
      <SignedOut>
        <SignInButton>
            <Button variant='outline' className='px-4 py-2'>
                Sign in
            </Button>
        </SignInButton>
        <SignUpButton>
            <Button className='px-4 py-2'>
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