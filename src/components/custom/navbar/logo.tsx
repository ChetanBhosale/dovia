import { BoomBoxIcon, Croissant } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface Props {
    push : boolean
}

export const Logo = ({push} : Props) => {
    const router = useRouter()
    return (
        <span className='cursor-pointer'>
            {/* <Croissant className='text-primary size-6' /> */}
            <span className='text-primary size-6'>
            <BoomBoxIcon onClick={() => router.push('/')} className='cursor-pointer' />
            </span>
            {/* <h1 className='text-2xl font-bold font-chango text-primary'>Dovia</h1> */}
        </span>
    )
}