"use client"

import { getMessages } from "@/app/actions/messages/action"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useGetMessages = (projectId : string) => {
    return useSuspenseQuery({
        queryKey : ["messages",projectId],
        queryFn : async () => await getMessages(projectId)
    })
}