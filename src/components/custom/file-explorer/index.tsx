import React, { useCallback, useMemo, useState } from 'react'
import { Copy, CopyCheck, CopyCheckIcon} from 'lucide-react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import CodeView from '../code-view'
import { Button } from '@/components/ui/button'
import { convertFilesToTreeItems } from '@/lib/utils'
import TreeView from '../layout/TreeView'
import { toast } from 'sonner'

export type FileCollection = {
    [path : string] : string
}

function getLanguageFromExtension(filename :string):string {
    const extension = filename.split('.').pop()?.toLowerCase()
    return extension || 'text'
}

interface FileExplorerProps {
    files : FileCollection
}

const FileExplorer = ({files} : FileExplorerProps) => {
    const [selectedFile,setSelectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files)
        return fileKeys.length > 0 ? fileKeys[0] : null
    })

    const treeData = useMemo(() => convertFilesToTreeItems(files),[files])

    const handleFileSelect = useCallback((filePath :string) => {
        if(files[filePath]){
            setSelectedFile(filePath)
        }
    },[files])

    const generateBreadcrumbs = useCallback((filePath: string) => {
        const pathParts = filePath.split('/')
        return pathParts.map((part, index) => {
            const isLast = index === pathParts.length - 1
            const path = pathParts.slice(0, index + 1).join('/')
            
            if (isLast) {
                return (
                    <BreadcrumbItem key={index}>
                        <BreadcrumbPage>{part}</BreadcrumbPage>
                    </BreadcrumbItem>
                )
            }
            
            return (
                <BreadcrumbItem key={index}>
                    <BreadcrumbLink 
                        onClick={() => handleFileSelect(path)}
                        className="cursor-pointer"
                    >
                        {part}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                </BreadcrumbItem>
            )
        })
    }, [handleFileSelect])

    const handleCopy = useCallback(() => {
        if(selectedFile){
            navigator.clipboard.writeText(files[selectedFile])
            toast.success('Copied to clipboard')
        }
    },[selectedFile,files])

    return (
        <ResizablePanelGroup direction='horizontal' className='h-full'>
            <ResizablePanel defaultSize={30} minSize={30} className='sidebar'>
                <TreeView data={treeData} value={selectedFile} onSelect={handleFileSelect} />
            </ResizablePanel>
            <ResizableHandle className='hover:bg-primary transition-colors duration-200' />
            <ResizablePanel defaultSize={70} minSize={50}  className='overflow-y-scroll overflow-y-scroll' >
              {selectedFile && files[selectedFile] ? (
                <div className='h-[100vh] w-full flex flex-col '>
                    <div className='border-b bg-sidebar px-4 py-2 flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {generateBreadcrumbs(selectedFile)}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                            <Copy onClick={() => handleCopy()} className='w-4 h-4 cursor-pointer hover:text-primary' size="sm" />
                    </div>
                    <CodeView code={files[selectedFile]} lang={getLanguageFromExtension(selectedFile)} />
                </div>
              ) : (
                <div className='flex h-full items-center justify-center text-muted-foreground'>
                    <p>Select a file to view content</p>
                </div>
              )}
            </ResizablePanel>

        </ResizablePanelGroup>
    )
}

export default FileExplorer