"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { testAI } from './actions/action';

const HomePage = () => {
  const [value, setValue] = useState("");
  return (
    <div>
      <Input type="text" onChange={(e) => setValue(e.target.value)} placeholder='type here something....' value={value} />
      <Button onClick={() => testAI(value)}>Send</Button>
    </div>
  )
}

export default HomePage