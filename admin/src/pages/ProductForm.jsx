import React, {useState, useEffect} from 'react'
import ImageUploader from '../components/ImageUploader'
import { uploadImage } from '../services/uploadService'
import { createProduct, getProduct, updateProduct } from '../services/productService'
import { useNavigate, useParams } from 'react-router-dom'

export default function ProductForm(){
  const [images, setImages] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'bridal',
    tag: '',
    hallmark: 'HUID',
    purity: '22k',
    weight: ''
  })
  const nav = useNavigate()
  const { id } = useParams()

  useEffect(()=>{
    if(!id) return
    ;(async ()=>{
      try{
        const res = await getProduct(id)
        const p = res.data
        setFormData({
          name: p.name || '',
          description: p.description || '',
          category: p.category || 'bridal',
          tag: p.tag || '',
          hallmark: p.hallmark || 'HUID',
          purity: p.purity || '22k',
          weight: p.weight || ''
        })
        setImages(p.images || [])
      }catch(e){
        console.error(e)
        alert('Failed to load product')
      }
    })()
  },[id])

  async function handleSubmit(e){
    e.preventDefault()
    try{
      let urls = []
      const filesToUpload = images.filter(i=> i instanceof File)
      if(filesToUpload.length){
        const fd = new FormData()
        filesToUpload.forEach(f=> fd.append('images', f))
        const up = await uploadImage(fd)
        urls = up.data.urls
      }
      const existingUrls = images.filter(i=> typeof i === 'string')
      const finalImages = [...existingUrls, ...urls]
      
      const data = { ...formData, images: finalImages }
      
      if(id){
        await updateProduct(id, data)
        alert('Product updated successfully!')
      }else{
        await createProduct(data)
        alert('Product added successfully!')
      }
      nav('/admin/products')
    }catch(e){
      console.error(e)
      alert('Error saving product')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="max-w-4xl pb-12">
      <h2 className="text-2xl font-serif mb-6">{id ? 'Edit Product' : 'New Product'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card-lux p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label-lux">Product Name</label>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Temple Kasumalai" className="input-lux" required />
            </div>
            <div className="col-span-2">
              <label className="label-lux">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-lux">
                <option value="bridal">Bridal</option>
                <option value="diamond">Diamond</option>
                <option value="bangles">Bangles</option>
                <option value="necklaces">Necklaces</option>
                <option value="earrings">Earrings</option>
                <option value="chains">Chains</option>
                <option value="rings">Rings</option>
                <option value="mangalsutra">Mangalsutra</option>
                <option value="anklets">Anklets</option>
                <option value="pendants">Pendants</option>
              </select>
            </div>
          </div>

          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label-lux">Hallmark</label>
              <input name="hallmark" value={formData.hallmark} onChange={handleChange} className="input-lux" />
            </div>
            <div>
              <label className="label-lux">Purity</label>
              <input name="purity" value={formData.purity} onChange={handleChange} className="input-lux" />
            </div>
            <div>
              <label className="label-lux">Weight</label>
              <input name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 42.5g" className="input-lux" />
            </div>
          </div>

          <div>
            <label className="label-lux">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product details..." className="input-lux" rows={4}></textarea>
          </div>
        </div>

        <div className="card-lux p-6">
          <label className="label-lux mb-2 block">Product Images</label>
          <ImageUploader onChange={(files)=>setImages(files)} initialImages={images.filter(i=> typeof i === 'string')} />
        </div>

        <div className="flex gap-4 justify-end">
          <button type="button" onClick={()=>nav('/admin/products')} className="px-6 py-2 border border-gray-200 rounded-lg">Cancel</button>
          <button type="submit" className="btn-lux px-10 py-2">
            {id ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
