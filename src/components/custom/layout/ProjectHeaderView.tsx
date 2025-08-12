import { useGetProject } from '@/app/api/service/project'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge, ChevronDown, Home, Palette, Settings } from 'lucide-react'
import { Logo } from '../navbar/logo'
import { Button } from '@/components/ui/button'
import MessageHeaderLoader from '../Loaders/MessageHeaderLoader'

interface Props {
  projectId: string
}

const ProjectHeaderView = ({ projectId }: Props) => {
  const { data: project, isLoading } = useGetProject(projectId)
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  if (isLoading) {
    <MessageHeaderLoader />
  }

  const handleGoBack = () => {
    router.push('/')
  }

  return (
    <div className='p-2 bg-background border-b border-border '>
      <div className='flex items-center justify-between w-full'>

        <div className='flex items-center gap-3'>
          <Logo push={false} />
          <div className='h-6 w-px bg-border'></div>
          <h1 className='font-semibold text-foreground'>
            {project?.name || 'Project'}
          </h1>
        </div>

        <div className='flex gap-1 '>
          <Button onClick={handleGoBack} variant='outline' size='sm' className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors'>
            <Home className='w-4 h-4' />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='sm' className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors'>
                <Settings className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='w-56' align='end'>
              <DropdownMenuLabel>Project Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className='w-4 h-4 mr-2' />
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    <div className='w-3 h-3 bg-yellow-500 rounded-full mr-2' />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <div className='w-3 h-3 bg-slate-800 rounded-full mr-2' />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    <div className='w-3 h-3 bg-blue-500 rounded-full mr-2' />
                    System
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default ProjectHeaderView