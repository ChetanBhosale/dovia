import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { MessageRole, MessageType } from "@/generated/prisma";
import { inngest } from "@/inngest/client";

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      message: "Messages fetched successfully",
      status: "SUCCESS",
      data: messages,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error getting messages",
        status: "ERROR",
        data: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || message.length < 3) {
      return NextResponse.json(
        {
          message: "Message is too short to send",
          status: "ERROR",
          data: null,
        },
        { status: 400 }
      );
    }

    const response = await prisma.message.create({
      data: {
        content: message,
        role: MessageRole.USER,
        type: MessageType.RESULT,
      },
    });

    await inngest.send({
      name: "code-agent/run",
      data: { message: response.content },
    });

    return NextResponse.json({
      message: "Message created successfully",
      status: "SUCCESS",
      data: response,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error creating message",
        status: "ERROR",
        data: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
