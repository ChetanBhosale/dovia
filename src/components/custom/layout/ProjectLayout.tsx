'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { Suspense, useState } from 'react'
import MessageView from './MessageView'
import ScreenView from './ScreenView'
import { Fragment } from '@/generated/prisma'

interface Props {
    projectId : string
}

const ProjectLayout = ({projectId} : Props) => {

  const [activeFragment,setActiveFragment] = useState<Fragment | null>(null)

  return (
    <div className='h-screen w-full'>
        <ResizablePanelGroup direction='horizontal' >
            <ResizablePanel
            defaultSize={35}
            minSize={20}
            >
          {/* <ProjectHeaderView project={projectId} /> */}
          <Suspense fallback={<div>Loading...</div>}>
            <MessageView projectId={projectId} setActiveFragment={setActiveFragment} activeFragment={activeFragment} />            
          </Suspense>
        </ResizablePanel>  
        <ResizableHandle withHandle={true} />
        <ResizablePanel
            defaultSize={65}
            minSize={50}
            > 
            {/* <Suspense fallback={<div>Loading...</div>}> */}
              <ScreenView fragment={activeFragment} />
            {/* </Suspense> */}
        </ResizablePanel>

        </ResizablePanelGroup>
    </div>
  )
}

export default ProjectLayout