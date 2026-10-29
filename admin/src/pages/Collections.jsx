import React, { useState, useEffect } from 'react'
import { listProducts, createProduct, updateProduct, deleteProduct } from '../services/productService'
import { uploadImage } from '../services/uploadService'
import { API_BASE } from '../services/api'

const CATEGORIES = [
  { key: 'all', label: 'All Pieces' },
  { key: 'bridal', label: 'Bridal Sets' },
  { key: 'diamond', label: 'Diamond' },
  { key: 'necklaces', label: 'Necklaces' },
  { key: 'bangles', label: 'Bangles' },
  { key: 'earrings', label: 'Earrings' },
  { key: 'rings', label: 'Rings' },
  { key: 'chains', label: 'Chains' },
  { key: 'mangalsutra', label: 'Mangalsutra' },
  { key: 'anklets', label: 'Anklets' },
  { key: 'pendants', label: 'Pendants' }
]

export default function Collections() {
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    return `${API_BASE}/${cleanPath}`;
  };

  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const res = await listProducts()
      setProducts(res.data)
    } catch (e) {
      console.error('Error fetching products', e)
    }
    setLoading(false)
  }

  const filteredProducts = products.filter(p => {
    // Category filter
    if (activeCategory !== 'all' && p.category !== activeCategory) return false
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    }
    return true
  })

  const categoryCount = (cat) => {
    if (cat === 'all') return products.length
    return products.filter(p => p.category === cat).length
  }

  function openAddModal() {
    setEditingProduct({
      name: '',
      description: '',
      category: activeCategory === 'all' ? 'necklaces' : activeCategory,
      hallmark: 'HUID',
      purity: '22K Gold (91.6%)',
      weight: '',
      images: [],
      tag: ''
    })
    setPreviewUrl(null)
    setSelectedFile(null)
    setShowModal(true)
  }

  function openEditModal(product) {
    setEditingProduct({ ...product })
    const mainImg = (product.images && product.images[0]) || product.image;
    setPreviewUrl(mainImg ? getImageUrl(mainImg) : null)
    setSelectedFile(null)
    setShowModal(true)
  }

  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      let finalProduct = { ...editingProduct }

      if (selectedFile) {
        const uploadData = new FormData()
        // Use 'images' to match the multer config in the backend
        uploadData.append('images', selectedFile)
        const res = await uploadImage(uploadData)
        // Backend returns { urls: [...] } or { url: '...' }
        const imageUrl = res.data.url || (res.data.urls && res.data.urls[0])
        if (imageUrl) {
          finalProduct.images = [imageUrl]
          finalProduct.image = imageUrl 
        }
      }

      const id = finalProduct._id || finalProduct.id
      if (id) {
        await updateProduct(id, finalProduct)
        alert('Product updated successfully!')
      } else {
        await createProduct(finalProduct)
        alert('Product added successfully!')
      }
      setShowModal(false)
      fetchProducts()
    } catch (e) {
      console.error('Save error', e)
      alert('Failed to save: ' + (e.response?.data?.message || e.message))
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct(id)
      fetchProducts()
    } catch (e) {
      console.error('Delete error', e)
      alert('Failed to delete')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif">Collection Management</h2>
        <button onClick={openAddModal} className="py-2 px-4 bg-gold text-white rounded hover:opacity-90">
          + Add New Product
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat.key
                ? 'bg-gold text-white'
                : 'bg-white border hover:bg-gray-100'
            }`}
          >
            {cat.label} ({categoryCount(cat.key)})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products in this category. Click "Add New Product" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => {
            const displayImg = (product.images && product.images[0]) || product.image;
            return (
              <div key={product._id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="aspect-square bg-gray-100 relative">
                  {displayImg ? (
                    <img
                      src={getImageUrl(displayImg)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                {product.tag && (
                  <span className="absolute top-2 left-2 bg-gold text-white text-xs px-2 py-1 rounded">
                    {product.tag}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <p className="text-xs text-gray-500 truncate">{product.description}</p>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-gray-400">{product.weight}</span>
                </div>

                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-serif">
                  {editingProduct._id ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Royal Bridal Necklace Set"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                      <option key={cat.key} value={cat.key}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Describe the product..."
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (g)</label>
                  <input
                    type="text"
                    value={editingProduct.weight}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., 12.5g"
                  />
                </div>

                {/* Hallmark & Purity Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hallmark</label>
                    <select
                      value={editingProduct.hallmark}
                      onChange={(e) => setEditingProduct({ ...editingProduct, hallmark: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="HUID">HUID</option>
                      <option value="BIS">BIS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purity</label>
                    <select
                      value={editingProduct.purity}
                      onChange={(e) => setEditingProduct({ ...editingProduct, purity: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="22K Gold (91.6%)">22K Gold (91.6%)</option>
                      <option value="18K Gold (75%)">18K Gold (75%)</option>
                      <option value="24K Gold (99.9%)">24K Gold (99.9%)</option>
                    </select>
                  </div>
                </div>

                {/* Tag */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tag (Optional)</label>
                  <select
                    value={editingProduct.tag || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="featured">Featured</option>
                    <option value="bridal">Bridal</option>
                    <option value="trending">Trending</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">Product Image</label>
                  <div className="mt-1 flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {previewUrl ? (
                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <span className="text-[10px] text-gray-400">No Image</span>
                      )}
                    </div>
                    <label className="cursor-pointer bg-white border border-gray-200 px-4 py-2 rounded text-xs font-medium hover:bg-gray-50 transition-colors">
                      Select Image
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-2 bg-gold text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : (editingProduct._id ? 'Update Product' : 'Add Product')}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}