'use client'

import { signIn, signOut } from "next-auth/react"

export default function SignInButton(){
    return(
        <div className="flex flex-row items-center justify-content">
        <button onClick={() => signIn(undefined, { callbackUrl: 'http://localhost:3000/dashboard'})} className="border p-2 m-4 bg-green-200 text-black rounded-lg cursor-pointer">Signin</button>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="border p-2 m-4 bg-red-200 text-black rounded-lg cursor-pointer">Logout</button>
        </div>
    )

}