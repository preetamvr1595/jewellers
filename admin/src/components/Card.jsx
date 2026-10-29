import React from 'react'

export default function Card({children, className=''}){
  return (
    <div className={`card-lux p-6 ${className}`}>
      {children}
    </div>
  )
}
