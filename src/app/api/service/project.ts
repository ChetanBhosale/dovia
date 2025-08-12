'use client'

import { createProject, getProject, getUserProjects } from "@/app/actions/projects/action"
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

export const useGetUserProjects = () => {
    return useQuery({
        queryKey: ["user-projects"],
        queryFn: async () => await getUserProjects(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}