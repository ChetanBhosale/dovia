import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit";
import {Sandbox} from '@e2b/code-interpreter'
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
  },
  {
    event: "test/hello-world",
  },
  async ({ event, step }) => {
    // await step.sleep("wait-a-moment", "5s");
    const sandboxId = await step.run("run-sandbox", async () => {
        const sandbox = await Sandbox.create('dovia')
        return sandbox.sandboxId
    });

    const agentBrain = createAgent({
      name: "agent-brain",
      model: gemini({ model: "gemini-2.0-flash-001" }),
      system: `You are an best software development agent help user to build reactJs and Nextjs Components`,
    });

    const { output } = await agentBrain.run(`BUILD : ${event.data.value}`);

    const sandboxUrl =  await step.run("wait-for-sandbox", async () => {
      const sandbox = await getSandbox(sandboxId)
      const host =  sandbox.getHost(3000)
      return `https://${host}`
    })

    return { message: output };
  }
);
