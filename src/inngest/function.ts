import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit";
export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
  },
  {
    event: "test/hello-world",
  },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "5s");

    const agentBrain = createAgent({
      name: "agent-brain",
      model: gemini({ model: "gemini-2.0-flash-001" }),
      system: `You are an best software development agent help user to build reactJs and Nextjs Components`,
    });

    const { output } = await agentBrain.run(`BUILD : ${event.data.value}`);

    console.log(output);

    return { message: output };
  }
);
