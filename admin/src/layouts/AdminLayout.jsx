import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function requireAuth(){
  return !!localStorage.getItem('jwt')
}

export default function AdminLayout(){
  const nav = useNavigate()
  useEffect(()=>{
    if(!requireAuth()) nav('/admin/login')
  },[])
  return (
    <div className="min-h-screen flex bg-ivory">
      <Sidebar />
      <div className="flex-1 p-8">
        <Topbar />
        <main className="mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
