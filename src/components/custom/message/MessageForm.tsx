'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextareaAutosize from 'react-textarea-autosize'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FormField, Form } from '@/components/ui/form'
import { ArrowUpIcon, Loader2 } from 'lucide-react'
import { useCreateMessage } from '@/app/api/service/message'

interface MessageFormProps {
    projectId: string
}

const MessageForm = ({ projectId }: MessageFormProps) => {
    const [isFocused, setIsFocused] = useState(false)
    const showUsages = false

    const formSchema = z.object({
        value: z.string().min(1, { message: "prompt is required" }).max(1000, { message: "prompt must be less than 1000 characters" }),
        projectId: z.string().min(1, { message: "project id is required" })
    })

    const {mutate:createUserMessage,isPending,isError,error,isSuccess} = useCreateMessage()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
            projectId: projectId
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        await createUserMessage({message:data.value,projectId})
    }

    useEffect(() => {
        if(isError){
            toast.error(error.message || "Something went wrong, please try again")
        }
        if(isSuccess){
            form.reset()
        }
    },[isError,error,isSuccess])

    const isButtonDisabled = !form.watch('value')?.trim()

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className={cn(
                    'relative border rounded-xl bg-background transition-all duration-200 bg-muted',
                    isFocused && "border-primary/50 shadow-sm shadow-primary/10",
                    showUsages && "border-muted",
                    !isFocused && "border-border hover:border-border/80"
                )}
            >
                <FormField
                    control={form.control}
                    name='value'
                    render={({ field }) => (
                        <div className="p-4">
                            <TextareaAutosize
                                disabled={isPending}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey){
                                        e.preventDefault()
                                        form.handleSubmit(onSubmit)()
                                    }
                                }}
                                {...field}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className={cn(
                                    "w-full resize-none bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                                    "placeholder:text-muted-foreground text-sm leading-relaxed",
                                    "min-h-[40px] max-h-[160px] transition-all duration-200"
                                )}
                                placeholder='Enter your prompt here...'
                            />
                            <div className="flex items-center justify-between pt-3">
                                <div className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
                                        <span>⌘</span>
                                    </kbd>
                                    <span>Enter</span>
                                    <span>to submit</span>
                                </div>
                                <Button
                                    disabled={isButtonDisabled || isPending}
                                    type="submit"
                                    size="sm"
                                    className={cn(
                                        "h-8 w-8 rounded-full transition-all duration-200",
                                        isButtonDisabled
                                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                                            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
                                    )}
                                >
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpIcon className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    )}
                />
            </form>
        </Form>
    )
}

export default MessageForm