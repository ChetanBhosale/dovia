import { createMessage, getMessages } from "@/app/actions/messages/action"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetMessages = (projectId : string) => {
    return useQuery({
        queryKey : ["messages",{projectId}],
        queryFn : async () => await getMessages(projectId),
        refetchInterval : 5000
    })
}


export const useCreateMessage = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn : async ({message,projectId}:{message:string,projectId:string}) => await createMessage(projectId,message),
        onSuccess : (_,variables) => {
            queryClient.invalidateQueries({queryKey : ["messages",{projectId : variables.projectId}]})
        }
    })
}