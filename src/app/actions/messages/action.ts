'use server'

import { ROLE, TYPE } from "@/constants"
import { MessageRole, MessageType } from "@/generated/prisma"
import { inngest } from "@/inngest/client"
import prisma from "@/lib/db"
import { Response, STATUS } from "@/service/Respone"

export async function createMessage(message:string){
    try {

        if(message.length < 3) {
            return Response({
                message : "Message is too short to send",
                status : STATUS.ERROR,
                data : null
            })
        }

        const response = await prisma.message.create({
            data : {
                content : message,
                role : ROLE.USER as MessageRole,
                type : TYPE.RESULT as MessageType,
            }
        })

        await inngest.send({
            name : "test/hello-world",
            data : {
                message : response.content
            }
        })

        return Response({
            message : "Message created successfully",
            status : STATUS.SUCCESS,
            data : response
        })
    } catch (error) {
        return Response({
            message : "Error creating message",
            status : STATUS.ERROR,
            data : error
        })
    }
}