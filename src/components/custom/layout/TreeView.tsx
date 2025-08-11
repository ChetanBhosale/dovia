import { TreeItem } from '@/lib/utils'
import React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TreeViewProps {
    data : TreeItem[]
    value : string | null
    onSelect : (value : string) => void
}

interface TreeNodeProps {
    item: TreeItem
    level?: number
    path?: string
    value: string | null
    onSelect: (value: string) => void
}

const TreeNode: React.FC<TreeNodeProps> = ({ item, level = 0, path = '', value, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  if (typeof item === 'string') {

    const fullPath = path ? `${path}/${item}` : item
    const isSelected = value === fullPath
    
    return (
      <div 
        className={cn(
          "flex items-center px-2 py-1 cursor-pointer hover:bg-secondary rounded-sm transition-colors",
          isSelected && "bg-primary text-primary-foreground"
        )}
        onClick={() => onSelect(fullPath)}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <File className={`w-4 h-4 mr-2 ${isSelected ? 'text-secondary' : 'text-muted-foreground'}`} />
        <span className="text-sm">{item}</span>
      </div>
    )
  }
  
  const [folderName, ...children] = item
  const fullPath = path ? `${path}/${folderName}` : folderName
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div 
          className="flex items-center px-2 py-1 cursor-pointer hover:bg-secondary rounded-sm transition-colors"
          style={{ paddingLeft: `${level * 18 + 8}px` }}
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4 mr-1 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1 text-muted-foreground" />
          )}
          <Folder className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="text-sm font-medium">{folderName}</span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {children.map((child, index) => (
          <TreeNode
            key={index}
            item={child}
            level={level + 1}
            path={fullPath}
            value={value}
            onSelect={onSelect}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

const TreeView = ({data, value, onSelect} : TreeViewProps) => {
  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-2">
        {data.map((item, index) => (
          <TreeNode
            key={index}
            item={item}
            value={value}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

export default TreeView