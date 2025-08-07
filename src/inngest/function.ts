import { inngest } from "./client";
import { createAgent, createNetwork, createTool, gemini } from "@inngest/agent-kit";
import {Sandbox} from '@e2b/code-interpreter'
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import {z} from 'zod'
import { PROMPT } from "../../prompts/prompts";
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
      model: gemini({ model: "gemini-2.5-flash"}),
      description : "You are an expert Software Engineer Developer who can build Nextjs Websites.",
      system: PROMPT,
      tools: [
        createTool({
          name: 'terminal',
          description: 'Use this tool to run terminal commands',
          parameters: z.object({
            command : z.string().describe('The command to run in the terminal'),
          }) as any,
          handler: async ({ command }, { step }) => {
            return await step?.run('terminal', async () => {
            const buffer = {stdout : '', stderr : ''}
            try {
              const sandbox = await getSandbox(sandboxId)
              const result = await sandbox.commands.run(command,{
                onStdout : (data:string) => {
                  buffer.stdout += data
                },
                onStderr : (data:string) => {
                  buffer.stderr += data
                }
              })
              return result.stdout
            } catch (e) {
              console.log(`command Failed : ${e} \nstdout : ${buffer.stdout} \nstderr : ${buffer.stderr}`)
              return `command Failed : ${e} \nstdout : ${buffer.stdout} \nstderr : ${buffer.stderr}`
            }})
          }
        }),
        createTool({
          name : "createOrUpdateFiles",
          description : "Use this tool to create or update files in the sandbox",
          parameters : z.object({
            files : z.array(
              z.object({
                path : z.string().describe('The path to the file'),
                content : z.string().describe('The content of the file'),
              })
            )
          }) as any,
          handler : async ({files}, {step,network}) => {
            return await step?.run('createOrUpdateFiles', async () => {
              try {
                const updatedFiles = await network.state.data.files || {}
                const sandbox = await getSandbox(sandboxId);
                for(const file of files){
                  await sandbox.files.write(file.path, file.content)
                  updatedFiles[file.path] = file.content
                }
                network.state.data.files = updatedFiles
                return updatedFiles
              } catch (error) {
                return `Error : ${error}`
              }
            })
          }
        }),
        createTool({
          name : "readFile",
          description : "Read files from the sandbox",
          parameters : z.object({
            files : z.array(z.string())
          }) as any,
          handler : async({files}, {step,network}) => {
            return await step?.run('readFile', async () => {
              try {
                const sandbox = await getSandbox(sandboxId)
                const contents = [];
                for(const file of files){
                  const content = await sandbox.files.read(file)
                  contents.push({path : file, content})
                }
                return contents
              } catch (error) {
                return `Error : ${error}`
              }
            })
          }
        })
      ],
      lifecycle: {
        onResponse: async (args) => {
          const { result, network } = args;
          const lastAssistantMessageText = lastAssistantTextMessageContent(result);

          if(lastAssistantMessageText && network){
            if(lastAssistantMessageText.includes("<task_summary>")){
              network.state.data.summary = lastAssistantMessageText
            }
          }
          return result
        }
      }
    });

    const network = createNetwork({
      name : "coding-agent-network",
      agents : [agentBrain],
      maxIter : 15,
      router : async ({network}) => {
        const summary = network.state.data.summary
        if(summary){
          return 
        }
        return agentBrain
      }
    })

    // const { output } = await agentBrain.run(`BUILD : ${event.data.value}`);
    const result = await network.run(event.data.value)



    const sandboxUrl =  await step.run("wait-for-sandbox", async () => {
      const sandbox = await getSandbox(sandboxId)
      const host =  sandbox.getHost(3000)
      return `https://${host}`
    })

    return { url : sandboxUrl, title : 'Fragments', files : result.state.data.files, summary : result.state.data.summary };
  }
);
