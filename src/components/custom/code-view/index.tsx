import React, { useEffect } from 'react'
import Prism from 'prismjs'
// import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-scss"
import "prismjs/components/prism-json"
import "prismjs/components/prism-python"
import "./code-theme.css"

interface CodeViewProps {
  code: string  
  lang: string
}

const CodeView = ({code,lang} : CodeViewProps) => {
    useEffect(() => {
        Prism.highlightAll()
    }, [code,lang])
  return (
    <pre
    className='p-2 bg-transparent border-none rounded-none m-0 pb-20 text-xs text-pretty h-full overflow-y-auto'
    >
        <code className={`language-${lang} text-sm `}>{code}</code>
    </pre>
  )
}

export default CodeView