"use client"

import React from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

const ErrorView = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="flex flex-col items-center bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold mb-2 text-center">Something went wrong</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-center">
          Sorry, an unexpected error has occurred. Please try again later or return to the homepage.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2 rounded-lg bg-primary text-white font-medium shadow hover:bg-primary/90 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}

export default ErrorView