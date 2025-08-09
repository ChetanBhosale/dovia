// app/projects/[projectId]/page.tsx

import { getMessages } from '@/app/actions/messages/action'
import { getProject } from '@/app/actions/projects/action'
import ProjectView from '@/components/custom/layout/ProjectLayout'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'

interface Props {
  params: { projectId: string }
}

const Page = async ({ params }: Props) => {
  const { projectId } = params

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
      <ProjectView projectId={projectId} />
    </HydrationBoundary>
  )
}

export default Page
