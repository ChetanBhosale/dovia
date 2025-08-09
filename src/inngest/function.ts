import { inngest } from "./client";
import { createAgent, createNetwork, createTool, gemini, Tool } from "@inngest/agent-kit";
import {Sandbox} from '@e2b/code-interpreter'
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import {z} from 'zod'
import { PROMPT } from "../../prompts/prompts";
import prisma from "@/lib/db";
import { ROLE, TYPE } from "@/constants";
import { MessageRole, MessageType } from "@/generated/prisma";

interface AgentState {
  summary : string,
  files : {[path : string] : string}
}

export const codeAgent = inngest.createFunction(
  {
    id: "code-agent",
  },
  {
    event: "code-agent/run",
  },
  async ({ event, step }) => {
    // await step.sleep("wait-a-moment", "5s");
    const sandboxId = await step.run("run-sandbox", async () => {
        const sandbox = await Sandbox.create('dovia')
        return sandbox.sandboxId
    });

    const agentBrain = createAgent<AgentState>({
      name: "agent-brain",
      model: gemini({ model: "gemini-2.5-flash"}),
      // model : openai({model : "gpt-4o", defaultParameters : {temperature : 0.1}}),
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
          handler : async ({files}, {step,network}:Tool.Options<AgentState>) => {
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

    const network = createNetwork<AgentState>({
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

    const isError = !result.state.data.summary|| Object.keys(result.state.data.files || {}).length === 0

    const sandboxUrl =  await step.run("wait-for-sandbox", async () => {
      const sandbox = await getSandbox(sandboxId)
      const host =  sandbox.getHost(3000)
      return `https://${host}`
    })

    // saving data here in prisma
    await step.run('save-result', async () => {
      if(isError){
        const response = await prisma.message.create({
          data : {
            content : "Something went wrong, please try again",
            role : ROLE.SYSTEM as MessageRole,
            type : TYPE.ERROR as MessageType,
          }
        })
        return response
      }else{
      const response = await prisma.message.create({
        data : {
          content : result.state.data.summary,
          role : ROLE.SYSTEM as MessageRole,
          type : TYPE.RESULT as MessageType,
          fragment : {
            create : {
              sandboxUrl : sandboxUrl,
              title : "Fragments",
              files : result.state.data.files
            }
          }
        }
      })
      return response
    }
    })

    return { url : sandboxUrl, title : 'Fragments', files : result.state.data.files, summary : result.state.data.summary };
  }
);
