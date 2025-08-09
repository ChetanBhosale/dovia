import { useGetProject } from '@/app/api/service/project'
import React from 'react'

interface Props {
    projectId : string
}

const ScreenView = ({projectId} : Props) => {
    const {data,isLoading} = useGetProject(projectId)
  return (
    <div>
        {isLoading && <div>Loading...</div>}
        {data && <div>{JSON.stringify(data)}</div>}
    </div>
  )
}

export default ScreenView