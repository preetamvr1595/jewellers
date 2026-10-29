import React, {useState, useRef, useEffect} from 'react'
import { API_BASE } from '../services/api'

export default function ImageUploader({onChange, initialImages=[]}){
  const [items, setItems] = useState([]) // items: {type:'url'|'file', src, file?}
  const inputRef = useRef()

  useEffect(()=>{
    if(initialImages && initialImages.length){
      const init = initialImages.map(u=> {
        let src = u
        if (typeof u === 'string' && !u.startsWith('http') && !u.startsWith('blob:') && !u.startsWith('data:')) {
          const cleanPath = u.startsWith('/') ? u.slice(1) : u;
          src = `${API_BASE}/${cleanPath}`;
        }
        return {type:'url', src}
      })
      setItems(init)
      if(onChange) onChange(initialImages.slice())
    }
  },[initialImages])

  function handleFiles(selected){
    const arr = Array.from(selected)
    const added = arr.map(f=> ({type:'file', file:f, src: URL.createObjectURL(f)}))
    const next = [...items, ...added]
    setItems(next)
    if(onChange) onChange(next.map(i=> i.type === 'file' ? i.file : i.src))
  }

  function removeAt(idx){
    const next = items.filter((_,i)=> i!==idx)
    setItems(next)
    if(onChange) onChange(next.map(i=> i.type === 'file' ? i.file : i.src))
  }

  return (
    <div>
      <div className="border-dashed border-2 border-gray-200 p-6 rounded-lg text-center bg-white">
        <p className="text-sm text-gray-600">Drag & drop images here or</p>
        <button type="button" onClick={()=>inputRef.current.click()} className="mt-3 px-4 py-2 bg-gold text-white rounded">Select Images</button>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={(e)=>handleFiles(e.target.files)} />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {items.map((f,i)=> (
          <div key={i} className="h-24 w-24 bg-gray-50 rounded overflow-hidden border relative">
            <button onClick={()=>removeAt(i)} className="absolute top-1 right-1 bg-white rounded-full px-1 py-0.5 text-xs">✕</button>
            <img src={f.src} className="h-full w-full object-cover" alt="preview" />
          </div>
        ))}
      </div>
    </div>
  )
}
