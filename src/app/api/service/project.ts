'use client'

import { createProject, getProject } from "@/app/actions/projects/action"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"



export const useCreateProject = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn : async (value : string) => await createProject(value),
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["projects"]})
        },
        onError : (error) => {
            console.log({error})
        }
    })
}


export const useGetProject = (projectId : string) => {
    return useSuspenseQuery({
        queryKey : ["project",projectId],
        queryFn : async () => await getProject(projectId)
    })
}