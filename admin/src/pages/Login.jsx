import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../services/authService'
import { setToken } from '../services/authService'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    try{
      const res = await apiLogin({email, password})
      setToken(res.data.token)
      nav('/admin')
    }catch(e){
      setErr(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="w-full max-w-md card-lux p-8">
        <h1 className="text-2xl font-serif text-gray-900">Admin Login</h1>
        {err && <div className="text-red-600">{err}</div>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 border rounded" placeholder="Email" />
          <input value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 border rounded" placeholder="Password" type="password" />
          <button className="w-full py-3 bg-gold text-white rounded">Sign in</button>
        </form>
      </div>
    </div>
  )
}
