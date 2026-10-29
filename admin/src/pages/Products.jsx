import React, {useState, useEffect} from 'react'
import Card from '../components/Card'
import ProductCard from '../components/ProductCard'
import { Link, useNavigate } from 'react-router-dom'
import { listProducts, deleteProduct } from '../services/productService'

export default function Products(){
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(()=>{
    fetch()
  },[])

  async function fetch(){
    try{
      const res = await listProducts()
      setItems(res.data)
    }catch(e){
      console.error(e)
    }
  }

  const filteredItems = items.filter(it => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    return (
      (it.name && it.name.toLowerCase().includes(term)) ||
      (it.category && it.category.toLowerCase().includes(term)) ||
      (it.purity && it.purity.toLowerCase().includes(term))
    )
  })

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif">Products Catalog</h2>
          <p className="text-xs text-gray-500 mt-1">Showing {filteredItems.length} of {items.length} items</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title, purity..."
            className="px-3.5 py-1.5 text-sm bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C6A75E] w-64"
          />
          <Link to="/admin/products/new" className="py-2 px-4 bg-gold text-white rounded">Add Product</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 && (
          <Card>
            <div className="text-gray-500 py-6 text-center">No products matching "{searchTerm}"</div>
          </Card>
        )}
        {filteredItems.map(it=> (
          <div key={it._id} className="relative">
            <ProductCard product={it} />
            <div className="absolute top-2 right-2 flex gap-2">
              <Link to={`/admin/products/${it._id}/edit`} className="py-1 px-2 bg-white border rounded text-sm">Edit</Link>
              <button onClick={async ()=>{
                if(!confirm('Delete this product?')) return
                try{
                  await deleteProduct(it._id)
                  fetch()
                  alert('Deleted')
                }catch(e){
                  console.error(e)
                  alert('Delete failed')
                }
              }} className="py-1 px-2 bg-red-600 text-white rounded text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
