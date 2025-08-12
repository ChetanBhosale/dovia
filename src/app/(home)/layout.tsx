import Navbar from '@/components/custom/navbar/navbar'
import React from 'react'

const Layout = ({children} : {children : React.ReactNode}) => {
  return (
    <main className='w-full min-h-screen'>
      <Navbar />
      {children}
    </main>
  )
}

export default Layout