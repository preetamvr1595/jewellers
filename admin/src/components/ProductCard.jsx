import React from 'react'
import { API_BASE } from '../services/api'

export default function ProductCard({product}){
  const imgRaw = product?.images?.[0]
  let imgUrl = null
  if(imgRaw){
    if(typeof imgRaw === 'string') {
      if (imgRaw.startsWith('http') || imgRaw.startsWith('blob:') || imgRaw.startsWith('data:')) {
        imgUrl = imgRaw
      } else {
        const cleanPath = imgRaw.startsWith('/') ? imgRaw.slice(1) : imgRaw;
        imgUrl = `${API_BASE}/${cleanPath}`;
      }
    }
    else imgUrl = imgRaw.url || imgRaw.secure_url || null
  }
  return (
    <div className="card-lux overflow-hidden group">
      <div className="h-64 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
        {imgUrl ? (
          <img 
            src={imgUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              console.error('Image load failed:', imgUrl);
              e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
            }}
          />
        ) : (
          <div className="text-sm text-gray-400">No image</div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] text-gold font-bold uppercase tracking-widest">{product.category}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="text-[10px] text-gray-400 font-medium uppercase">{product.hallmark}</span>
        </div>
        <h3 className="font-serif text-lg text-gray-900 leading-snug line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{product.weight}</p>
      </div>
    </div>
  )
}

