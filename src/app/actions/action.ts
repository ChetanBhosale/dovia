"use server";

import { inngest } from "@/inngest/client";

export async function testAI(value: string) {
  await inngest.send({
    name: "test/hello-world",
    data: {
      value: value,
    },
  });

  return { message: "message send to the inngest" };
}

