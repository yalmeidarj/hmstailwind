'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
// import styles from '../styles/Home.module.css'
// import '../styles/prism.css'

declare global {
  interface Window {
    Prism: any
  }
}

const apiSample = `import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { userId, sessionId } = auth()
  if(!sessionId) {
    return NextResponse.json({ id: null }, { status: 401 })
  }
  return NextResponse.json({ id: userId }, { status: 200 })
}`


export const APIRequest = () => {

  useEffect(() => {
    if (window.Prism) {
      window.Prism.highlightAll()
    }
  })

  const [response, setResponse] = useState('// Please Log in')

  const makeRequest = async () => {
    setResponse('// Loading...')

    try {
      const res = await fetch('/api/getAuthenticatedUserId')
      const body = await res.json()
      setResponse(JSON.stringify(body, null, '  '))
    } catch (e) {
      setResponse(
        '// There was an error with the request. Please contact support@clerk.dev'
      )
    }

  }
  // const data = await ;
  return response

}
// https://hmsapi.herokuapp.com/shiftLogger
