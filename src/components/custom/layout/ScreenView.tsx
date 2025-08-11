import { useGetProject } from '@/app/api/service/project'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Fragment } from '@/generated/prisma'
import { NavigationIcon, RefreshCcw } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  fragment : Fragment | null
}

const ScreenView = ({fragment} : Props) => {

  const [refresh,setRefresh] = useState(0)
  
  const iframeRef = useRef<HTMLIFrameElement>(null)
  function handleNavigate(){
    if(fragment?.sandboxUrl){
      window.open(fragment?.sandboxUrl, '_blank')
    }
  }

  function handleCopyLink(){
    if(fragment?.sandboxUrl){
      navigator.clipboard.writeText(fragment?.sandboxUrl)
      toast.success('Link copied to clipboard')
    }
  }

  function handleRefresh(){
    setRefresh(refresh + 1)
    iframeRef.current?.contentWindow?.location.reload()
  }

  return (
    <div>
        <div className='flex flex-col h-screen w-full '> 
          <div className='flex py-2 justify-between px-2'>
            <div className='flex items-center gap-2'>
            <Button onClick={handleRefresh} variant='outline' size='icon'>
                <RefreshCcw />
              </Button>
              <span onClick={handleCopyLink} className='rounded-md p-2 w-fit text-sm border bg-muted' >{fragment?.sandboxUrl}</span>
            </div>
            <Tooltip >
              <TooltipTrigger>
                <Button onClick={handleNavigate} variant='outline' size='icon'>
                  <NavigationIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom' align='center'>
                Open in new tab
              </TooltipContent>
            </Tooltip>

          </div>
          <div className='flex flex-col flex-1 min-h-0'>
            <iframe loading='lazy' sandbox='allow-scripts allow-same-origin allow-forms allow-cross-origin-access-control allow-cross-origin-access-control-with-credentials' onLoad={handleRefresh} src={fragment?.sandboxUrl} className='flex-1 w-full h-full' />
          </div>
        </div>
    </div>
  )
}

export default ScreenView