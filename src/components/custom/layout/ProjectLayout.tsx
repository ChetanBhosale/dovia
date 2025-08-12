'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { Suspense, useState } from 'react'
import MessageView from './MessageView'
import ScreenView from './ScreenView'
import { Fragment } from '@/generated/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeIcon, EyeIcon, PlusIcon, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import CodeView from '../message/CodeView'
import FileExplorer, { FileCollection } from '../file-explorer'
import UserController from '../navbar/user-controller'

interface Props {
    projectId : string
}

const ProjectLayout = ({projectId} : Props) => {

  const [activeFragment,setActiveFragment] = useState<Fragment | null>(null)
  const [tabState,setTabState] = useState<'prev' | 'code'>('prev')

  return (
    <div className='h-screen w-full'>
        <ResizablePanelGroup direction='horizontal' >
            <ResizablePanel
            defaultSize={25}
            minSize={20}
            >
          {/* <ProjectHeaderView project={projectId} /> */}
          <Suspense fallback={<div>Loading...</div>}>
            <MessageView projectId={projectId} setActiveFragment={setActiveFragment} activeFragment={activeFragment} />            
          </Suspense>
        </ResizablePanel>  
        <ResizableHandle withHandle={true} />
        <ResizablePanel
            defaultSize={75}
            minSize={50}
            > 
            <Tabs
            className='h-full gap-y-0' defaultValue='prev' value={tabState} onValueChange={(val) => setTabState(val as 'prev' | 'code')}>
            <div className='w-full h-full items-center'>
              <div className='flex w-full py-2 items-center justify-between border-b px-2'>
                
              
              <TabsList className='h-8 p-0 border rounded-md'>
                <TabsTrigger value='prev' className='rounded-md w-10 h-8'>
                  <EyeIcon className='size-4' />
                </TabsTrigger>
                <TabsTrigger value='code' className='rounded-md w-10 h-8'>
                  <CodeIcon className='size-4' />
                </TabsTrigger>
              </TabsList>
              <div className='ml-auto flex items-center gap-x-2'>
                {/* <Button asChild size='sm' variant='default'>
                  <Link href="/pricing">
                    <Star className='size-4 mr-2' />
                    <span className='text-xs'>Choose Model</span>
                  </Link>
                </Button> */}
                <UserController showName={false} />
              </div>
              </div>
              <TabsContent value='prev'>
                {!!activeFragment && <ScreenView fragment={activeFragment} projectId={projectId} />}
              </TabsContent>
              <TabsContent value='code' className='min-h-0 overflow-y-auto'>
                {!!activeFragment && <FileExplorer files={activeFragment.files as FileCollection} />}
              </TabsContent>
            </div>
            {/* </Suspense> */}
            </Tabs>
        </ResizablePanel>

        </ResizablePanelGroup>
    </div>
  )
}

export default ProjectLayout