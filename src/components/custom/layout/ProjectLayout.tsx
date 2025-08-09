'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import MessageView from './MessageView'
import ScreenView from './ScreenView'

interface Props {
    projectId : string
}

const ProjectLayout = ({projectId} : Props) => {

  return (
    <div className='h-screen w-screen'>
        <ResizablePanelGroup direction='horizontal' >
            <ResizablePanel
            defaultSize={35}
            minSize={20}
            > 
          <Suspense fallback={<div>Loading...</div>}>
            <MessageView projectId={projectId} />            
          </Suspense>
        </ResizablePanel>  
        <ResizableHandle withHandle={true} />
        <ResizablePanel
            defaultSize={65}
            minSize={50}
            className='bg-gray-100'
            > 
            {/* <Suspense fallback={<div>Loading...</div>}> */}
              <ScreenView projectId={projectId} />
            {/* </Suspense> */}
        </ResizablePanel>

        </ResizablePanelGroup>
    </div>
  )
}

export default ProjectLayout