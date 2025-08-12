import { inngest } from "./client";
import { Agent, createAgent, createNetwork, createState, createTool, gemini, type Message, openai, Tool } from "@inngest/agent-kit";
import {Sandbox} from '@e2b/code-interpreter'
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import {json, z} from 'zod'
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "../../prompts/prompts";
import prisma from "@/lib/db";
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
    
    let sandboxId = ""

    if(event.data.sandBoxId){
      sandboxId = event.data.sandBoxId
    }else{
      sandboxId = await step.run("run-sandbox", async () => {
        const sandbox = await Sandbox.create('dovia')
        return sandbox.sandboxId
      })
    }

    console.log({sandboxId, event : event.data})

    const previousMessages = await step.run('get-previous-messages', async () => {
      const formatedMessages : Message[] = []

      const messages = await prisma.message.findMany({
        where : {
          projectId : event.data.projectId
        },
        orderBy : {
          createdAt : 'asc'
        }
      })
      let index = 1
      for(const message of messages){
        formatedMessages.push({
          type : "text",
          role : message.role === MessageRole.ASSISTANT ? "assistant" : "user",
          content : `${index++} Message : ${message.content}`
        })
      }
      return formatedMessages
    })

    const state = createState<AgentState>({
      summary : "",
      files : {}
    },
    {
      messages : previousMessages
    })

    const agentBrain = createAgent<AgentState>({
      name: "agent-brain",
      model: gemini({ model: "gemini-2.5-flash"}),
      // model : openai({model : "gpt-4o", defaultParameters : {temperature : 0.1}}),
      description : "You are an expert Software Engineer Developer who can build Nextjs Websites.",
      system: PROMPT,
      tools: [
        createTool({
          name: 'terminal',
          description: 'Use this tool to run terminal commands, you are using terminal command in sandbox, IMPORTANT : You must provide a "command" parameter with the command to run in the terminal',
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
            const newFiles =  await step?.run('createOrUpdateFiles', async () => {
              try {
                const updatedFiles = network.state.data.files || {}
                const sandbox = await getSandbox(sandboxId);
                for(const file of files){
                  await sandbox.files.write(file.path, file.content)
                  updatedFiles[file.path] = file.content
                }
                return updatedFiles
              } catch (error) {
                return `Error : ${error}`
              }
            })
            if(typeof newFiles === 'object'){
              network.state.data.files = newFiles as AgentState['files']
              return JSON.stringify(newFiles)
            }else {
              return newFiles
            }
          }
        }),
        createTool({
          name : "readFiles",
          description : "Read one or more files from the sandbox. IMPORTANT: You must provide a 'files' parameter with an array of file paths. Example: readFile({files: ['src/app.js', 'package.json']})",
          parameters : z.object({
            files : z.array(z.string()).describe('Read one or more files from the sandbox. IMPORTANT: You must provide a "files" parameter with an array of file paths. Example: readFile({files: ["src/app.js", "package.json"]})')
          }) as any,
          handler : async({files}, {step,network}) => {
            console.log({files})
            return await step?.run('readFile', async () => {
              try {
                const sandbox = await getSandbox(sandboxId)
                const contents = [];
                for(const file of files){
                  const content = await sandbox.files.read(file)
                  contents.push({path : file, content})
                }
                return JSON.stringify(contents)
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

    const fragmentTitleAgent = createAgent<AgentState>({
      name : "fragment-title-agent",
      model : gemini({model : "gemini-2.5-flash"}),
      // model : openai({model : "gpt-4o", defaultParameters : {temperature : 0.1}}),
      description : "Provide Fragemtn Tiltes",
      system : FRAGMENT_TITLE_PROMPT
    })

    const responseAgent = createAgent<AgentState>({
      name : "response-agent",
      model : gemini({model : "gemini-2.5-flash"}),
      // model : openai({model : "gpt-4o", defaultParameters : {temperature : 0.1}}),
      description : "Provide a response to the user",
      system : RESPONSE_PROMPT
    })

    const network = createNetwork<AgentState>({
      name : "coding-agent-network",
      agents : [agentBrain],
      maxIter : 15,
      defaultState : state,
      router : async ({network}) => {
        const summary = network.state.data.summary
        if(summary){
          return 
        }
        return agentBrain
      }
    })

    // const { output } = await agentBrain.run(`BUILD : ${event.data.value}`);
    const result = await network.run(event.data.value , {
      state : state
    })


    const {output : fragemtnTitleOutput} = await fragmentTitleAgent.run(result.state.data.summary)
    const {output : responseOutput} = await responseAgent.run(result.state.data.summary)

    console.log({fragemtnTitleOutput, responseOutput})



    console.log(fragemtnTitleOutput[0])

    const generateFragmentTitle = () => {
      if(fragemtnTitleOutput[0].type !== "text"){
        return "Fragment"
      }

      if(fragemtnTitleOutput[0].type === "text" && fragemtnTitleOutput[0].content){
        return fragemtnTitleOutput[0].content as string
      }

      return "Fragment"
    }

    const generateResponse = () => {
      if(responseOutput[0].type !== "text"){
        return "Here is the updated code you asked for"
      }

      if(responseOutput[0].type === "text" && responseOutput[0].content){
        return responseOutput[0].content as string
      }

      return "Updated Code"
    }


    const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0
    console.log({isError})


    console.time('wait-for-sandbox-url')
    const sandboxUrl =  await step.run("wait-for-sandbox", async () => {
      const sandbox = await getSandbox(sandboxId)
      const host =  sandbox.getHost(3000)
      return `https://${host}`
    })
    console.timeEnd('wait-for-sandbox-url')


    // saving data here in prisma
    await step.run('save-result', async () => {
      if(isError){
        const response = await prisma.message.create({
          data : {
            content : "Something went wrong, please try again",
            role : MessageRole.ASSISTANT,
            type : MessageType.ERROR,
            projectId : event.data.projectId
          }
        })

        if(!event.data.sandBoxId){
          await prisma.project.update({
            where : {
              id : event.data.projectId,
            },
            data : {
              sandboxId : sandboxId,
              sandboxUrl : sandboxUrl
            }
          })
        }
        return response
      }else{

        if(!event.data.sandBoxId){
          await prisma.project.update({
            where : {
              id : event.data.projectId
            },
            data : {
              sandboxId : sandboxId,
              sandboxUrl : sandboxUrl
            }
          })
        }

      const response = await prisma.message.create({
        data : {
          content : generateResponse(),
          role : MessageRole.ASSISTANT,
          type : MessageType.RESULT,
          projectId : event.data.projectId,
          fragment : {
            create : {
              title : generateFragmentTitle(),
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
