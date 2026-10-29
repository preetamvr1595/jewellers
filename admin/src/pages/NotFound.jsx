import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full border border-[#C6A75E]/30 flex items-center justify-center text-2xl text-[#C6A75E] mb-6">
        ✦
      </div>
      <h1 className="text-4xl font-serif text-[#C6A75E] mb-3">404 - Page Not Found</h1>
      <p className="text-gray-400 max-w-md mb-8 text-sm">
        The administrative panel route you requested does not exist or has been relocated.
      </p>
      <Link
        to="/admin"
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8F7124] to-[#C6A75E] text-black font-semibold text-xs tracking-wider uppercase shadow-lg hover:brightness-110 transition"
      >
        Return to Dashboard
      </Link>
    </div>
  )
}
