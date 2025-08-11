import { Fragment } from '@/generated/prisma'
import React from 'react'

interface CodeViewProps {
  fragment: Fragment
}

const CodeView = ({fragment} : CodeViewProps) => {
  return (
    <div>CodeView</div>
  )
}

export default CodeView