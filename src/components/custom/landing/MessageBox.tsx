'use client'

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextareaAutosize from 'react-textarea-autosize'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FormField, Form } from '@/components/ui/form'
import { ArrowUpIcon, Loader2, Plus, Zap, Sparkles } from 'lucide-react'
import { useCreateProject } from '@/app/api/service/project'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  value: z.string().min(1, { message: 'prompt is required' }).max(1000, { message: 'prompt must be less than 1000 characters' }),
})

const MessageBox = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const showUsages = false
  const router = useRouter()
  const { mutate: createUserMessage, isPending, isError, error, isSuccess, data: project } = useCreateProject()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: '' },
    mode: 'onSubmit',
  })

  const isButtonDisabled = useMemo(() => !inputValue.trim(), [inputValue])

  const formClasses = useMemo(() => cn(
    'relative border rounded-2xl transition-all duration-200 bg-muted/70',
    isFocused && 'border-primary/50 shadow-lg shadow-primary/10',
    showUsages && 'border-muted',
    !isFocused && 'border-border hover:border-border/80'
  ), [isFocused, showUsages])

  const textareaClasses = useMemo(() => cn(
    'w-full resize-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
    'placeholder:text-muted-foreground text-sm sm:text-base leading-relaxed',
    'min-h-[50px] sm:min-h-[60px] max-h-[200px] transition-all duration-200',
    'mb-3 sm:mb-4'
  ), [])

  const submitButtonClasses = useMemo(() => cn(
    'h-8 w-8 sm:h-10 sm:w-10 rounded-full transition-all duration-200 self-end sm:self-auto',
    isButtonDisabled
      ? 'bg-muted text-muted-foreground cursor-not-allowed'
      : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105'
  ), [isButtonDisabled])

  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)
    form.setValue('value', value, { shouldValidate: false })
  }, [form])

  const onSubmit = useCallback(async (data: z.infer<typeof formSchema>) => {
    createUserMessage(data.value)
  }, [createUserMessage])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (inputValue.trim()) {
        form.handleSubmit(onSubmit)()
      }
    }
  }, [form, onSubmit, inputValue])

  useEffect(() => {
    if (isError) toast.error(error.message || 'Something went wrong, please try again')
    if (isSuccess) {
      form.reset()
      setInputValue('')
      toast.success('Project created successfully')
      router.push(`/project/${project.id}`)
    }
  }, [isError, error, isSuccess, form, router, project])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={formClasses}>
        <FormField
          control={form.control}
          name="value"
          render={({ field: { onChange, ...field } }) => (
            <div className="p-4 sm:p-6">
              <TextareaAutosize
                {...field}
                disabled={isPending}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={textareaClasses}
                placeholder="Build extreme good components here..."
              />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-3 sm:pt-4 border-t border-border/50">
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-lg hover:bg-muted"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>

                  {/* <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 sm:h-8 sm:px-3 py-1 rounded-full text-xs font-medium"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Choose Model</span>
                    <span className="sm:hidden">Model</span>
                  </Button> */}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled
                    className="h-7 px-2 sm:h-8 sm:px-3 py-1 rounded-full text-xs font-medium"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Free Model Selected</span>
                    <span className="sm:hidden">Free</span>
                  </Button>
                </div>

                <Button
                  disabled={isButtonDisabled || isPending}
                  type="submit"
                  size="sm"
                  className={submitButtonClasses}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : (
                    <ArrowUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
              </div>
            </div>
          )}
        />
      </form>
    </Form>
  )
}

export default MessageBox