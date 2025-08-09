"use client"

import { createMessage, getMessages } from "@/app/actions/messages/action"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Message } from "@/generated/prisma";

// export const useCreateMessage = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (message: string) => {
//       const res = await fetch("/api/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message }),
//       });
//       return res.json();
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["messages"] });
//     },
//   });
// };

// export const useGetMessages = () => {
//   return useQuery<Message[]>({
//     queryKey: ["messages"],
//     queryFn: async () => {
//       const res = await fetch("/api/messages");
//       const data = await res.json();
//       return data.data;
//     },
//   });
// };


export const useCreateMessage = () => {
    const queryClient = useQueryClient()
 
    return useMutation({
        mutationFn : async (message:string) => await createMessage(message),
        onSettled : () => {
            queryClient.invalidateQueries({queryKey : ["messages"]})
        }
    })

}

export const useGetMessages = () => {
    return useQuery({
        queryKey : ["messages"],
        queryFn : async () => await getMessages(),
        select : (data) => data.data
    })
}