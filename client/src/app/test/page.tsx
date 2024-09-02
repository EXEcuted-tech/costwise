"use client"
import Alert from '@/components/alerts/Alert'
import Loader from '@/components/loaders/Loader'
import Spinner from '@/components/loaders/Spinner'
import React, { useState } from 'react'

const page = () => {
  const [close,setClose] = useState(false);
  return (
    <div>
        <Alert variant="critical" message="Remember that im cute. RAAAAAAAAAAH" setClose={setClose}/>
        <Loader className='w-[200px] h-[30px]'/>
        <Spinner />
    </div>
  )
}

export default page