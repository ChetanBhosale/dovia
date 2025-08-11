import React from 'react'

const Layout = ({children} : {children : React.ReactNode}) => {
  return (
    <main className='flex flex-col min-h-screen max-h-screen'>
        <div className='flex-1 flex flex-col px-4 pb-4'>
            {children}
        </div>
    </main>
  )
}

export default Layout