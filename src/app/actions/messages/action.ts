'use server'

import { MessageRole, MessageType } from "@/generated/prisma"
import { inngest } from "@/inngest/client"
import prisma from "@/lib/db"
import { Response, STATUS } from "@/service/Respone"

export async function createMessage(message: string) {
    try {
        if (message.length < 3) {
            return Response({
                message: "Message is too short to send",
                status: STATUS.ERROR,
                data: null
            })
        }

        const response = await prisma.message.create({
            data: {
                content: message,
                role: MessageRole.USER,
                type: MessageType.RESULT,
            }
        })

        await inngest.send({
            name: "code-agent/run",
            data: {
                value: response.content
            }
        })

        return Response({
            message: "Message created successfully",
            status: STATUS.SUCCESS,
            data: response
        })
    } catch (error) {
        return Response({
            message: "Error creating message",
            status: STATUS.ERROR,
            data: error instanceof Error ? error.message : String(error)
        })
    }
}

export async function getMessages() {
    try {
        const response = await prisma.message.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return Response({
            message: "Messages fetched successfully",
            status: STATUS.SUCCESS,
            data: response
        })
    } catch (error) {
        return Response({
            message: "Error getting messages",
            status: STATUS.ERROR,
            data: error instanceof Error ? error.message : String(error)
        })
    }
}
