'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, ExternalLink, Code, Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { useGetUserProjects } from '@/app/api/service/project'

const ProjectsSection = () => {
  const router = useRouter()
  const { data: projects, isLoading, error } = useGetUserProjects()
  
  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`)
  }

  const handleOpenSandbox = (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(url, '_blank')
  }


  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-16'>
      <div className='flex items-center justify-between mb-12'>
        <div>
          <h2 className="text-3xl font-semibold mb-2">My Workspace</h2>
          <p className="text-muted-foreground">Your AI-generated projects and applications</p>
        </div>
      </div>
      {
        isLoading && (
          <div className='flex items-center justify-center py-16'>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )
      }

      {
        error && (
          <div className='flex items-center justify-center py-16'>
            <Code className="h-8 w-8 text-muted-foreground" />
          </div>
        )
      }

      {
        !error && projects && projects.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-muted/70"
                onClick={() => router.push(`/project/${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-medium capitalize">
                      {project.name.replace(/-/g, ' ')}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                    </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/project/${project.id}`)}
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className='text-center py-16'>
            <div className='mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4'>
              <Code className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building your first project by describing what you want to create
            </p>
          </div>
        )
      }

    </div>
  )
}

export default ProjectsSection
