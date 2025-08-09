'use server'

import prisma from "@/lib/db"


export const getMessages = async (projectId : string) => {
    const messages = await prisma.message.findMany({
        where : {
            projectId : projectId
        },
        include : {
            fragment : true
        }
    })
    return messages
}