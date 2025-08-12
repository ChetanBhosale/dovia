// app/projects/[projectId]/page.tsx

import { getMessages } from '@/app/actions/messages/action'
import { getProject } from '@/app/actions/projects/action'
import ErrorView from '@/components/custom/error/error-view'
import ProjectView from '@/components/custom/layout/ProjectLayout'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

import React from 'react'

interface Props {
  params: Promise<{ projectId: string }>
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId),
  })

  await queryClient.prefetchQuery({
    queryKey: ['messages', projectId],
    queryFn: () => getMessages(projectId),
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <ErrorBoundary fallback={<ErrorView />}>
        <ProjectView projectId={projectId} />
      </ErrorBoundary>
    </HydrationBoundary>
  )
}

export default Page
