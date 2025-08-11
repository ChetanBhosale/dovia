'use server'

import { MessageRole, MessageType } from "@/generated/prisma"
import { inngest } from "@/inngest/client"
import prisma from "@/lib/db"
import { generateSlug } from "random-word-slugs"
import { handleAuth } from "../auth/handleAuth"

export const createProject = async (value: string) => {
    const user = await handleAuth()
    console.log({user})
    const slug = generateSlug(2, { format: "kebab" })


    const project = await prisma.project.create({
        data: { name: slug, userId: user.id }
    })

    await prisma.message.create({
        data: {
            content: value,
            role: MessageRole.USER,
            type: MessageType.RESULT,
            projectId: project.id
        }
    })

    if (!project) {
        throw new Error("Project creation failed") 
    }

    await inngest.send({
        name: "code-agent/run",
        data: {
            value: value,
            projectId: project.id
        }
    })

    return project
}


export const getProject = async (projectId : string) => {
    const user = await handleAuth()
    console.log({user})
    const project = await prisma.project.findUnique({
        where : {
            id : projectId,
            userId : user.id
        }
    })
    if(!project){
        throw new Error('No Project Found, Please create a new project')
    }
    return project
}