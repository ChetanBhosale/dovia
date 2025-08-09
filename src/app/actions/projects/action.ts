'use server'

import { MessageRole, MessageType } from "@/generated/prisma"
import { inngest } from "@/inngest/client"
import prisma from "@/lib/db"
import { generateSlug } from "random-word-slugs"

export const createProject = async (value: string) => {
    const slug = generateSlug(2, { format: "kebab" })

    const project = await prisma.project.create({
        data: { name: slug }
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
    const project = await prisma.project.findUnique({
        where : {
            id : projectId
        }
    })
    return project
}