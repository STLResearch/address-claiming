'use client'
import Signup from '@/app/auth/page'
import React from 'react'

export default function LoginPage() {
  return (
    <div className='fixed  w-screen h-full  flex items-center justify-center '>
      <div className='w-[100%] h-[100%] flex justify-center items-center rounded-xl overflow-clip '>
        <Signup/>
      </div>
    </div>
  )
}