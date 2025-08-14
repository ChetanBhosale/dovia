'use server'

import { MessageRole, MessageType } from "@/generated/prisma"
import { inngest } from "@/inngest/client"
import prisma from "@/lib/prisma"
import { generateSlug } from "random-word-slugs"
import { handleAuth } from "../auth/handleAuth"
import { redirect } from "next/navigation"

export const createProject = async (value: string) => {
    const user = await handleAuth()
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
    const project = await prisma.project.findUnique({
        where : {
            id : projectId,
            userId : user.id
        }
    })
    if(!project){
        redirect('/not-found')
    }
    return project
}

export const getUserProjects = async () => {
    const user = await handleAuth()
    
    const projects = await prisma.project.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })
    
    return projects
}