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

interface Props {
  projectId : string
}

const ProjectHeaderView = ({projectId} : Props) => {
  const {data : project, isLoading} = useGetProject(projectId)
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  if(isLoading){
    return <div>Loading...</div>
  }

  const handleGoBack = () => {
    router.push('/')
  }

  return (
    <div className='p-4 bg-background border-b border-border sticky top-0 z-10'>
      <div className='flex items-center justify-between'>
        {/* Logo placeholder */}
        <div className='flex items-center gap-3'>
          <Badge onClick={handleGoBack} className='text-red-300 cursor-pointer' />
          <div className='h-6 w-px bg-border'></div>
          <h1 className='text-lg font-semibold text-foreground'>
            {project?.name || 'Project'}
          </h1>
        </div>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors'>
              <Settings className='w-4 h-4' />
              <span>Settings</span>
              <ChevronDown className='w-4 h-4' />
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className='w-56' align='end'>
            <DropdownMenuLabel>Project Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleGoBack}>
              <Home className='w-4 h-4 mr-2' />
              Go Back
            </DropdownMenuItem>
            
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
  )
}

export default ProjectHeaderView