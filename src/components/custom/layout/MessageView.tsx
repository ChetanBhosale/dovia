import { useGetMessages } from '@/app/api/service/message'
import React from 'react'

interface Props {
    projectId : string
}

const MessageView = ({projectId} : Props) => {
 const {data,isLoading} = useGetMessages(projectId)
  return (
    <div>
        {isLoading && <div>Loading...</div>}
        {data && <div>{JSON.stringify(data)}</div>}
    </div>
  )
}

export default MessageView