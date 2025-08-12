import { useGetProject } from '@/app/api/service/project'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Fragment } from '@/generated/prisma'
import { NavigationIcon, RefreshCcw } from 'lucide-react'
import React, { useRef } from 'react'
import { toast } from 'sonner'

interface Props {
  fragment: Fragment | null
  projectId: string
}

const ScreenView = ({ fragment, projectId }: Props) => {
  const { data: project } = useGetProject(projectId)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  function handleNavigate() {
    if (project?.sandboxUrl) {
      window.open(project.sandboxUrl, '_blank')
    }
  }

  function handleCopyLink() {
    if (project?.sandboxUrl) {
      navigator.clipboard.writeText(project.sandboxUrl)
      toast.success('Link copied to clipboard')
    }
  }

  function handleRefresh() {
    if (iframeRef.current) {
      iframeRef.current.src = project?.sandboxUrl ?? ''
    }
  }

  function handleIframeLoad() {
    console.log('Iframe loaded successfully')
  }

  return (
    <div className='flex flex-col h-screen w-full'>

      <div className='flex py-2 justify-between px-2'>
        <div className='flex items-center gap-2'>
          <Button onClick={handleRefresh} variant='outline' size='icon'>
            <RefreshCcw />
          </Button>
          <span
            onClick={handleCopyLink}
            className='rounded-md p-2 w-fit text-sm border bg-muted cursor-pointer'
          >
            {project?.sandboxUrl}
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleNavigate} variant='outline' size='icon'>
              <NavigationIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom' align='center'>
            Open in new tab
          </TooltipContent>
        </Tooltip>
      </div>

      {project?.sandboxUrl && (
        <div className='flex flex-col flex-1 min-h-0'>
          <iframe
            ref={iframeRef}
            loading='lazy'
            sandbox='allow-scripts allow-same-origin allow-forms allow-popups'
            onLoad={handleIframeLoad}
            src={project.sandboxUrl}
            className='flex-1 w-full h-full'
          />
        </div>
      )}
    </div>
  )
}

export default ScreenView