'use server'

import { MessageRole, MessageType } from "@/generated/prisma"
import { inngest } from "@/inngest/client"
import prisma from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { handleAuth } from "../auth/handleAuth"


export const getMessages = async (projectId : string) => {
    const user = await handleAuth()
    
    const messages = await prisma.message.findMany({
        where : {
            projectId : projectId,
        },
        include : {
            fragment : true
        },
        orderBy : {
            createdAt : 'asc'
        }
    })
    return messages
}


export const createMessage = async (projectId:string,message:string) => {
    const user = await handleAuth()

    const project = await prisma.project.findUnique({
        where : {
            id : projectId,
            userId : user.id
        }
    })

    const newMessage = await prisma.message.create({
        data : {
            projectId,
            content : message,
            role : MessageRole.USER,
            type : MessageType.RESULT
        }
    })

    await inngest.send({
        name : "code-agent/run",
        data : {
            projectId,
            value : newMessage.id
        }
    })

    return newMessage
}